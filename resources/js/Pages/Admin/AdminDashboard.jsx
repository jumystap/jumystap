import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Row, Col, Card, Statistic } from "antd";

export default function AdminDashboard({ auth, statistics }) {

    return (
        <AdminLayout>
            <Head title="JUMYSTAP - Административная панель" />
            <div className="text-3xl font-bold mb-4">Добро пожаловать!</div>

            <div className="mb-4">
                <div className="text-xl font-semibold mb-4">Общее количество пользователей</div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Всего пользователей" value={statistics.total_users}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Зарегистрированы вчера" value={statistics.users_created_yesterday}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Соискатели" value={statistics.role_2_users}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Соискатели (вчера)" value={statistics.role_2_users_yesterday}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="mb-4">
                <div className="text-xl font-semibold mb-4">Общее количество работодателей</div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Работодатели" value={statistics.role_not_2_users}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Работодатели (вчера)" value={statistics.role_not_2_users_yesterday}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="mb-4">
                <div className="text-xl font-semibold mb-4">В активном поиске</div>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card bordered={false}>
                            <Statistic title="Соискатели (в активном поиске)" value={statistics.graduates.role_2_is_graduate_status}/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}>
                            <Statistic title="Соискатели (в активном поиске, вчера)" value={statistics.graduates.role_2_is_graduate_status_yesterday}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="mb-4">
                <div className="text-xl font-semibold mb-4">Группы работодателей</div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Выпускники (до 35 лет)" value={statistics.graduates.role_not_2_is_graduate_below_35}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Выпускники (до 35 лет, вчера)" value={statistics.graduates.role_not_2_is_graduate_below_35_yesterday}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Выпускники (старше 35 лет)" value={statistics.graduates.role_not_2_is_graduate_above_35}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Выпускники (старше 35 лет, вчера)" value={statistics.graduates.role_not_2_is_graduate_above_35_yesterday}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="mb-4">
                <div className="text-xl font-semibold mb-4">Статус работы работодателей</div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Ищут работу" value={statistics.graduates.role_not_2_is_graduate_work_status_1}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Ищут работу (вчера)" value={statistics.graduates.role_not_2_is_graduate_work_status_1_yesterday}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Ищут заказы" value={statistics.graduates.role_not_2_is_graduate_work_status_2}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Ищут заказы (вчера)" value={statistics.graduates.role_not_2_is_graduate_work_status_2_yesterday}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="mb-4">
                <div className="text-xl font-semibold mb-4">Статус ИП работодателей</div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Есть ИП" value={statistics.graduates.role_not_2_is_graduate_ip_status}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Есть ИП (вчера)" value={statistics.graduates.role_not_2_is_graduate_ip_status_yesterday}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Нет ИП" value={statistics.graduates.role_not_2_not_graduate_ip_status}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic title="Нет ИП (вчера)" value={statistics.graduates.role_not_2_not_graduate_ip_status_yesterday}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
}

