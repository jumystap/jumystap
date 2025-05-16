<?php

namespace App\Http\Requests\Announcement;

use App\Repositories\AnnouncementRepository;
use App\Rules\CheckAnnouncementAuthor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AnnouncementArchiveRequest extends FormRequest
{
    public function __construct(
        private readonly AnnouncementRepository $announcementRepository
    )
    {
        parent::__construct();
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:announcements,id', new CheckAnnouncementAuthor($this->announcementRepository)],
            'is_employee_found' => "required|boolean",
            'republish' => "required|boolean",
        ];
    }
}
