import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useForm } from '@inertiajs/react';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineRemoveRedEye, MdOutlineWorkOutline } from "react-icons/md";
import { useInternalMessage } from "antd/es/message/useMessage";
import { FaLocationDot } from "react-icons/fa6";

export default function Announcement({ auth, announcement }) {
    const { t, i18n } = useTranslation();
    const { post, delete: destroy } = useForm();
    const [isFavorite, setIsFavorite] = useState(announcement.is_favorite);
    const [showFullText, setShowFullText] = useState(false);
    const toggleShowFullText = () => setShowFullText(!showFullText);
    console.log(announcement)

    const maxLength = 90;
    const isLongText = announcement.user.description.length > maxLength;
    const displayedText = showFullText ? announcement.user.description : `${announcement.user.description.slice(0, maxLength)}`;

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

    let salary = 'договорная';
    if (announcement.salary_type === 'exact') {
        salary = `${announcement.cost} ₸`;
    } else if (announcement.salary_type === 'max') {
        salary = `до ${announcement.cost_max} ₸`;
    } else if (announcement.salary_type === 'min') {
        salary = `от ${announcement.cost_min} ₸`;
    } else if (announcement.salary_type === 'diapason') {
        salary = `от ${announcement.cost_min} ₸ до ${announcement.cost_max} ₸`;
    }

    return (
        <>
            <Head title={`${announcement.specialization.name_ru} в ${announcement.city} | Вакансия от ${announcement.user.name}`}>
                <meta name="description" content={`Вакансия ${announcement.specialization.name_ru} в ${announcement.city} от ${announcement.user.name}. Заработная плата ${salary}. Конкурентные условия и перспективы роста. Оставьте заявку сейчас!`} />
            </Head>
            <GuestLayout>
                <div className='grid grid-cols-1 md:grid-cols-7'>
                    <div className="md:col-span-5 pt-5">
                        <div className='md:mb-5 mb-2 px-5'>
                            <div className=''>
                                <div className='text-2xl md:text-3xl mt-1 font-bold max-w-[700px]'>{announcement.title}</div>
                                <div className="mt-2 text-sm font-light">
                                    {announcement.city}
                                    {announcement.location && announcement.location.length > 0 && (
                                        <> , {announcement.location.join(', ')} </> // Join locations with commas
                                    )}
                                    {announcement.address && announcement.address.length > 0 && (
                                        <span>
                                            {announcement.address.map((address, index) => (
                                                <span key={index}>, {address.adress}{index < announcement.address.length - 1 ? ', ' : ''}</span> // Add comma only between addresses
                                            ))}
                                        </span>
                                    )}
                                </div>
                                <div className='mt-2 text-2xl'>
                                    {salary}
                                </div>
                            </div>
                            <div className='flex-wrap flex gap-2 mt-2'>
                                <div className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 inline-block text-sm'>
                                    График работы: {announcement.work_time}
                                </div>
                                <div className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 inline-block text-sm'>
                                    {announcement.payment_type}
                                </div>
                                <div className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 inline-block text-sm'>
                                    {announcement.type_ru}
                                </div>
                                <div className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 inline-block text-sm'>
                                    {announcement.employemnt_type}
                                </div>
                                <div className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 inline-block text-sm'>
                                    Опыт работы: {announcement.experience}
                                </div>
                                <div className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 inline-block text-sm'>
                                    Образование: {announcement.education}
                                </div>
                            </div>
                            <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                {auth.user ? (
                                    <>
                                        <a href={`/connect/${auth.user.id}/${announcement.id}`}
                                           className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg text-center items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>Связаться</span>
                                        </a>
                                        {auth.user.email === 'admin@example.com' && (
                                            <a href={`/announcement/update/${announcement.id}`}
                                                className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg text-center items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                                <span className='font-bold'>Изменить</span>
                                            </a>
                                        )}
                                    </>
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
                        <div className='mx-5 mt-5 px-5 py-4 rounded-lg shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.07),_0_20px_40px_-10px_rgba(0,0,0,0.07)]'>
                            <div className='text-left font-regular text-xl'>{announcement.user.name}</div>
                            <div className='text-left mt-2 font-light text-gray-500'>
                                {showFullText ? (announcement?.user?.description || "") : (announcement?.user?.description ? announcement.user.description.slice(0, maxLength) : "")}
                                {isLongText && (
                                    <span onClick={toggleShowFullText} className="text-blue-500 cursor-pointer">
                                        {showFullText ? ' Скрыть' : ' Подробнее'}
                                    </span>
                                )}
                            </div>
                            <div className="flex-wrap">
                                {announcement.responses_count !== 0 && (
                                    <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                        <div className="flex items-center gap-x-1">
                                            <HiOutlineUserGroup className="text-xl" />
                                            <div>{announcement.responses_count} {announcement.responses_count === 1 ? 'отклик' : (announcement.responses_count >= 2 && announcement.responses_count <= 4) ? 'отклика' : 'откликов'}</div>
                                        </div>
                                    </div>
                                )}
                                {announcement.visits_count !== 0 && (
                                    <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                        <div className="flex items-center gap-x-1">
                                            <MdOutlineRemoveRedEye className="text-xl" />
                                            <div>{announcement.visits_count} {announcement.visits_count === 1 ? 'просмотр' : (announcement.visits_count >= 2 && announcement.visits_count <= 4) ? 'просмотра' : 'просмотров'}</div>
                                        </div>
                                    </div>
                                )}
                                {orderCount !== 0 && (
                                    <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                        <div className="flex items-center gap-x-1">
                                            <MdOutlineWorkOutline className="text-xl" />
                                            <div>{orderCount} {orderCount === 1 ? 'заказ' : 'заказов'}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='mx-5 mt-5 rounded-lg'>
                            <div className='font-semibold mt-5'>Описание:</div>
                            <div className='mt-2' style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: announcement.description}} />
                            <div className='text-lg font-semibold mb-2 mt-2'>Условия</div>
                            <ul className='list-disc list-inside'>
                                {announcement.conditions.map((condition, index) => (
                                    <li key={index} className='mb-2'>{condition.condition}</li>
                                ))}
                            </ul>

                            <div className='text-lg font-semibold mb-2 mt-2'>Обязанности</div>
                            <ul className='list-disc list-inside'>
                                {announcement.responsibilities.map((responsibility, index) => (
                                    <li key={index} className='mb-2'>{responsibility.responsibility}</li>
                                ))}
                            </ul>

                            <div className='text-lg font-semibold mb-2 mt-2'>Требования</div>
                            <ul className='list-disc list-inside'>
                                {announcement.requirements.map((requirement, index) => (
                                    <li key={index} classname='mb-2'>{requirement.requirement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}

