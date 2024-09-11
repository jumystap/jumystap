import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useForm } from '@inertiajs/react';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdAccessTime, MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineWorkOutline } from "react-icons/md";
import { useInternalMessage } from "antd/es/message/useMessage";
import { FaLocationDot } from "react-icons/fa6";



export default function Announcement({ auth, announcement, top_announcement, urgent_announcement, more_announcement }) {
    const { t, i18n } = useTranslation();
    const { post, delete: destroy } = useForm();
    const [isFavorite, setIsFavorite] = useState(announcement.is_favorite);

    const handleFavoriteClick = () => {
        if (isFavorite) {
            destroy(`/fav/${announcement.id}`, {
                onSuccess: () => setIsFavorite(false),
            });
        } else {
            post(`/fav/${announcement.id}`, {
                onSuccess: () => setIsFavorite(true),
            });
        }
    };

    const vacancyCount = announcement.user.announcement.filter(anonce => anonce.type_ru === 'Вакансия').length;
    const orderCount = announcement.user.announcement.filter(anonce => anonce.type_ru === 'Заказ').length;

    return (
        <>
            <GuestLayout>
                <div className='grid grid-cols-1 md:grid-cols-7 gap-5'>
                    <div className="md:col-span-5 pt-10">
                        <div className='md:mb-10 mb-2 px-5'>
                            <div className='text-left font-bold text-xl'>{announcement.user.name}</div>
                            <div className='text-left mt-5 text-gray-500'>{announcement.user.description}</div>
                            <div className="flex-wrap">
                                <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                    <div className="flex items-center gap-x-1">
                                        <HiOutlineUserGroup className="text-xl" />
                                        <div>{announcement.responses_count} {announcement.responses_count == 1 && ('отклик')} {announcement.responses_count >= 2 && announcement.responses_count <= 4 && announcement.responses_count != 1 ? ('отклика'):('')} {(announcement.responses_count == 0 || announcement.responses_count >= 5) && ('откликов')}</div>
                                    </div>
                                </div>
                                <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                    <div className="flex items-center gap-x-1">
                                        <MdOutlineRemoveRedEye className="text-xl" />
                                        <div>{announcement.visits_count} {announcement.visits_count == 1 && ('просмотр')} {announcement.visits_count >= 2 && announcement.visits_count <= 4 && announcement.visits_count != 1 ? ('просмотра'):('')} {(announcement.visits_count == 0 || announcement.visits_count >= 5) && ('просмотров')}</div>
                                    </div>
                                </div>
                                {orderCount != 0 && (
                                    <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                        <div className="flex items-center gap-x-1">
                                            <MdOutlineWorkOutline className="text-xl" />
                                            <div>{orderCount} {orderCount == 1 ? ('заказ') : ('заказов')}</div>
                                        </div>
                                    </div>
                                )}
                                {vacancyCount != 0 && (
                                    <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                        <div className="flex items-center gap-x-1">
                                            <MdOutlineWorkOutline className="text-xl" />
                                            <div>{vacancyCount} {vacancyCount == 1 ? ('вакансия') : ('вакансии')}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                {auth.user ? (
                                    <a href={`/connect/${auth.user.id}/${announcement.id}`}
                                       className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg text-center items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                        <span className='font-bold'>Связаться</span>
                                    </a>
                                ) : (
                                     <Link href='/register'
                                        className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg text-center items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                         <span className='font-bold'>Связаться</span>
                                     </Link>
                                )}
                                <div
                                    onClick={handleFavoriteClick}
                                    className={`border-2 ${isFavorite ? 'border-transparent' : 'border-blue-500'} rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                                    {isFavorite ? (
                                        <FaHeart className={`text-blue-500 text-xl`} />
                                    ) : (
                                        <FaRegHeart className="text-blue-500 text-xl" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className=' px-5'>
                            <div className='font-bold text-xl md:text-2xl'>
                                {i18n.language == 'ru' ? (
                                    announcement.type_ru
                                ) : (
                                    announcement.type_kz
                                )}
                            </div>
                            <div className='text-2xl md:text-3xl mt-1 font-bold text-blue-500 max-w-[700px]'>{announcement.title}</div>
                            <div className="mt-2 font-semibold">{announcement.city} {announcement.location && (',')} {announcement.location}</div>
                            <div className='mt-2' style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: announcement.description}} />
                            <div className="mt-5">Тип оплаты: <span className="font-bold">{announcement.payment_type}</span></div>
                            <div className='mt-2'>Стоимость: <span className='font-bold'>
                                {announcement.salary_type == 'exact' && announcement.cost && (`${announcement.cost.toLocaleString() } ₸ `)}
                                {announcement.salary_type == 'min' && (`от ${announcement.cost_min.toLocaleString()} ₸ `)}
                                {announcement.salary_type == 'max' && (`до ${announcement.cost_max.toLocaleString()} ₸ `)}
                                {announcement.salary_type == 'undefined' && (`Договорная`)}
                            </span></div>
                        </div>
                        <Link href='/announcements' className="px-5 mt-5 border-b py-2 border-gray-200 block font-bold">Больше объявлений</Link>
                        {more_announcement.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-1'>
                            {more_announcement.map((anonce, index) => (
                                <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200'>
                                    <div className='flex'>
                                        <div className='flex gap-x-1 text-blue-400 items-center'>
                                            <FaLocationDot className='text-sm'/>
                                            <div className='text-sm'>{anonce.city}, {anonce.location}</div>
                                        </div>
                                    </div>
                                    <div className='mt-7 text-lg font-bold'>
                                        {anonce.title}
                                    </div>
                                    <div className='flex mt-4 gap-x-3 items-center'>
                                        <div className='md:text-xl text-lg font-regular'>
                                            {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                            {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                            {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                            {anonce.salary_type == 'undefined' && (`Договорная`)}
                                        </div>
                                    </div>
                                    <div className='mt-4 text-sm text-gray-500 font-light'>
                                        {anonce.description.length > 60 ? anonce.description.substring(0, 90) + '...' : anonce.description}
                                    </div>
                                    <div className='flex gap-x-1 items-center mt-4'>
                                        <MdAccessTime className='text-xl'/>
                                        <div className='text-sm'>График работы: {anonce.work_time}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        ) : (
                            <div className='text-center'>123123</div>
                        )}
                    </div>
                    <div className="col-span-2 border-l h-screen sticky top-0 border-gray-200">
                        {urgent_announcement && (
                            <Link href={`/announcement/${urgent_announcement.id}`}  className='hover:bg-gray-100 transition-all duration-150 border-b border-gray-300 p-3 w-full hidden md:block '>
                                <div className='flex items-center'>
                                    <div className='uppercase text-white text-xs px-2 bg-red-600 font-bold rounded'>Срочно</div>
                                    <div className='flex items-center font-bold gap-x-2 text-sm ml-auto'>
                                        <SiFireship className='text-red-600 text-lg' />
                                        {urgent_announcement.salary_type == 'exact' && urgent_announcement.cost && (`${urgent_announcement.cost.toLocaleString() } ₸ `)}
                                        {urgent_announcement.salary_type == 'min' && (`от ${urgent_announcement.cost_min.toLocaleString()} ₸ `)}
                                        {urgent_announcement.salary_type == 'max' && (`до ${urgent_announcement.cost_max.toLocaleString()} ₸ `)}
                                        {urgent_announcement.salary_type == 'undefined' && (`Договорная`)}
                                    </div>
                                </div>
                                <div className='mt-3 text-[11pt] max-w-[400px]'>
                                        {urgent_announcement.title}
                                    </div>
                                    <div className='mt-1 text-[11pt] text-gray-500 max-w-[350px]'>
                                        {urgent_announcement.description.length > 60
                                            ? `${urgent_announcement.description.substring(0, 60)}...`
                                            : urgent_announcement.description}
                                    </div>
                            </Link>
                        )}
                        {top_announcement && (
                            <Link href={`/announcement/${top_announcement.id}`} className='md:block hidden w-full hover:bg-gray-100 transition-all duration-150 border-b border-gray-200 p-3'>
                                <div className='flex items-center'>
                                    <div className='uppercase text-white text-xs px-2 bg-blue-500 font-bold rounded'>Топ</div>
                                    <div className='flex gap-x-2 items-center font-bold text-sm ml-auto'>
                                        <FaStar className='text-blue-500 text-lg'/>
                                        {top_announcement.salary_type == 'exact' && top_announcement.cost && (`${top_announcement.cost.toLocaleString() } ₸ `)}
                                        {top_announcement.salary_type == 'min' && (`от ${top_announcement.cost_min.toLocaleString()} ₸ `)}
                                        {top_announcement.salary_type == 'max' && (`до ${top_announcement.cost_max.toLocaleString()} ₸ `)}
                                        {top_announcement.salary_type == 'undefined' && (`Договорная`)}
                                    </div>
                                </div>
                                <div className='mt-3 text-[11pt] max-w-[400px]'>
                                        {top_announcement.title}
                                    </div>
                                    <div className='mt-1 text-[11pt] text-gray-500 max-w-[350px]'>
                                        {top_announcement.description.length > 60
                                            ? `${top_announcement.description.substring(0, 60)}...`
                                            : top_announcement.description}
                                    </div>
                            </Link>
                        )}
                    </div>
                </div>
            </GuestLayout>
        </>
    )
}
