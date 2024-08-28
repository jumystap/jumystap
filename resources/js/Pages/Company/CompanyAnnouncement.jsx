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
                message.success('Объявление удалено.');
                setIsModalVisible(false);
            },
            onError: () => {
                message.error('Ошибка при удалении объявления.');
            },
        });
    };

    const handleRateUser = (userId, rating) => {
        get(route('rate.user', { employee_id:userId, rating: rating }), {
            onSuccess: () => {
                message.success('Пользователь оценен.');
            },
            onError: () => {
                message.error('Ошибка при оценке пользователя.');
            },
        });
    };

    return (
        <Guest>
            <div style={{ padding: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Общее количество просмотров" value={totalViews} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Общее количество откликов" value={totalResponses} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Уникальные посетители" value={uniqueVisitors} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Повторные посетители" value={repeatedVisitors} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Процент откликов" value={responseRate.toFixed(2)} suffix="%" />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24} md={12}>
                        <Card title="Просмотры по времени">
                            <List
                                dataSource={Object.entries(viewsOverTime)}
                                renderItem={([date, count]) => (
                                    <List.Item>
                                        {date}: {count} просмотров
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Пиковое время просмотра">
                            <List
                                dataSource={Object.entries(peakViewingTimes)}
                                renderItem={([hour, count]) => (
                                    <List.Item>
                                        {hour}:00 - {count} просмотров
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Card title="Пользователи, которые откликнулись">
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
                        Удалить объявление
                    </Button>
                </div>

                <Modal
                    title="Подтвердите удаление"
                    visible={isModalVisible}
                    onOk={handleDelete}
                    onCancel={() => setIsModalVisible(false)}
                    okText="Удалить"
                    cancelText="Отмена"
                >
                    Вы уверены, что хотите удалить это объявление?
                </Modal>
            </div>
        </Guest>
    );
}

