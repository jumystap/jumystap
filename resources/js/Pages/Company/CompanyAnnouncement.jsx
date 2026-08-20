import Guest from "@/Layouts/GuestLayout";
import { Card, Col, Row, Statistic, List, Button, Modal, Radio, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, router } from '@inertiajs/react';

export default function CompanyAnnouncement({
    announcement,
    totalViews,
    totalResponses,
    uniqueVisitors,
    repeatedVisitors,
    responseRate,
    respondedUsers
}) {
    const { t } = useTranslation('companyAnnouncement');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
    const [employeeFound, setEmployeeFound] = useState(null); // null, 'yes', or 'no'

    const { delete: destroy, processing } = useForm();

    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const showArchiveModal = () => {
        setIsArchiveModalVisible(true);
        setEmployeeFound(null); // Reset selection
    };

    const handleDelete = () => {
        destroy(`/announcements/${announcement.id}`, {
            onSuccess: () => {
                message.success(t('announcement_deleted'));
                setIsDeleteModalVisible(false);
            },
            onError: () => {
                message.error(t('announcement_deletion_error'));
            },
        });
    };

    const handleArchive = () => {
        if (employeeFound === null) {
            message.error(t('select_one_variant'));
            return;
        }

        router.post(
            `/announcements/archive`,
            {
                id: announcement.id,
                is_employee_found: employeeFound === 'yes',
                republish: employeeFound === 'republish',
            },
            {
                onSuccess: () => {
                    message.success(t('announcement_archived'));
                    setIsArchiveModalVisible(false);
                    setEmployeeFound(null);
                },
                onError: () => {
                    message.error(t('announcement_archivation_error'));
                },
            }
        );
    };

    return (
        <Guest>
            <div style={{ padding: '20px' }}>
                <div className="text-xl mt-10 font-bold">{announcement.title}</div>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={12} md={8}>
                        <Card>
                            <Statistic title={t('total_views')} value={totalViews} />
                        </Card>
                    </Col>
                    <Col xs={12} md={8}>
                        <Card>
                            <Statistic title={t('total_responses')} value={totalResponses} />
                        </Card>
                    </Col>
                    <Col xs={12} md={8}>
                        <Card>
                            <Statistic title={t('unique_visitors')} value={uniqueVisitors} />
                        </Card>
                    </Col>
                    <Col xs={12} md={8}>
                        <Card>
                            <Statistic title={t('returning_visitors')} value={repeatedVisitors} />
                        </Card>
                    </Col>
                    <Col xs={12} md={8}>
                        <Card>
                            <Statistic title={t('response_rate')} value={Number(responseRate).toFixed(2)} suffix="%" />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Card title={t('users_who_responded')}>
                            <List
                                dataSource={respondedUsers}
                                locale={{ emptyText: t('no_responses_yet') }}
                                renderItem={(respond) => (
                                    <List.Item
                                        actions={[
                                            respond.resume_id ? (
                                                <a
                                                    href={`/resumes/${respond.resume_id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {t('view_resume')}
                                                </a>
                                            ) : (
                                                <span style={{ color: '#999' }}>{t('no_resume')}</span>
                                            )
                                        ]}
                                    >
                                        <div>
                                            {respond.user ? (
                                                <a
                                                    href={`/user/${respond.user.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {respond.user.name}
                                                </a>
                                            ) : (
                                                <span style={{ color: '#999' }}>{t('deleted_user')}</span>
                                            )}
                                            {respond.responded_at && (
                                                <div style={{ fontSize: 12, color: '#999' }}>
                                                    {respond.responded_at}
                                                </div>
                                            )}
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button type="primary" danger onClick={showDeleteModal} loading={processing}>
                        {t('delete_announcement')}
                    </Button>

                    {(announcement.status === 0 || announcement.status === 1) && (
                        <Button
                            type="primary"
                            className="ml-1"
                            danger
                            onClick={showArchiveModal}
                            loading={processing}
                        >
                            {t('archive_announcement')}
                        </Button>
                    )}
                </div>

                <Modal
                    title={t('confirm_deletion')}
                    open={isDeleteModalVisible}
                    onOk={handleDelete}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    okText={t('delete')}
                    cancelText={t('cancel')}
                >
                    {t('delete_announcement_confirmation')}
                </Modal>

                <Modal
                    title={t('confirm_archive')}
                    open={isArchiveModalVisible}
                    onOk={handleArchive}
                    onCancel={() => {
                        setIsArchiveModalVisible(false);
                        setEmployeeFound(null);
                    }}
                    okText={t('send')}
                    cancelText={t('cancel')}
                >
                    {t('have_you_found_an_employee')}
                    <Radio.Group
                        onChange={(e) => setEmployeeFound(e.target.value)}
                        value={employeeFound}
                        style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                        <Radio value="yes">{t('yes')}</Radio>
                        <Radio value="no">{t('no')}</Radio>
                        <Radio value="republish">{t('republish')}</Radio>
                    </Radio.Group>
                </Modal>
            </div>
        </Guest>
    );
}
