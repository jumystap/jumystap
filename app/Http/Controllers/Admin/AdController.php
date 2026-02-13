<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\AdCategory;
use App\Models\City;
use App\Models\BusinessType;
use App\Enums\AdStatus;
use App\Enums\AdType;
use App\Http\Requests\Admin\Ad\StoreAdRequest;
use App\Http\Requests\Admin\Ad\UpdateAdRequest;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
class AdController extends Controller
{
    public function index(Request $request): View
    {
        $query = Ad::with(['user', 'category', 'city'])
            ->withCount('photos');

        // Фильтры
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('id', $request->search)
                    ->orWhereHas('user', function($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%")
                            ->orWhere('phone', 'like', "%{$request->search}%");
                    });
            });
        }

        // Сортировка
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $ads = $query->paginate(20);

        // Данные для фильтров
        $categories = AdCategory::all();
        $cities = City::all();
        $statuses = AdStatus::cases();
        $types = AdType::cases();

        return view('admin.ads.index', compact('ads', 'categories', 'cities', 'statuses', 'types'));
    }

    public function create(): View
    {
        $categories = AdCategory::all();
        $cities = City::all();
        $businessTypes = BusinessType::all();
        $types = AdType::cases();
        // Удаляем передачу всех пользователей - теперь используем AJAX поиск

        return view('admin.ads.create', compact('categories', 'cities', 'businessTypes', 'types'));
    }

    public function store(StoreAdRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Создаем объявление
            $ad = Ad::query()->create([
                'user_id' => $request->user_id,
                'type' => $request->type,
                'title' => $request->title,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id,
                'city_id' => $request->city_id,
                'address' => $request->address,
                'is_remote' => $request->boolean('is_remote'),
                'price_type' => $request->price_type,
                'price_exact' => $request->price_exact,
                'price_from' => $request->price_from,
                'price_to' => $request->price_to,
                'phone' => $request->phone,
                'use_profile_phone' => $request->boolean('use_profile_phone'),
                'instagram' => $request->instagram,
                'tiktok' => $request->tiktok,
                'twogis' => $request->twogis,
                'site' => $request->site,
                'business_type_id' => $request->business_type_id,
                'status' => $request->status ?? AdStatus::MODERATION,
                'published_at' => $request->status === AdStatus::ACTIVE->value ? now() : null,
            ]);

            // Обработка фотографий
            if ($request->hasFile('photos')) {
                $this->handlePhotoUploads($ad, $request->file('photos'));
            }

            // Записываем историю статуса
            $ad->statusHistory()->create([
                'status_from' => AdStatus::DRAFT->value,
                'status_to' => $ad->status->value,
                'changed_by' => auth()->id(),
                'comment' => 'Создано администратором',
                'changed_at' => now(),
            ]);

            DB::commit();

            return redirect()
                ->route('admin.ads.show', $ad)
                ->with('success', 'Объявление успешно создано');

        } catch (Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ошибка при создании объявления: ' . $e->getMessage());
        }
    }

    public function show(Ad $ad): View
    {
        $ad->load([
            'user',
            'category',
            'subcategory',
            'city',
            'businessType',
            'photos',
            'statusHistory.changedBy',
            'views' => fn($q) => $q->orderBy('viewed_at', 'desc')->limit(50)
        ]);

        return view('admin.ads.show', compact('ad'));
    }

    public function edit(Ad $ad): View
    {
        $categories = AdCategory::all();
        $cities = City::all();
        $businessTypes = BusinessType::all();
        $statuses = AdStatus::cases();
        $types = AdType::cases();
        // Удаляем передачу всех пользователей

        return view('admin.ads.edit', compact('ad', 'categories', 'cities', 'businessTypes', 'statuses', 'types'));
    }

    public function update(UpdateAdRequest $request, Ad $ad)
    {
        try {
            DB::beginTransaction();

            $oldStatus = $ad->status;
            $data = $request->validated();

            $data['is_remote'] = $data['is_remote'] ?? 0;
            $data['use_profile_phone'] = $data['use_profile_phone'] ?? 0;

            // Обновляем объявление
            $ad->update($data);

            // Обработка новых фотографий
            if ($request->hasFile('photos')) {
                $currentPhotosCount = $ad->photos()->count();
                $newPhotosCount = count($request->file('photos'));

                if ($currentPhotosCount + $newPhotosCount <= 6) {
                    $this->handlePhotoUploads($ad, $request->file('photos'));
                } else {
                    return back()->with('error', 'Превышен лимит фотографий (максимум 6)');
                }
            }

            // Записываем историю если статус изменился
            if ($oldStatus->value !== $ad->status->value) {
                $ad->statusHistory()->create([
                    'status_from' => $oldStatus->value,
                    'status_to' => $ad->status->value,
                    'changed_by' => auth()->id(),
                    'comment' => $request->status_comment,
                    'changed_at' => now(),
                ]);

                // Если статус изменился на ACTIVE, устанавливаем published_at
                if ($ad->status === AdStatus::ACTIVE && !$ad->published_at) {
                    $ad->update(['published_at' => now()]);
                }
            }

            DB::commit();

            return redirect()
                ->route('admin.ads.show', $ad)
                ->with('success', 'Объявление успешно обновлено');

        } catch (Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ошибка при обновлении объявления: ' . $e->getMessage());
        }
    }

    public function destroy(Ad $ad): RedirectResponse
    {
        try {
            // Удаляем все фотографии
            foreach ($ad->photos as $photo) {
                Storage::delete([$photo->path, $photo->thumbnail_path]);
            }

            $ad->delete();

            return redirect()
                ->route('admin.ads.index')
                ->with('success', 'Объявление удалено');

        } catch (Exception $e) {
            return back()->with('error', 'Ошибка при удалении: ' . $e->getMessage());
        }
    }

    public function deletePhoto(Ad $ad, $photoId): JsonResponse
    {
        try {
            $photo = $ad->photos()->findOrFail($photoId);

            // Удаляем файлы
            Storage::delete([$photo->path, $photo->thumbnail_path]);

            // Удаляем запись
            $photo->delete();

            return response()->json(['success' => true]);

        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function approve(Ad $ad): RedirectResponse
    {
        if ($ad->changeStatus(AdStatus::ACTIVE)) {
            $ad->update(['published_at' => now()]);
            return back()->with('success', 'Объявление одобрено');
        }

        return back()->with('error', 'Ошибка при одобрении');
    }

    public function reject(Request $request, Ad $ad): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        if ($ad->changeStatus(AdStatus::REJECTED, $request->reason)) {
            return back()->with('success', 'Объявление отклонено');
        }

        return back()->with('error', 'Ошибка при отклонении');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'ads' => 'required|array',
            'ads.*' => 'exists:ads,id',
            'action' => 'required|in:approve,reject,delete'
        ]);

        try {
            DB::beginTransaction();

            $ads = Ad::whereIn('id', $request->ads)->get();

            foreach ($ads as $ad) {
                match($request->action) {
                    'approve' => $ad->changeStatus(AdStatus::ACTIVE),
                    'reject' => $ad->changeStatus(AdStatus::REJECTED, 'Массовое отклонение'),
                    'delete' => $ad->delete(),
                };
            }

            DB::commit();

            return back()->with('success', 'Действие выполнено для ' . count($ads) . ' объявлений');

        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Ошибка при выполнении действия');
        }
    }

    /**
     * Handle photo uploads with Intervention Image v3 (WebP format)
     */
    private function handlePhotoUploads(Ad $ad, array $photos): void
    {
        $order = $ad->photos()->max('order') ?? 0;

        foreach ($photos as $uploadedPhoto) {
            // Генерируем уникальное имя файла (теперь с расширением .webp)
            $fileName = uniqid() . '_' . time() . '.webp';
            $path = 'ads/' . $ad->id . '/' . $fileName;
            $thumbnailPath = 'ads/' . $ad->id . '/thumb_' . $fileName;

            // Обрабатываем и сохраняем оригинал (макс 1920px по длинной стороне)
            $originalImage = Image::read($uploadedPhoto);

            // Изменяем размер, если изображение слишком большое (сохраняем пропорции)
            $originalImage->scale(width: 1200, height: 1200);

            // Конвертируем в WebP с качеством 85%
            $originalWebp = $originalImage->toWebp(85);

            // Сохраняем оригинал
            Storage::disk('public')->put($path, $originalWebp);

            // Создаем миниатюру 300x300 с качеством 80%
            $thumbnail = Image::read($uploadedPhoto)
                ->cover(300, 300)
                ->toWebp(80);

            // Сохраняем миниатюру
            Storage::disk('public')->put($thumbnailPath, $thumbnail);

            // Создаем запись в БД
            $ad->photos()->create([
                'path' => $path,
                'thumbnail_path' => $thumbnailPath,
                'order' => ++$order,
                'is_primary' => $order === 1,
            ]);
        }
    }
}

