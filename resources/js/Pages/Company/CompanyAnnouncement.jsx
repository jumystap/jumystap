import Guest from "@/Layouts/GuestLayout";
import { Card, Col, Row, Statistic, List, Rate, Button, Modal, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';

export default function CompanyAnnouncement({
    announcement,
    totalViews,
    totalResponses,
    uniqueVisitors,
    repeatedVisitors,
    responseRate,
    viewsOverTime,
    peakViewingTimes,
    respondedUsers
}) {
    const { t, i18n } = useTranslation('companyAnnouncement');
    const [isMobile, setIsMobile] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { get, delete: destroy, processing } = useForm();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showDeleteModal = () => {
        setIsModalVisible(true);
    };

    const handleDelete = () => {
        destroy(`/announcements/${announcement.id}`, {
            onSuccess: () => {
                message.success(t('ad_deleted'));
                setIsModalVisible(false);
            },
            onError: () => {
                message.error(t('ad_deletion_error'));
            },
        });
    };

    const handleRateUser = (userId, rating) => {
        get(route('rate.user', { employee_id:userId, rating: rating }), {
            onSuccess: () => {
                message.success(t('user_rated'));
            },
            onError: () => {
                message.error(t('user_rating_error'));
            },
        });
    };

    return (
        <Guest>
            <div style={{ padding: '20px' }}>
                <div className="text-xl mt-10 font-bold">{announcement.title}</div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title={t('total_views')} value={totalViews} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title={t('total_responses')} value={totalResponses} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title={t('unique_visitors')} value={uniqueVisitors} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title={t('returning_visitors')} value={repeatedVisitors} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title={t('response_rate')} value={responseRate.toFixed(2)} suffix="%" />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24} md={12}>
                        <Card title={t('views_by_time')}>
                            <List
                                dataSource={Object.entries(viewsOverTime)}
                                renderItem={([date, count]) => (
                                    <List.Item>
                                        {date}: {count} {t('views')}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title={t('peak_viewing_time')}>
                            <List
                                dataSource={Object.entries(peakViewingTimes)}
                                renderItem={([hour, count]) => (
                                    <List.Item>
                                        {hour}:00 - {count} {t('views')}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Card title={t('users_who_responded')}>
                            <List
                                dataSource={respondedUsers}
                                renderItem={(user) => (
                                    <List.Item
                                        actions={[
                                            <Rate
                                                onChange={(value) => handleRateUser(user.id, value)}
                                                allowHalf
                                                defaultValue={0}
                                            />
                                        ]}
                                    >
                                        {user.user.name}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button type="primary" danger onClick={showDeleteModal} loading={processing}>
                        {t('delete_ad')}
                    </Button>
                </div>

                <Modal
                    title={t('confirm_deletion')}
                    visible={isModalVisible}
                    onOk={handleDelete}
                    onCancel={() => setIsModalVisible(false)}
                    okText={t('delete')}
                    cancelText={t('cancel')}
                >
                    {t('delete_ad_confirmation')}
                </Modal>
            </div>
        </Guest>
    );
}

