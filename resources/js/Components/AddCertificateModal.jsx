import React, { useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const AddCertificateModal = ({ isOpen, onRequestClose, profession }) => {
    const { t } = useTranslation();
    const [certificateNumber, setCertificateNumber] = useState('');
    const { post } = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/update', {
            data: {
                profession_id: profession.id,
                certificate_number: certificateNumber,
            },
            onSuccess: () => {
                notification.success({
                    message: 'Сертификат обновлен',
                    description: `Сертификат для ${profession.profession_name} обновлен.`,
                });
                onRequestClose();
            },
            onError: (errors) => {
                notification.error({
                    message: 'Ошибка',
                    description: 'Не удалось обновить сертификат.',
                });
            }
        });
    };

    return (
        <Modal
            title="Добавить сертификат"
            visible={isOpen}
            onCancel={onRequestClose}
            footer={[
                <Button key="cancel" onClick={onRequestClose}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Добавить
                </Button>,
            ]}
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="certificateNumber">
                        Укажите номер сертификата для {profession.profession_name}
                    </label>
                    <Input
                        id="certificateNumber"
                        value={certificateNumber}
                        onChange={e => setCertificateNumber(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddCertificateModal;

