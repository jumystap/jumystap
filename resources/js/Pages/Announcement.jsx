import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
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
import { notification } from 'antd';
import ShareButtons from "@/Components/ShareButtons";

export default function Announcement({ auth, announcement, more_announcement, urgent_announcement, top_announcement}) {
    const { t, i18n } = useTranslation('announcements');
    const [ws, setWs] = useState(null);
    const [isResponse, setIsResponse] = useState(false)
    const { post, delete: destroy } = useForm();
    const [isFavorite, setIsFavorite] = useState(announcement.is_favorite);
    const [showFullText, setShowFullText] = useState(false);
    const userId = null
    if(auth.user) {
        const userId = auth.user.id
    }
    const toggleShowFullText = () => setShowFullText(!showFullText);
        useEffect(() => {
        const socket = new WebSocket(`wss://api.jumystap.kz/api/v1/ws?user_id=${auth?.user?.id}`);

        socket.onopen = () => {
            console.log('WebSocket is open now.');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
        };

        socket.onclose = () => {
            console.log('WebSocket is closed now.');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const handleSendMessage = (e) => {
    e.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
        const message = {
            sender_id: auth.user.id,
            receiver_id: announcement.user.id,
            content: `/user/${auth.user.id}`,
            created_at: new Date().toISOString()
        };
        try {
            ws.send(JSON.stringify(message));
            notification.success({
                message: t('success'),
                description: t('response_sent'),
                placement: 'topRight',
                duration: 3
            });
            setIsResponse(true);
        } catch (error) {
            console.error("WebSocket send error:", error);
        }
    } else {
        console.error("WebSocket is not open. Ready state:", ws.readyState);
    }
};


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

    const vacancyCount = announcement.user.announcement.filter(anonce => anonce && announcement.type_ru === 'Вакансия').length;
    const orderCount = announcement.user.announcement.filter(anonce => anonce && announcement.type_ru === t('order')).length;
    console.log(announcement.user.announcement)


    let salary = t('negotiable');
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
                                    {announcement.salary_type === "exact" &&
                                        announcement.cost &&
                                        `${announcement.cost.toLocaleString()} ₸ `}
                                    {announcement?.salary_type === "min" && announcement.cost_min &&
                                        `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸" : announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                    }
                                    {announcement.salary_type === "max" && announcement.cost_max &&
                                        `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸" : announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                    }
                                    {announcement.salary_type === "diapason" &&
                                        announcement.cost_min &&
                                        announcement.cost_max &&
                                        `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸" :
                                            announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                    }
                                    {announcement.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                                    {announcement.salary_type === "za_smenu" && (
                                        <>
                                            {announcement.cost &&
                                                `${announcement.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                            }
                                            {announcement.cost_min &&
                                                !announcement.cost_max &&
                                                `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                    t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                            }
                                            {!announcement.cost_min &&
                                                announcement.cost_max &&
                                                `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                    t("per_shift", { ns: "index" }) + " " + announcement.cost_max.toLocaleString() + " ₸ / дейін"}`
                                            }
                                            {announcement.cost_min &&
                                                announcement.cost_max &&
                                                `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                                    t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                            }
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                {auth.user ? (
                                    <>
                                        <a href={`/connect/${auth.user.id}/${announcement.id}`}
                                           className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{t('contact')}</span>
                                        </a>
                                        {auth.user.email === 'admin@example.com' && (
                                            <a href={`/announcement/update/${announcement.id}`}
                                                className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                                <span className='font-bold'>{t('edit')}</span>
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <Link href='/login'
                                        className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                        <span className='font-bold'>{t('contact')}</span>
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
                                            {showFullText ? t('hide') :  t('more_details')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-wrap">
                                    {announcement.responses_count !== 0 && (
                                        <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                            <div className="flex items-center gap-x-1">
                                                <HiOutlineUserGroup className="text-xl" />
                                                <div>{announcement.responses_count} {announcement.responses_count === 1 ? t('response') : (announcement.responses_count >= 2 && announcement.responses_count <= 4) ? t('response2') : t('responses')}</div>
                                            </div>
                                        </div>
                                    )}
                                    {announcement.visits_count !== 0 && (
                                        <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                            <div className="flex items-center gap-x-1">
                                                <MdOutlineRemoveRedEye className="text-xl" />
                                                <div>{announcement.visits_count} {announcement.visits_count === 1 ? t('view') : (announcement.visits_count >= 2 && announcement.visits_count <= 4) ? t('view2') : t('views')}</div>
                                            </div>
                                        </div>
                                    )}
                                    {orderCount !== 0 && (
                                        <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                            <div className="flex items-center gap-x-1">
                                                <MdOutlineWorkOutline className="text-xl" />
                                                <div>{orderCount} {orderCount === 1 ? t('order') : t('orders')}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='p-5 rounded-lg mx-5 border border-gray-200 gap-5 mt-5 grid md:grid-cols-3 grid-cols-2'>
                            <div>
                                <div className='text-sm text-gray-500'>{t('work_experience')}</div>
                                <div>{announcement.experience}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>{t('payment_type')}</div>
                                <div>{announcement.payment_type}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>{t('work_days_hours')}</div>
                                <div>{announcement.work_hours}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>{t('work_schedule')}</div>
                                <div>{announcement.work_time}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>{t('employment_type')}</div>
                                <div>{announcement.employemnt_type}</div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500'>{t('education')}</div>
                                <div>{announcement.education}</div>
                            </div>
                        </div>
                        <div className='mt-5 rounded-lg border mx-5'>
                            <div className='mx-5'>

                            {announcement.responsibilities.length > 0 && (
                                <>
                                    <div className='font-semibold mb-2 mt-2'>{t('responsibilities')}</div>
                                    <ul className='list-disc list-inside'>
                                        {announcement.responsibilities.map((responsibility, index) => (
                                            <li key={index} className='mb-2'>{responsibility.responsibility}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {announcement.requirements.length > 0 && (
                                <>
                                    <div className='font-semibold mb-2 mt-2'>{t('requirements')}</div>
                                    <ul className='list-disc list-inside'>
                                        {announcement.requirements.map((requirement, index) => (
                                            <li key={index} className='mb-2'>{requirement.requirement}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {announcement.conditions.length > 0 && (
                                <>
                                    <div className='font-semibold mb-2 mt-5'>{t('conditions')}</div>
                                    <ul className='list-disc list-inside'>
                                        {announcement.conditions.map((condition, index) => (
                                            <li key={index} className='mb-2'>{condition.condition}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {announcement.description && (
                                <>
                                    <div className='font-semibold mt-5'>{t('description')}:</div>
                                    <div className=' mt-2' style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: announcement.description }} />
                                </>
                            )}
                            </div>

                            <p className="px-5 mt-5 py-2 border-gray-200 font-bold flex items-center gap-2">
                                {t('share')}:
                                <ShareButtons
                                    title = {
                                        (announcement.cost ?? announcement.cost_min)
                                            ? `${announcement.title}. Зарплата от ${announcement.cost ?? announcement.cost_min} тенге`
                                            : announcement.title
                                    }
                                />
                            </p>

                            <Link href='/announcements' className="px-5 mt-5 border-b py-2 border-gray-200 block font-bold">{t('more_ads')}</Link>
                            {more_announcement.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-1'>
                                {more_announcement.map((anonce, index) => (
                                    <Link href={`/announcement/${announcement.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200'>
                                        <div className='flex'>
                                            <div className='flex gap-x-1 text-blue-400 items-center'>
                                                <FaLocationDot className='text-sm'/>
                                                <div className='text-sm'>{announcement.city}</div>
                                            </div>
                                        </div>
                                        <div className='mt-7 text-lg font-bold'>
                                            {announcement.title}
                                        </div>
                                        <div className='flex mt-4 gap-x-3 items-center'>
                                            <div className='md:text-xl text-lg font-regular'>
                                                {announcement.salary_type === "exact" &&
                                                    announcement.cost &&
                                                    `${announcement.cost.toLocaleString()} ₸ `}
                                                {announcement?.salary_type === "min" && announcement.cost_min &&
                                                    `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸" : announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                                }
                                                {announcement.salary_type === "max" && announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸" : announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                                }
                                                {announcement.salary_type === "diapason" &&
                                                    announcement.cost_min &&
                                                    announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸" :
                                                        announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                                }
                                                {announcement.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                                                {announcement.salary_type === "za_smenu" && (
                                                    <>
                                                        {announcement.cost &&
                                                            `${announcement.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                                        }
                                                        {announcement.cost_min &&
                                                            !announcement.cost_max &&
                                                            `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                                t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                                        }
                                                        {!announcement.cost_min &&
                                                            announcement.cost_max &&
                                                            `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                                t("per_shift", { ns: "index" }) + " " + announcement.cost_max.toLocaleString() + " ₸ / дейін"}`
                                                        }
                                                        {announcement.cost_min &&
                                                            announcement.cost_max &&
                                                            `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                                                t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                                        }
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className='mt-4 text-sm text-gray-500 font-light'>
                                        </div>
                                        <div className='flex gap-x-1 items-center mt-4'>
                                            <MdAccessTime className='text-xl'/>
                                            <div className='text-sm'>{t('work_schedule')}: {announcement.work_time}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            ) : (
                                <div className='text-center'></div>
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
                                            {showFullText ? t('hide') : t('more_details')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-wrap">
                                    {announcement.responses_count !== 0 && (
                                        <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                            <div className="flex items-center gap-x-1">
                                                <HiOutlineUserGroup className="text-xl" />
                                                <div>{announcement.responses_count} {announcement.responses_count === 1 ? t('response') : (announcement.responses_count >= 2 && announcement.responses_count <= 4) ? t('response2') : t('responses')}</div>
                                            </div>
                                        </div>
                                    )}
                                    {announcement.visits_count !== 0 && (
                                        <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                            <div className="flex items-center gap-x-1">
                                                <MdOutlineRemoveRedEye className="text-xl" />
                                                <div>{announcement.visits_count} {announcement.visits_count === 1 ? t('view') : (announcement.visits_count >= 2 && announcement.visits_count <= 4) ? t('view2') : t('views')}</div>
                                            </div>
                                        </div>
                                    )}
                                    {orderCount !== 0 && (
                                        <div className="inline-block mr-1 mt-3 px-4 text-sm text-blue-500 py-2 rounded-full border border-blue-500">
                                            <div className="flex items-center gap-x-1">
                                                <MdOutlineWorkOutline className="text-xl" />
                                                <div>{orderCount} {orderCount === 1 ? t('order') : t('orders')}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        {urgent_announcement && (
                            <Link href={`/announcement/${urgent_announcement.id}`}  className='hover:bg-gray-100 transition-all duration-150 border-b border-gray-300 p-3 w-full hidden md:block '>
                                <div className='flex items-center'>
                                    <div className='uppercase text-white text-xs px-2 bg-red-600 font-bold rounded'>{t('urgent')}</div>
                                    <div className='flex items-center font-bold gap-x-2 text-sm ml-auto'>
                                        <SiFireship className='text-red-600 text-lg' />
                                        {announcement.salary_type === "exact" &&
                                            announcement.cost &&
                                            `${announcement.cost.toLocaleString()} ₸ `}
                                        {announcement?.salary_type === "min" && announcement.cost_min &&
                                            `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸" : announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                        }
                                        {announcement.salary_type === "max" && announcement.cost_max &&
                                            `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸" : announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                        }
                                        {announcement.salary_type === "diapason" &&
                                            announcement.cost_min &&
                                            announcement.cost_max &&
                                            `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸" :
                                                announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                        }
                                        {announcement.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                                        {announcement.salary_type === "za_smenu" && (
                                            <>
                                                {announcement.cost &&
                                                    `${announcement.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                                }
                                                {announcement.cost_min &&
                                                    !announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                        t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                                }
                                                {!announcement.cost_min &&
                                                    announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                        t("per_shift", { ns: "index" }) + " " + announcement.cost_max.toLocaleString() + " ₸ / дейін"}`
                                                }
                                                {announcement.cost_min &&
                                                    announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                                        t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                                }
                                            </>
                                        )}
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
                                    <div className='uppercase text-white text-xs px-2 bg-blue-500 font-bold rounded'>{t('top')}</div>
                                    <div className='flex gap-x-2 items-center font-bold text-sm ml-auto'>
                                        <FaStar className='text-blue-500 text-lg'/>
                                        {announcement.salary_type === "exact" &&
                                            announcement.cost &&
                                            `${announcement.cost.toLocaleString()} ₸ `}
                                        {announcement?.salary_type === "min" && announcement.cost_min &&
                                            `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸" : announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                        }
                                        {announcement.salary_type === "max" && announcement.cost_max &&
                                            `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸" : announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                        }
                                        {announcement.salary_type === "diapason" &&
                                            announcement.cost_min &&
                                            announcement.cost_max &&
                                            `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸" :
                                                announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                        }
                                        {announcement.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                                        {announcement.salary_type === "za_smenu" && (
                                            <>
                                                {announcement.cost &&
                                                    `${announcement.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                                }
                                                {announcement.cost_min &&
                                                    !announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                        t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап"}`
                                                }
                                                {!announcement.cost_min &&
                                                    announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "до " + announcement.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                        t("per_shift", { ns: "index" }) + " " + announcement.cost_max.toLocaleString() + " ₸ / дейін"}`
                                                }
                                                {announcement.cost_min &&
                                                    announcement.cost_max &&
                                                    `${i18n?.language === "ru" ? "от " + announcement.cost_min.toLocaleString() + " ₸ до " + announcement.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                                        t("per_shift", { ns: "index" }) + " " + announcement.cost_min.toLocaleString() + " ₸ бастап " + announcement.cost_max.toLocaleString() + " ₸ дейін"}`
                                                }
                                            </>
                                        )}
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

