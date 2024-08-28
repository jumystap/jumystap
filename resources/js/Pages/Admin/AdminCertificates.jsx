import AdminLayout from "@/Layouts/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, Form, Select, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { useForm } from '@inertiajs/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Option } = Select;

export default function AdminCertificates({ professions, certificates }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [certificateList, setCertificateList] = useState(certificates);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        profession_id: '',
        phone: '',
        certificate_number: '',
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            post('/certificates', {
                data: values,
                onSuccess: () => {
                    notification.success({
                        message: 'Сертификат добавлен',
                        description: `Сертификат №${values.certificate_number} успешно добавлен.`,
                    });
                    const newCertificate = {
                        ...values,
                        created_at: new Date().toISOString(),
                        profession: professions.find(prof => prof.id === values.profession_id),
                    };
                    setCertificateList([...certificateList, newCertificate]);
                    reset();
                    setIsModalVisible(false);
                },
                onError: () => {
                    notification.error({
                        message: 'Ошибка добавления сертификата',
                        description: 'Произошла ошибка при добавлении сертификата. Пожалуйста, попробуйте снова.',
                    });
                }
            });
        }).catch(info => {
            console.log('Validation Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{ padding: 8 }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Поиск по ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Поиск
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Сбросить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Фильтр
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Профессия',
            dataIndex: ['profession', 'name_ru'],
            key: 'profession.name_ru',
            ...getColumnSearchProps('profession.name_ru'),
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Номер сертификата',
            dataIndex: 'certificate_number',
            key: 'certificate_number',
            ...getColumnSearchProps('certificate_number'),
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => text ? new Date(text).toLocaleString() : '',
        },
    ];

    return (
        <AdminLayout>
            <div className="text-3xl font-bold mb-4">Сертификаты</div>
            <Button type="primary" onClick={showModal} className="mb-4">
                Добавить Сертификат
            </Button>
            <Table columns={columns} dataSource={certificateList} rowKey="id" />
            <Modal
                title="Добавить Сертификат"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Form.Item
                        name="profession_id"
                        label="Профессия"
                        rules={[{ required: true, message: 'Пожалуйста, выберите профессию' }]}
                    >
                        <Select
                            placeholder="Выберите профессию"
                            onChange={value => setData('profession_id', value)}
                        >
                            {professions.map(profession => (
                                <Option key={profession.id} value={profession.id}>
                                    {profession.name_ru}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Номер телефона"
                        rules={[{ required: true, message: 'Пожалуйста, введите номер телефона' }]}
                    >
                        <PhoneInput
                            country={'kz'}
                            onlyCountries={['kz']}
                            value={data.phone}
                            onChange={phone => setData('phone', phone)}
                            inputStyle={{
                                width: '100%',
                                padding: '20px',
                                paddingLeft: '50px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="certificate_number"
                        label="Номер сертификата"
                        rules={[{ required: true, message: 'Пожалуйста, введите номер сертификата' }]}
                    >
                        <Input
                            placeholder="Введите номер сертификата"
                            value={data.certificate_number}
                            onChange={e => setData('certificate_number', e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}

