import { notification } from 'antd';

export const handleCertificateAdd = async (certificateNumber, data, certificates, setCertificates, setData, professions, setCertificateNumber) => {
    if (Array.isArray(certificates) && certificates.some(certificate => certificate.number === certificateNumber)) {
        notification.error({
            message: 'Сертификат уже добавлен',
            description: `Сертификат №${certificateNumber} уже добавлен.`,
        });
        return;
    }

    try {
        let response = await fetch(`/api/certificates/${certificateNumber}`);
        let result;

        if (response.ok) {
            result = await response.json();
        } else {
            result = null;
        }

        if (result) {
            const formattedPhone = result.phone.replace(/[\s+()-]/g, '');
            const userPhone = data.phone.replace(/[\s+()-]/g, '');

            if (formattedPhone === userPhone) {
                const profession = professions.find(prof => prof.id === result.profession_id);

                if (profession) {
                    // Append the new certificate to the certificates array
                    setCertificates([...certificates, { number: certificateNumber, profession: profession.name_ru }]);

                    setData(prevData => ({
                        ...prevData,
                        professions_ids: [...prevData.professions_ids, profession.id],
                        certificate_numbers: [...prevData.certificate_numbers, certificateNumber]
                    }));

                    notification.success({
                        message: 'Сертификат подтвержден',
                        description: `Сертификат №${certificateNumber} подтвержден и добавлен в ваш профиль.`,
                    });
                } else {
                    notification.error({
                        message: 'Профессия не найдена',
                        description: `Профессия для сертификата №${certificateNumber} не найдена.`,
                    });
                }
            } else {
                notification.error({
                    message: 'Сертификат не найден',
                    description: `Сертификат №${certificateNumber} не найден или не соответствует вашему номеру телефона.`,
                });
            }
        } else {
            notification.error({
                message: 'Сертификат не найден',
                description: `Сертификат №${certificateNumber} не найден.`,
            });
        }
    } catch (error) {
        console.error('Ошибка при проверке сертификата:', error);
        notification.error({
            message: 'Ошибка проверки сертификата',
            description: 'Произошла ошибка при проверке сертификата. Пожалуйста, попробуйте снова.',
        });
    } finally {
        setCertificateNumber('');
    }
};

