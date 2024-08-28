<?php

namespace App\Services;

use App\Repositories\AnalyticsRepository;

class AnalyticsService
{
    protected $analyticsRepository;

    public function __construct(AnalyticsRepository $analyticsRepository)
    {
        $this->analyticsRepository = $analyticsRepository;
    }

    public function getDashboardStatistics(): array
    {
        return [
            'total_users' => $this->analyticsRepository->getTotalUsers(),
            'users_created_yesterday' => $this->analyticsRepository->getUsersCreatedYesterday(),
            'role_2_users' => $this->analyticsRepository->getUsersByRole(2),
            'role_2_users_yesterday' => $this->analyticsRepository->getUsersByRole(2, true),
            'role_not_2_users' => $this->analyticsRepository->getUsersExcludingRole(2),
            'role_not_2_users_yesterday' => $this->analyticsRepository->getUsersExcludingRole(2, true),
            'graduates' => [
                'role_2_is_graduate' => $this->analyticsRepository->getGraduatesCount(2, 1),
                'role_2_is_graduate_yesterday' => $this->analyticsRepository->getGraduatesCount(2, 0, true),
                'role_2_not_graduate' => $this->analyticsRepository->getGraduatesCount(2, 0),
                'role_2_not_graduate_yesterday' => $this->analyticsRepository->getGraduatesCount(2, 0, true),
                'role_2_is_graduate_below_35' => $this->analyticsRepository->getGraduateAgeCount(2, 1,'age', 35, '<='),
                'role_2_is_graduate_below_35_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 1,'age', 35, '<=', true),
                'role_2_is_graduate_above_35' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'age', 35, '>'),
                'role_2_is_graduate_above_35_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'age', 35, '>', true),
                'role_2_not_graduate_below_35' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'age', 35, '<='),
                'role_2_not_graduate_below_35_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'age', 35, '<=', true),
                'role_2_not_graduate_above_35' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'age', 35, '>'),
                'role_2_not_graduate_above_35_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'age', 35, '>', true),
                'role_2_is_graduate_status' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'status', 'В активном поиске', '='),
                'role_2_is_graduate_status_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'status', 'В активном поиске', '=', true),
                'role_2_not_graduate_status' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'status', 'В активном поиске', '='),
                'role_2_not_graduate_status_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'status', 'В активном поиске', '=', true),
                'role_2_is_graduate_work_status_1' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'work_status', 'Ищет работу', '='),
                'role_2_is_graduate_work_status_1_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'work_status', 'Ищет работу', '=', true),
                'role_2_not_graduate_work_status_1' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'work_status', 'Ищет работу', '='),
                'role_2_not_graduate_work_status_1_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'work_status', 'Ищет работу', '=', true),
                'role_2_is_graduate_work_status_2' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'work_status', 'Ищет заказы', '='),
                'role_2_is_graduate_work_status_2_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'work_status', 'Ищет заказы', '=', true),
                'role_2_not_graduate_work_status_2' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'work_status', 'Ищет заказы', '='),
                'role_2_not_graduate_work_status_2_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'work_status', 'Ищет заказы', '=', true),
                'role_2_is_graduate_ip_status' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'ip', 'Есть ИП', '='),
                'role_2_is_graduate_ip_status_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 1, 'ip', 'Есть ИП', '=', true),
                'role_2_not_graduate_ip_status' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'ip', 'Есть ИП', '='),
                'role_2_not_graduate_ip_status_yesterday' => $this->analyticsRepository->getGraduateAgeCount(2, 0, 'ip', 'Есть ИП', '=', true),
            ],
        ];
    }
}

