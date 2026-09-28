<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class FreeDeletedUsersContactsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:users:free-deleted-contacts {--dry-run : Show what would change without writing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Free phone/email of users deleted before the deleted_ prefix was introduced, so they can register again (blocked accounts keep theirs reserved)';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        // Same rule as Admin\UserController::destroy(): only non-blocked accounts
        // get their contacts freed. Rows already carrying the prefix are skipped —
        // `deleted\_%` escapes the underscore so it is matched literally.
        $query = User::onlyTrashed()
            ->where('is_blocked', false)
            ->where('phone', 'not like', 'deleted\_%');

        $total = (clone $query)->count();

        if ($total === 0) {
            $this->info('Nothing to free: every deleted account already has its contacts released.');

            return self::SUCCESS;
        }

        $this->info(($dryRun ? '[dry-run] ' : '')."Accounts to process: {$total}");

        $processed = 0;

        $query->chunkById(100, function ($users) use ($dryRun, &$processed) {
            foreach ($users as $user) {
                $phone = 'deleted_'.$user->id.'_'.$user->phone;
                $email = $user->email ? 'deleted_'.$user->id.'_'.$user->email : $user->email;

                $this->line("  #{$user->id}: {$user->phone} -> {$phone}");

                if (! $dryRun) {
                    $user->update([
                        'phone' => $phone,
                        'email' => $email,
                    ]);
                }

                $processed++;
            }
        });

        $this->info($dryRun
            ? "[dry-run] Would free contacts of {$processed} accounts. Re-run without --dry-run to apply."
            : "Freed contacts of {$processed} accounts.");

        return self::SUCCESS;
    }
}
