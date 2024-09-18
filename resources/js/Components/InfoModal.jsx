import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emails from 'emailjs-com';
import { notification, Select, Button, Checkbox, ConfigProvider } from 'antd';
import { CgClose } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";


export default function InfoModal({ isOpen, onClose, specializations}) {
    const { t } = useTranslation();
    const [isSpecializationOpen, setIsSpecializationOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    if (!isOpen) return null;

    const { Option } = Select;

    const kazakhstanCities = [
        "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
        "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
        "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
        "Экибастуз", "Рудный", "Жезказган"
    ];


    return (
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
                        />
                        <div className='max-h-[300px] mt-4 overflow-y-auto'>
                            {specializations.map((category, index) => (
                                <div className='flex items-center gap-x-2'>
                                    <IoIosArrowForward />
                                    <Checkbox />
                                    <div>{category.name_ru}</div>
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
                ): (
                    <div>
                        <div className='mt-4'>
                            В какой сфере вы ищете работу?
                        </div>
                        <div
                            className='text-blue-500 border-b border-blue-500 mt-2 inline-block cursor-pointer'
                            onClick={() => setIsSpecializationOpen(true)}
                        >
                            +Добавить специальности
                        </div>
                        <div className='mt-5'>
                            Выберите город проживания
                        </div>
                        <Select
                            className='w-full mt-2'
                            defaultValue='Астана'
                            value='Астана'
                        >
                            {kazakhstanCities.map((city) => (
                                <Option value={city}>{city}</Option>
                            ))}
                        </Select>
                        <div className='mt-5'>
                            Выберите район проживания
                         </div>
                        <Select
                            className='w-full mt-2'
                            defaultValue='Астана'
                            value='Есиль'
                        >
                            {kazakhstanCities.map((city) => (
                                <Option value={city}>{city}</Option>
                            ))}
                        </Select>
                        <button
                            className='mt-7 bg-blue-500 rounded-lg w-full text-center text-white py-2'
                        >
                            Сохранить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
