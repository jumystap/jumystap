import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useForm } from "@inertiajs/react"; // Import useForm from Inertia
import CreatePortfolioModal from '@/Components/CreatePortfolioModal';
import AddCertificateModal from '@/Components/AddCertificateModal';
import Dashboard from "./Company/Dashboard";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns'; // Import format function
import { ru } from 'date-fns/locale'; // Import Russian locale

const formatCreatedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ru });
};

export default function Profile({ auth, user, announcements, employees, professions, userProfessions, resumes }) {
    const { t, i18n } = useTranslation('profile');
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false);
    const [isAddCertificateModalOpen, setIsAddCertificateModalOpen] = useState(false);
    const [missingCertificateProfession, setMissingCertificateProfession] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Create form instance using useForm from Inertia
    const { delete: deleteResumeForm } = useForm();

    const deleteResume = (resumeId) => {
        if (confirm(t('confirm_delete_resume',  { ns: 'profile' }))) {
            deleteResumeForm(
                route("delete_resume", resumeId), // Backend route to handle delete
                {
                    onSuccess: () => {
                        setResumeList((prevList) => prevList.filter((resume) => resume.id !== resumeId)); // Update state
                    },
                }
            );
        }
    };

    useEffect(() => {
        const professionWithEmptyCertificate = userProfessions.find(prof => !prof.certificate_number);
        if (professionWithEmptyCertificate) {
            setMissingCertificateProfession(professionWithEmptyCertificate);
            setIsAddCertificateModalOpen(true);
        }
    }, [userProfessions]);

    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % user.portfolio.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((currentImageIndex - 1 + user.portfolio.length) % user.portfolio.length);
    };

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
                {user.role.name === 'employee' ? (
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
                                                        <a
                                                            href={profession.certificate_link}
                                                            target="_blank"
                                                            className="underline"
                                                        >
                                                            {i18n.language === 'ru' ? profession.profession_name : profession.professions_name_kz}
                                                        </a>
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
                                    </div>
                                </div>
                                <div className='px-5 mt-5'>
                                    <Link href='/create_resume' className='px-7 py-2 mr-2 bg-blue-500 text-white text-sm font-semibold inline-block rounded-lg'>
                                        {t('create_resume', { ns: 'profile' })}
                                    </Link>
                                    <Link href='/my-responses' className='px-7 py-2 bg-blue-500 text-white text-sm font-semibold inline-block rounded-lg'>
                                        {t('my_responses', { ns: 'profile' })}
                                    </Link>
                                    {resumes.length > 0 && (
                                        <div className="grid grid-cols-1 gap-4 mt-5">
                                            {resumes.map((resume, index) => (
                                                <a href={`/resume/${resume.id}`} className='w-full border border-gray-200 rounded-lg p-5 bg-white shadow-md' key={index}>
                                                    <div className='flex'>
                                                        <div className={`flex gap-x-1 ${resume.city == 'Астана' ? ('text-blue-400'):('text-gray-500')} items-center`}>
                                                            <FaLocationDot className='text-sm'/>
                                                            <div className='text-[10pt] md:text-sm'>{resume.city}</div>
                                                        </div>
                                                        <div className='text-gray-500 text-sm ml-auto'>
                                                            {i18n.language === 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(resume.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language === 'kz' && ('')}
                                                        </div>
                                                    </div>
                                                    <div className='font-semibold text-2xl text-blue-500 mt-4'>{resume.desired_field_name}</div>
                                                    {resume.organizations.length > 0 && (
                                                        <div className='mt-2'>
                                                            <div className='text-sm text-gray-500'>{t('experience', { ns: 'profile' })}:</div>
                                                            <ul className="">
                                                                {resume.organizations.map(org => (
                                                                    <li key={org.id}>- {org.organization} - {org.position_name}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {resume.skills.length > 0 && (
                                                        <div className='flex-wrap mt-5 flex gap-2'>
                                                            {resume.skills.map((skill, index) => (
                                                                <div className='rounded-full inline-block py-1 px-5 bg-gray-100 text-gray-500'>
                                                                    {skill}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className='mt-4 gap-x-5 flex items-center'>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteResume(resume.id);
                                                        }}
                                                        className="text-sm text-red-500"
                                                    >
                                                        {t('delete_resume', { ns: 'profile' })}
                                                    </button>
                                                    <Link
                                                        href={`/update_resume/${resume.id}`}
                                                        className='text-sm'
                                                    >
                                                        {t('edit', { ns: 'profile' })}
                                                    </Link>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 h-screen sticky top-0 border-l md:block hidden border-gray-200">
                            </div>
                        </div>
                    </>
                ) : (
                    <Dashboard user={user} announcements={announcements} />
                )}
            </GuestLayout>

            <CreatePortfolioModal
                isOpen={isCreatePortfolioModalOpen}
                onRequestClose={() => setIsCreatePortfolioModalOpen(false)}
            />
            {missingCertificateProfession && (
                <AddCertificateModal
                    isOpen={isAddCertificateModalOpen}
                    onRequestClose={() => setIsAddCertificateModalOpen(false)}
                    profession={missingCertificateProfession}
                />
            )}

            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative">
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black py-2 px-4 rounded-l"
                            onClick={prevImage}
                        >
                            &lt;
                        </button>
                        <img
                            src={`/storage/${user.portfolio[currentImageIndex].image_url}`}
                            className="w-[80vw] h-[80vh] object-contain"
                        />
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black py-2 px-4 rounded-r"
                            onClick={nextImage}
                        >
                            &gt;
                        </button>
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white py-2 px-4 rounded"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            {t('close', { ns: 'profile' })}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

