import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useForm } from '@inertiajs/react';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineRemoveRedEye, MdOutlineWorkOutline, MdAccessTime } from "react-icons/md";
import { useInternalMessage } from "antd/es/message/useMessage";
import { FaLocationDot } from "react-icons/fa6";
import { MdIosShare } from "react-icons/md";


export default function Announcement({ auth, announcement, more_announcement, urgent_announcement, top_announcement}) {
    const { t, i18n } = useTranslation();
    const { post, delete: destroy } = useForm();
    const [isFavorite, setIsFavorite] = useState(announcement.is_favorite);
    const [showFullText, setShowFullText] = useState(false);
    const toggleShowFullText = () => setShowFullText(!showFullText);

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

    const handleShare = () => {
        const url = `https://jumystap.kz/announcement/${announcement.id}`; // Ensure 'announcement' is in scope and has 'id'

        if (navigator.share) {
            navigator.share({
                title: 'Check out this announcement',
                url: url,
            }).then(() => {
                console.log('Share was successful.');
            }).catch((error) => {
                console.error('Sharing failed:', error);
            });
        } else {
            // Fallback for browsers that do not support the Web Share API
            alert(`Share this link: ${url}`);
        }
    };

    const vacancyCount = announcement.user.announcement.filter(anonce => anonce && anonce.type_ru === 'Вакансия').length;
    const orderCount = announcement.user.announcement.filter(anonce => anonce && anonce.type_ru === 'Заказ').length;
    console.log(announcement.user.announcement)


    let salary = 'Договорная';
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
                <div className='grid grid-cols-1 md:grid-cols-9'>
                    <div className="md:col-span-6 pt-5">
                        <div className='md:mb-5 mb-2 px-5'>
                            <div className='p-5 rounded-lg border border-gray-200'>
                            <div className=''>
                                <div className='text-xl md:text-2xl mt-1 font-bold max-w-[700px]'>{announcement.title}</div>
                                <div className="mt-2 text-sm font-light">
                                    {announcement.city}
                                     {announcement.location}
                                    {announcement.address && announcement.address.length > 0 && (
                                        <span>
                                            {announcement.address.map((address, index) => (
                                                <span key={index}>, {address.adress}{index < announcement.address.length - 1 ? '' : ''}</span> // Add comma only between addresses
                                            ))}
                                        </span>
                                    )}
                                </div>
                                <div className='mt-2 text-2xl'>
                                    {announcement.salary_type == 'exact' && announcement.cost && (`${announcement.cost.toLocaleString() } ₸ `)}
                                    {announcement.salary_type == 'min' && announcement.cost_min && !announcement.cost_max && (`от ${announcement.cost_min.toLocaleString()} ₸ `)}
                                    {announcement.salary_type == 'max' && announcement.cost_max && !announcement.cost_min && (`до ${announcement.cost_max.toLocaleString()} ₸ `)}
                                    {announcement.salary_type == 'diapason' && announcement.cost_min && announcement.cost_max && (`от ${announcement.cost_min.toLocaleString()} ₸ до ${announcement.cost_max.toLocaleString()} ₸ `)}
                                    {announcement.salary_type == 'undefined' && (`Договорная`)}
                                    {announcement.salary_type == 'za_smenu' && (
                                        <>
                                            {announcement.cost && `${announcement.cost.toLocaleString()} ₸ / за смену`}
                                            {announcement.cost_min && !announcement.cost_max && `от ${announcement.cost_min.toLocaleString()} ₸ / за смену`}
                                            {!announcement.cost_min && announcement.cost_max && `до ${announcement.cost_max.toLocaleString()} ₸ / за смену`}
                                            {announcement.cost_min && announcement.cost_max && `от ${announcement.cost_min.toLocaleString()} ₸ до ${announcement.cost_max.toLocaleString()} ₸ / за смену`}
                                        </>
                                    )}
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
                                    onClick={handleShare}
                                    className={`border-2 ${isFavorite ? 'border-transparent' : 'border-blue-500'} rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                                    <MdIosShare className='text-blue-500 text-xl' />
                                </div>
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
                            <div className='md:hidden mt-5 px-5 py-4 rounded-lg border border-gray-200'>
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
                        </div>
                        <div className='p-5 rounded-lg mx-5 border border-gray-200 gap-5 mt-5 grid md:grid-cols-3 grid-cols-2'>
                            <div>
                                <div className='text-sm text-gray-500'>Опыт работы</div>
                                <div>{announcement.experience}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>Тип оплаты</div>
                                <div>{announcement.payment_type}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>Тип объявления</div>
                                <div>{announcement.type_ru}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>График работы</div>
                                <div>{announcement.work_time}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>Тип занятости</div>
                                <div>{announcement.employemnt_type}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>Образование</div>
                                <div>{announcement.education}</div>
                            </div>
                        </div>
                        <div className='mt-5 rounded-lg border mx-5'>
                            <div className='mx-5'>
                            {announcement.conditions.length > 0 && (
                                <>
                                    <div className='font-semibold mb-2 mt-5'>Условия</div>
                                    <ul className='list-disc list-inside'>
                                        {announcement.conditions.map((condition, index) => (
                                            <li key={index} className='mb-2'>{condition.condition}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {announcement.responsibilities.length > 0 && (
                                <>
                                    <div className='font-semibold mb-2 mt-2'>Обязанности</div>
                                    <ul className='list-disc list-inside'>
                                        {announcement.responsibilities.map((responsibility, index) => (
                                            <li key={index} className='mb-2'>{responsibility.responsibility}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {announcement.requirements.length > 0 && (
                                <>
                                    <div className='font-semibold mb-2 mt-2'>Требования</div>
                                    <ul className='list-disc list-inside'>
                                        {announcement.requirements.map((requirement, index) => (
                                            <li key={index} className='mb-2'>{requirement.requirement}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {announcement.description && (
                                <>
                                    <div className='font-semibold mt-5'>Описание:</div>
                                    <div className=' mt-2' style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: announcement.description }} />
                                </>
                            )}
                            </div>

                            <Link href='/announcements' className="px-5 mt-5 border-b py-2 border-gray-200 block font-bold">Больше объявлений</Link>
                            {more_announcement.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-1'>
                                {more_announcement.map((anonce, index) => (
                                    <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200'>
                                        <div className='flex'>
                                            <div className='flex gap-x-1 text-blue-400 items-center'>
                                                <FaLocationDot className='text-sm'/>
                                                <div className='text-sm'>{anonce.city}</div>
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
                                                {anonce.salary_type == 'diapason' && (`от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                                {anonce.salary_type == 'undefined' && (`Договорная`)}
                                            </div>
                                        </div>
                                        <div className='mt-4 text-sm text-gray-500 font-light'>
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
                    </div>
                        <div className="col-span-3 border-l h-screen md:block hidden sticky top-0 border-gray-200">
                            <div className='px-5 py-4 border-b border-t border-gray-200'>
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
    );
}

