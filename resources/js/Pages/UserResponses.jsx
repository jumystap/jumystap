import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import { Link } from "@inertiajs/react"; // Import useForm from Inertia
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns'; // Import format function
import { ru } from 'date-fns/locale';
import {CiLocationOn} from "react-icons/ci";
import {MdIosShare} from "react-icons/md";
import Pagination from "@/Components/Pagination.jsx"; // Import Russian locale

export default function Profile({ auth, user, userProfessions, announcements}) {
    const { t, i18n } = useTranslation('profile');

    const kz = {
        ...ru,
        formatDistance: (token, count, options) => {
            const formatDistanceLocale = {
                lessThanXSeconds: { one: 'Бірнеше секунд', other: 'Секунд' },
                xSeconds: { one: 'Бір секунд', other: '{{count}} секунд' },
                halfAMinute: 'жарты минут',
                lessThanXMinutes: { one: 'Бірнеше минут', other: 'Минут' },
                xMinutes: { one: 'Бір минут', other: '{{count}} минут' },
                aboutXHours: { one: 'Шамамен бір сағат', other: 'Шамамен {{count}} сағат' },
                xHours: { one: 'Бір сағат', other: '{{count}} сағат' },
                xDays: { one: 'Бір күн', other: '{{count}} күн' },
                aboutXWeeks: { one: 'Шамамен бір апта', other: 'Шамамен {{count}} апта' },
                xWeeks: { one: 'Бір апта', other: '{{count}} апта' },
                aboutXMonths: { one: 'Шамамен бір ай', other: 'Шамамен {{count}} ай' },
                xMonths: { one: 'Бір ай', other: '{{count}} ай' },
                aboutXYears: { one: 'Шамамен бір жыл', other: 'Шамамен {{count}} жыл' },
                xYears: { one: 'Бір жыл', other: '{{count}} жыл' },
                overXYears: { one: 'Бір жылдан астам', other: '{{count}} жылдан астам' },
                almostXYears: { one: 'Бір жылға жуық', other: '{{count}} жылға жуық' },
            };

            const result = formatDistanceLocale[token];

            if (typeof result === 'string') {
                return result;
            }

            const form = count === 1 ? result.one : result.other.replace('{{count}}', count);

            if (options?.addSuffix) {
                if (options?.comparison > 0) {
                    return form + ' кейін';
                } else {
                    return form + ' бұрын';
                }
            }

            return form;
        }
    };


    return (
        <>
            <GuestLayout>
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-7">
                            <div className='col-span-5'>
                                <div className='flex md:flex-row flex-col gap-x-3 p-10 bg-white border-b border-gray-200'>
                                    <img
                                        src={user.image_url ? `/storage/${user.image_url}` : '/images/default-avatar.png'}
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-avatar.png'; }}
                                        className='w-[70px] h-[70px] rounded-full object-cover'
                                    />

                                    <div>
                                        <div
                                            className='font-bold text-lg flex items-center gap-2'
                                        >
                                            {user.name}
                                            {user.is_graduate ? (
                                                <RiVerifiedBadgeFill className='text-lg text-blue-500' />
                                            ) : ''}
                                        </div>
                                        <div className="text-gray-500">
                                            @{user.email.split('@')[0]}
                                        </div>
                                        {userProfessions.length > 0 && (
                                            <>
                                                {userProfessions.map((profession, index) => (
                                                    <div className='mt-1' key={index}>
                                                        {i18n.language === 'ru' ? profession.profession_name : profession.professions_name_kz}
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                        <div className="py-1 px-3 rounded-lg mt-2 text-sm bg-green-100 inline-block text-green-500">
                                            {user.status}
                                        </div>
                                    </div>
                                    <div className='md:ml-auto'>
                                        <Link
                                            href='/update'
                                            className='text-center mt-2 block bg-blue-500 px-5 py-2 text-white rounded-lg'
                                        >
                                            {t('edit', { ns: 'profile' })}
                                        </Link>
                                        <Link
                                            href='/update_certificate'
                                            className='text-center mt-2 block border-2 text-blue-500 border-blue-500 px-5 py-2 rounded-lg'
                                        >
                                            {t('update_certificate', { ns: 'profile' })}
                                        </Link>
                                    </div>
                                </div>
                                <div className='px-5 mt-5'>
                                    <Link href='/create_resume' className='px-7 py-2 mr-2 bg-blue-500 text-white text-sm font-semibold inline-block rounded-lg'>
                                        {t('create_resume', { ns: 'profile' })}
                                    </Link>
                                    <Link href='/my-responses' className='px-7 py-2 bg-blue-500 text-white text-sm font-semibold inline-block rounded-lg'>
                                        {t('my_responses', { ns: 'profile' })}
                                    </Link>
                                    {announcements.data.map((anonce, index) => (
                                        <Link href={`/announcement/${anonce.id}`} key={index} className={`block px-5 py-5 border rounded-lg hover:border-blue-500 transition-all duration-150 border-gray-200 mt-3`}>
                                            <div className='flex items-center'>
                                                <div className={`flex gap-x-1 ${anonce.city == 'Астана' ? ('text-blue-400'):('text-gray-400')} items-center`}>
                                                    <CiLocationOn />
                                                    <div className='text-[10pt] md:text-sm'>{anonce.city}</div>
                                                </div>
                                                <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>
                                                    {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                                </div>
                                            </div>
                                            <div className='mt-5 text-lg font-bold'>
                                                {anonce.title}
                                            </div>

                                            <div className='flex md:mt-2 mt-2 gap-x-3 items-center'>
                                                <div className='md:text-xl text-xl font-regular'>
                                                    {anonce.salary_type === "exact" &&
                                                        anonce.cost &&
                                                        `${anonce.cost.toLocaleString()} ₸ `}
                                                    {anonce?.salary_type === "min" && anonce.cost_min &&
                                                        `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸" : anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                                                    }
                                                    {anonce.salary_type === "max" && anonce.cost_max &&
                                                        `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸" : anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                                    }
                                                    {anonce.salary_type === "diapason" &&
                                                        anonce.cost_min &&
                                                        anonce.cost_max &&
                                                        `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸" :
                                                            anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                                    }
                                                    {anonce.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                                                    {anonce.salary_type === "za_smenu" && (
                                                        <>
                                                            {anonce.cost &&
                                                                `${anonce.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                                            }
                                                            {anonce.cost_min &&
                                                                !anonce.cost_max &&
                                                                `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                                    t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                                                            }
                                                            {!anonce.cost_min &&
                                                                anonce.cost_max &&
                                                                `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                                    t("per_shift", { ns: "index" }) + " " + anonce.cost_max.toLocaleString() + " ₸ / дейін"}`
                                                            }
                                                            {anonce.cost_min &&
                                                                anonce.cost_max &&
                                                                `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                                                    t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                                            }
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex gap-x-2 mt-2'>
                                                <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                                    {anonce.experience}
                                                </div>
                                                <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                                    {anonce.work_time}
                                                </div>
                                            </div>
                                            <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                                <>
                                                    <a
                                                        href={`/connect/${auth.user.id}/${anonce.id}`}
                                                        onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                                        className='text-blue-500 text-center rounded-lg text-sm text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                                        <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                                                    </a>
                                                    {auth.user.email === 'admin@example.com' && (
                                                        <a
                                                            href={`/announcement/update/${anonce.id}`}
                                                            onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                                            className='text-blue-500 text-center rounded-lg text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                                            <span className='font-bold'>{t('edit', { ns: 'announcements' })}</span>
                                                        </a>
                                                    )}
                                                </>

                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents click propagation to Link
                                                        handleShare(anonce.id);
                                                    }}
                                                    className={`border-2 border-blue-500 rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                                                    <MdIosShare className='text-blue-500 text-xl' />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    <Pagination links={announcements.links}/>

                                </div>
                            </div>
                            <div className="col-span-2 h-screen sticky top-0 border-l md:block hidden border-gray-200">
                            </div>
                        </div>
                    </>
            </GuestLayout>

        </>
    );
}

