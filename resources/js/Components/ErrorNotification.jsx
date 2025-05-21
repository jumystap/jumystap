import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const ErrorNotification = ({ namespace = 'common', clearErrors = false }) => {
    const { props } = usePage();
    const backendErrors = props.errors || {};
    const { t} = useTranslation(namespace);
    const [displayedErrors, setDisplayedErrors] = useState(new Set());

    useEffect(() => {
        const errorKeys = Object.keys(backendErrors);
        if (errorKeys.length > 0) {
            errorKeys.forEach((key) => {
                const error = backendErrors[key];
                const errorId = `${key}:${error}`;
                if (!displayedErrors.has(errorId)) {
                    notification.error({
                        key: errorId, // Unique key for Ant Design
                        description: error,
                        placement: 'topRight',
                        duration: 4.5,
                        role: 'alert',
                        'aria-live': 'assertive',
                    });
                    setDisplayedErrors((prev) => new Set([...prev, errorId]));
                }
            });

            if (clearErrors) {
                router.reload({ only: ['errors'], data: { errors: {} }, preserveState: true });
            }
        } else {
            setDisplayedErrors(new Set());
        }
    }, [backendErrors, t, namespace, clearErrors]);

    return null;
};

export default ErrorNotification;
