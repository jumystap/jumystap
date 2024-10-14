import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "@inertiajs/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale'; // Импортируем русскую локаль

const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { locale: ru, addSuffix: true }); // например, "2 часа назад"
};

export default function User({ auth, user, employees, userProfessions, resumes}) {
    const { t, i18n } = useTranslation();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    function toDoubleString(value) {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }

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

    return (
        <>
            <GuestLayout>
                <div className="grid grid-cols-1 md:grid-cols-7">
                    <div className='col-span-5'>
                        <div className='flex gap-x-3 p-10 bg-white border-b border-gray-200'>
                            <img
                                src={`/storage/${user.image_url}`}
                                className='w-[70px] h-[70px] rounded-full object-cover'
                            />
                            <div>
                                <div
                                    className='font-bold text-lg flex items-center gap-2'
                                >
                                    {user.name}
                                    {user.is_graduate ? (
                                        <RiVerifiedBadgeFill className='text-lg text-blue-500' />
                                    ): (
                                        ''
                                    )}
                                </div>
                                <div className="text-gray-500">
                                    @{user.email.split('@')[0]}
                                </div>
                                <div className="py-1 px-3 rounded-lg mt-3 text-sm bg-green-100 inline-block text-green-500">
                                    {user.status}
                                </div>
                                {auth.user == null ? (
                                    <Link href="/register" className='md:hidden mt-3 text-white rounded-lg text-center inline-block bg-blue-500 py-2 px-10'>
                                        <span className='font-bold'>Связаться</span>
                                    </Link>
                                ):(
                                    <a
                                        href={`https://wa.me/${user.phone}?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A`}
                                        className='text-white rounded-lg mt-3 md:hidden text-center inline-block bg-blue-500 py-2 px-10'
                                    >
                                        <span className='font-bold'>Связаться</span>
                                    </a>
                                )}
                            </div>
                            <div className="ml-auto hidden md:block">
                                {auth.user == null ? (
                                    <Link href="/register"className='text-white rounded-lg text-center inline-block bg-blue-500 py-2 px-10'>
                                        <span className='font-bold'>Связаться</span>
                                    </Link>
                                ):(
                                    <a
                                        href={`https://wa.me/${user.phone}?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A`}
                                        className='text-white rounded-lg text-center inline-block bg-blue-500 py-2 px-10'
                                    >
                                        <span className='font-bold'>Связаться</span>
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className='mt-2 mx-5'>
                            {resumes.length > 0 && (
                                <div className="grid grid-cols-1 gap-4 mt-5">
                                    {resumes.map((resume, index) => (
                                        <div className='w-full border border-gray-200 rounded-lg p-5 bg-white shadow-md' key={index}>
                                            <div className='flex'>
                                                <div className={`flex gap-x-1 ${resume.city == 'Астана' ? ('text-blue-400'):('text-gray-500')} items-center`}>
                                                    <FaLocationDot className='text-sm'/>
                                                    <div className='text-[10pt] md:text-sm'>{resume.city}</div>
                                                </div>
                                                <div className='text-gray-500 text-sm ml-auto'>
                                                    Размещено {formatCreatedAt(resume.created_at)}
                                                </div>
                                            </div>
                                            <div className='font-semibold text-2xl text-blue-500 mt-4'>{resume.desired_field_name}</div>
                                            {resume.organizations.length > 0 && (
                                                <div className='mt-2'>
                                                    <div className='text-sm text-gray-500'>Опыт работы:</div>
                                                    <ul className="">
                                                        {resume.organizations.map(org => (
                                                            <li key={org.id}>- {org.organization} - {org.position}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {resume.skills.length > 0 && (
                                                <div className='flex-wrap mt-2'>
                                                    {resume.skills.map((skill, index) => (
                                                        <div className='mr-2 rounded-full inline-block py-1 px-5 bg-gray-100 text-gray-500' key={index}>
                                                            {skill}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='flex'>

                        </div>
                    </div>
                    <div className="col-span-2 h-screen sticky top-0 border-l md:block hidden border-gray-200">
                    </div>
                </div>
            </GuestLayout>

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
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
e

