<?php

namespace App\Rules;

use App\Models\User;
use App\Repositories\AnnouncementRepository;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Translation\PotentiallyTranslatedString;

class CheckAnnouncementAuthor implements ValidationRule
{
    public function __construct(private readonly AnnouncementRepository $announcementRepository)
    {
    }

    /**
     * Run the validation rule.
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure(string, ?string=): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        /** @var User $user */
        $user = Auth::user();

        if(!$this->announcementRepository->existsByIdAndUserId($value, $user->id)
            && $user->role->name != 'admin'){
            $fail(__('messages.announcements.errors.does_not_access_to_update'));
        }
    }
}
