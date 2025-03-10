import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMailOpenOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Dashboard({ user, announcements }) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const { t, i18n } = useTranslation('dashboard');

    const openCreateAnnouncementModal = () => {
        setSelectedAnnouncement(null);
    };

    const openEditAnnouncementModal = (announcement) => {
        setSelectedAnnouncement(announcement);
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
            <div className='grid grid-cols-1 md:grid-cols-7'>
                <div className='col-span-5 pt-10'>
                    <div className='md:px-5 p-5'>
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
                            <LuPhone className='text-xl' />
                            <div>{formatPhoneNumber(user.phone)}</div>
                        </div>
                        <div className='flex mt-5 gap-x-2 font-semibold text-xl'>
                            <div>{vacancyCount + orderCount} <span className='text-gray-500 font-light text-base'>{t('vacancies', { ns: 'dashboard' })}</span></div>
                        </div>
                        <div className='flex md:flex-row flex-col gap-x-2 gap-y-4 mt-5'>
                            <Link href='/update'
                                className='text-black border border-gray-300 rounded-lg text-center items-center inline-block py-2 px-10 cursor-pointer'
                            >
                                <span className='text-light text-sm'>{t('update', { ns: 'dashboard' })}</span>
                            </Link>
                            <Link href="/create_announcement"
                                className='inline-block text-white rounded-lg text-center bg-blue-500 py-2 px-10 cursor-pointer'
                            >
                                <span className='font-light text-sm'>{t('create_announcement', { ns: 'dashboard' })}</span>
                            </Link>
                        </div>
                    </div>
                    <div className='p-3 font-semibold'>{t('your_announcements', { ns: 'dashboard' })}</div>
                    <div className='rounded-lg '>
                        {user.announcement.length > 0 ? (
                            <div className='grid md:grid-cols-1 grid-cols-1'>
                                {user.announcement.map((anonce, index) => (
                                    <div key={index} className='p-3 border-t border-gray-300 w-full'>
                                        <div className='flex items-center'>
                                            {!anonce.active && (
                                                <div className=' text-sm text-gray-500'>
                                                    {t('on_moderation', { ns: 'dashboard' })}
                                                </div>
                                            )}
                                            <div className="ml-auto">
                                                <div className='font-bold text-sm ml-auto'>
                                                    {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                                    {anonce.salary_type == 'min' && anonce.cost_min && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                                    {anonce.salary_type == 'max' && anonce.cost_max && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                                    {anonce.salary_type == 'diapason' && anonce.cost_max && anonce.cost_min && (`от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                                    {anonce.salary_type == 'undefined' && (`Договорная`)}
                                                    {anonce.salary_type == 'za_smenu' && (
                                                        <>
                                                            {anonce.cost && `${anonce.cost.toLocaleString()} ₸ / за смену`}
                                                            {anonce.cost_min && !anonce.cost_max && `от ${anonce.cost_min.toLocaleString()} ₸ / за смену`}
                                                            {!anonce.cost_min && anonce.cost_max && `до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                                                            {anonce.cost_min && anonce.cost_max && `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                                                        </>
                                                    )}
                                            </div>
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            {anonce.title}
                                        </div>
                                        <div className='flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm'>
                                            <FaLocationDot className='text-blue-500' />
                                            {anonce.city}
                                        </div>
                                        <div className='text-sm font-light text-gray-500 mt-2'>
                                            {t('posted', { ns: 'dashboard' })} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: ru, addSuffix: true })}`}
                                        </div>
                                        <div className='text-sm font-light text-gray-500 mt-2'>
                                            {anonce.visit_count} {t('views', { ns: 'dashboard' })}
                                        </div>
                                        <div className='flex md:flex-row flex-col mt-4 gap-x-5 gap-y-2'>
                                            <Link className='block w-full text-center border border-gray-300 rounded-lg text-sm py-2' href={`/profile/announcement/${anonce.id}`}>{t('view', { ns: 'dashboard' })}</Link>
                                            <Link className='block w-full text-center py-2 text-gray-500 font-light text-sm' href={`/announcement/update/${anonce.id}`}>{t('update', { ns: 'dashboard' })}</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='flex md:h-[200px] h-full'>
                                <div className='my-auto mx-auto text-gray-400 md:text-2xl text-lg font-bold'>{t('dont_have_any_ads', { ns: 'dashboard' })}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='md:block hidden col-span-2 border-l border-gray-200 pt-5 h-screen sticky top-0'>

                </div>
            </div>
        </>
    )
}
