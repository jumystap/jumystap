import GuestLayout from "@/Layouts/GuestLayout";
import { Table } from 'antd';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Pagination from "@/Components/Pagination.jsx";

export default function EmployerResponses({ responses }) {
    const { t } = useTranslation('dashboard');

    const columns = [
        {
            title: t('col_vacancy'),
            key: 'vacancy',
            render: (_, record) => (
                <Link
                    href={`/profile/announcement/${record.announcement.id}`}
                    className="text-blue-500 hover:underline"
                >
                    {record.announcement.title}
                </Link>
            ),
        },
        {
            title: t('col_response_time'),
            dataIndex: 'responded_at',
            key: 'responded_at',
        },
        {
            title: t('col_responder'),
            key: 'responder',
            render: (_, record) => (
                record.user.name ? (
                    <a
                        href={`/user/${record.user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {record.user.name}
                    </a>
                ) : (
                    <span className="text-gray-400">{t('deleted_user')}</span>
                )
            ),
        },
        {
            title: t('col_resume'),
            key: 'resume',
            render: (_, record) => (
                record.resume_id ? (
                    <a
                        href={`/resumes/${record.resume_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {t('view_resume')}
                    </a>
                ) : (
                    <span className="text-gray-400">{t('no_resume')}</span>
                )
            ),
        },
    ];

    return (
        <GuestLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{t('my_responses_title')}</h1>

                <Table
                    columns={columns}
                    dataSource={responses.data}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    locale={{ emptyText: t('no_responses_yet') }}
                />

                <Pagination links={responses.links} />
            </div>
        </GuestLayout>
    );
}
