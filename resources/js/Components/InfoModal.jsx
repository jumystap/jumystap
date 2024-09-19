import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Select, Button, Checkbox, ConfigProvider, notification } from 'antd';
import { CgClose } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";

export default function InfoModal({ isOpen, onClose, specializations }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, reset } = useForm({
        city: 'Астана',
        area: 'Есиль',
        selectedSpecializations: []
    });
    const [isSpecializationOpen, setIsSpecializationOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Add a state for search term

    const kazakhstanCities = [
        "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
        "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
        "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
        "Экибастуз", "Рудный", "Жезказган"
    ];

    if (!isOpen) return null;

    console.log(data);

    const handleSpecializationChange = (checkedValues) => {
        setData('selectedSpecializations', checkedValues);
    };

    const handleCategoryCheck = (category, isChecked) => {
        const categorySpecializations = category.specialization.map(specialization => specialization.id);
        setData('selectedSpecializations', (prev = []) => {
            if (isChecked) {
                return [...new Set([...prev, ...categorySpecializations])]; // Add specializations, ensuring no duplicates
            } else {
                return prev.filter(id => !categorySpecializations.includes(id)); // Remove category specializations
            }
        });
    };

    const toggleExpandCategory = (categoryId) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    };

    const filterSpecializations = (specializations, searchTerm) => {
        if (!searchTerm) return specializations; // If no search term, return all

        return specializations.map(category => ({
            ...category,
            specialization: category.specialization.filter(specialization =>
                specialization.name_ru.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(category => category.specialization.length > 0); // Remove categories with no specializations
    };

    const onSubmit = (e) => {
        e.preventDefault();

        post('/resume', {
            onSuccess: () => {
                reset();
                setIsSpecializationOpen(false);
                onClose();
                notification.success({
                    message: 'Резюме отправлено успешно!',
                    description: 'Ваше резюме было успешно сохранено.',
                    placement: 'topRight',
                });
            }
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                    <div className='flex items-center'>
                        <div className='font-semibold'>Подберите лучшие вакансии</div>
                        <CgClose
                            className='ml-auto cursor-pointer text-xl'
                            onClick={onClose}
                        />
                    </div>
                    {isSpecializationOpen ? (
                        <div>
                            <input
                                className='mt-5 w-full rounded-lg border-gray-300'
                                placeholder='Поиск'
                                value={searchTerm} // Bind search term to input
                                onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
                            />
                            <div className='max-h-[300px] mt-4 overflow-y-auto'>
                                {filterSpecializations(specializations, searchTerm).map((category) => (
                                    <div key={category.id}>
                                        {Array.isArray(data.selectedSpecializations) && (
                                            <>
                                                <div className='flex items-center gap-x-2'>
                                                    <IoIosArrowForward
                                                        className={`cursor-pointer ${expandedCategories.includes(category.id) ? 'rotate-90' : ''}`}
                                                        onClick={() => toggleExpandCategory(category.id)}
                                                    />
                                                    <div>
                                                        {category.name_ru}
                                                    </div>
                                                </div>
                                                {expandedCategories.includes(category.id) && (
                                                    <div className='ml-5'>
                                                        <ConfigProvider
                                                            theme={{
                                                                token: {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                        >
                                                            <Checkbox.Group
                                                                options={category.specialization.map(specialization => ({
                                                                    label: specialization.name_ru,
                                                                    value: specialization.id
                                                                }))}
                                                                value={data.selectedSpecializations}
                                                                onChange={handleSpecializationChange}
                                                                style={{ display: 'flex', flexDirection: 'column' }}
                                                            />
                                                        </ConfigProvider>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                className='text-white w-full rounded-lg mt-3 bg-blue-500 text-center py-2'
                                onClick={() => setIsSpecializationOpen(false)}
                            >
                                Сохранить
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className='mt-4'>В какой сфере вы ищете работу?</div>
                            <div
                                className='text-blue-500 border-b border-blue-500 mt-2 inline-block cursor-pointer'
                                onClick={() => setIsSpecializationOpen(true)}
                            >
                                +Добавить специальности
                            </div>
                            <div className='mt-5'>Выберите город проживания</div>
                            <Select
                                className='w-full mt-2'
                                defaultValue={data.city}
                                onChange={(value) => setData('city', value)}
                            >
                                {kazakhstanCities.map((city) => (
                                    <Select.Option key={city} value={city}>{city}</Select.Option>
                                ))}
                            </Select>
                            {data.city === 'Астана' && (
                                <>
                                    <div className='mt-5'>Выберите район проживания</div>
                                    <Select
                                        className='w-full mt-2'
                                        defaultValue={data.district}
                                        onChange={(value) => setData('district', value)}
                                    >
                                        <Select.Option value='Есиль'>Есиль</Select.Option>
                                        <Select.Option value='Нура'>Нура</Select.Option>
                                        <Select.Option value='Байконур'>Байконур</Select.Option>
                                        <Select.Option value='Сарыарка'>Сарыарка</Select.Option>
                                    </Select>
                                </>
                            )}
                            <Button
                                type='primary'
                                className='mt-7 w-full'
                                htmlType='submit'
                                disabled={processing}
                            >
                                Сохранить
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

