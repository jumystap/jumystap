import CreateAnnouncementModal from '@/Components/CreateAnnouncementModal';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMailOpenOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Dashboard({user, announcements}) {
    const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const { t, i18n } = useTranslation();

    const openCreateAnnouncementModal = () => {
        setSelectedAnnouncement(null);
        setIsCreateAnnouncementModalOpen(true);
    };

    const openEditAnnouncementModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsCreateAnnouncementModalOpen(true);
    };

    const deleteAnnouncement = (id) => {
        Inertia.delete(route('announcements.delete', { id: id }), {
            onSuccess: () => {
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    }

    const formatPhoneNumber = (phoneNumber) => {
        const countryCode = '+7';
        const areaCode = phoneNumber.slice(1, 4);
        const firstPart = phoneNumber.slice(4, 7);
        const secondPart = phoneNumber.slice(7, 9);
        const thirdPart = phoneNumber.slice(9, 11);

        return `${countryCode} ${areaCode} ${firstPart} ${secondPart} ${thirdPart}`;
    };

    const vacancyCount = user.announcement.filter(anonce => anonce.type_ru === 'Вакансия').length;
    const orderCount = user.announcement.filter(anonce => anonce.type_ru === 'Заказ').length;

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 pt-10 gap-5'>
                <div>
                    <div className='md:px-1 p-5'>
                        <div className='text-left font-bold text-2xl'>{user.name}</div>
                        <div className='mt-3'>
                            <div className='text-left text-gray-500'>
                                {user.description}
                            </div>
                        </div>
                        <div className='flex items-center mt-3 gap-x-2 text-base'>
                            <IoMailOpenOutline className='text-xl' />
                            <div>{user.email}</div>
                        </div>
                        <div className='flex items-center mt-4 gap-x-2 text-base'>
                            <LuPhone className='text-xl'/>
                            <div>{formatPhoneNumber(user.phone)}</div>
                        </div>
                        <div className='flex mt-5 gap-x-2 font-semibold text-xl'>
                            <div>{vacancyCount} <span className='text-gray-500 font-light text-base'>вакансии</span></div>
                            <div>{orderCount} <span className='text-gray-500 font-light text-base'>заказов</span></div>
                        </div>
                        <div className='flex md:flex-row flex-col gap-x-2 gap-y-4 mt-5'>
                            <Link href='/update'
                                className='text-black border border-gray-300 rounded-lg text-center items-center inline-block py-2 px-10 cursor-pointer'
                            >
                                <span className='text-light text-sm'>Редактировать</span>
                            </Link>
                            <Link href="/create_announcement"
                                className='inline-block text-white rounded-lg text-center bg-orange-500 py-2 px-10 cursor-pointer'
                            >
                                <span className='font-light text-sm'>Создать объявление</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-span-2'>
                    <div className='p-3 font-semibold'>Ваши объявления</div>
                    <div className='rounded-lg '>
                        {user.announcement.length > 0 ? (
                            <div className='p-3 grid md:grid-cols-2 grid-cols-1 gap-5'>
                                {user.announcement.map((anonce, index) => (
                                    <div key={index} className='p-3 border border-gray-300 rounded-lg'>
                                        <div className='flex items-center'>
                                            <div className='text-[8pt] font-bold text-white py-1 px-2 rounded bg-[#f36706] '>
                                                {i18n.language === 'ru' ? anonce.type_ru.toUpperCase() : anonce.type_kz.toUpperCase()}
                                            </div>
                                            {!anonce.active && (
                                                <div className='ml-3 text-sm text-gray-500'>
                                                    На модерации
                                                </div>
                                            )}
                                            <div className="ml-auto">
                                                <div className='font-bold text-sm ml-auto'>
                                                    {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                                    {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                                    {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                                    {anonce.salary_type == 'undefined' && (`Договорная`)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            {anonce.title}
                                        </div>
                                        <div className='flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm'>
                                            <FaLocationDot className='text-orange-500' />
                                            {anonce.city}
                                        </div>
                                        <div className='text-sm font-light text-gray-500 mt-2'>
                                            {`Размещено ${formatDistanceToNow(new Date(anonce.created_at), { locale: ru, addSuffix: true })}`}
                                        </div>
                                        <div className='text-sm font-light text-gray-500 mt-2'>
                                            {anonce.visit_count} просмотров
                                        </div>
                                        <div className='flex md:flex-row flex-col mt-4 gap-x-5 gap-y-2'>
                                            <Link className='block w-full text-center border border-gray-300 rounded-lg text-sm py-2' href={`/profile/announcement/${anonce.id}`}>Посмотреть</Link>
                                            <Link className='block w-full text-center py-2 text-gray-500 font-light text-sm' href={`/announcement/update/${anonce.id}`}>Изменить</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='flex md:h-[200px] h-full'>
                                <div className='my-auto mx-auto text-gray-400 md:text-2xl text-lg font-bold'>У вас пока нет объявлений</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CreateAnnouncementModal
                isOpen={isCreateAnnouncementModalOpen}
                onRequestClose={() => setIsCreateAnnouncementModalOpen(false)}
                announcement={selectedAnnouncement}
            />
        </>
    )
}
