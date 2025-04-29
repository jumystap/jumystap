import React, { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "@inertiajs/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';

const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { locale: ru, addSuffix: true });
};

export default function User({ auth, user, contactShow, employees, userProfessions, resumes }) {
    const { t, i18n } = useTranslation('profile');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        <GuestLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
                        <div className="col-span-5">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                <div className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="relative group">
                                        <img
                                            src={`/storage/${user.image_url}`}
                                            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 transition-transform duration-300 group-hover:scale-105"
                                            alt={user.name}
                                        />
                                        {user.is_graduate && (
                                            <div className="absolute -bottom-2 -right-2">
                                                <RiVerifiedBadgeFill className="text-2xl text-blue-500 drop-shadow-sm" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                            {user.name}
                                        </h1>
                                        <p className="text-gray-500 mb-3">
                                            @{user.email.split('@')[0]}
                                        </p>
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
                                        <div className="space-y-3">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                {user.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:ml-auto">
                                        {auth.user == null ? (
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                {t("contact", { ns: "profile" })}
                                            </Link>
                                        ) : (
                                            contactShow === true ?
                                            <a
                                                href={`https://wa.me/${user.phone}?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A`}
                                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                {t("contact", { ns: "profile" })}
                                            </a> : ''
                                        )}
                                    </div>
                                </div>
                            </div>

                            {resumes.length > 0 && (
                                <div className="mt-8 space-y-6">
                                    {resumes.map((resume, index) => (
                                        <Link
                                            href={`/resume/${resume.id}`}
                                            key={index}
                                            className="block"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={`flex items-center gap-2 ${
                                                        resume.city === 'Астана' ? 'text-blue-600' : 'text-gray-600'
                                                    }`}>
                                                        <FaLocationDot className="text-sm" />
                                                        <span className="text-sm font-medium">{resume.city}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        Размещено {formatCreatedAt(resume.created_at)}
                                                    </span>
                                                </div>

                                                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                                                    {resume.desired_field_name}
                                                </h2>

                                                {resume.organizations.length > 0 && (
                                                    <div className="mb-4">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                                                            Опыт работы:
                                                        </h3>
                                                        <ul className="space-y-2">
                                                            {resume.organizations.map(org => (
                                                                <li
                                                                    key={org.id}
                                                                    className="flex items-center text-gray-700"
                                                                >
                                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                                                                    {org.organization} - {org.position}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {resume.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {resume.skills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 hidden md:block">
                            <div className="sticky top-8 bg-white rounded-xl shadow-sm p-6">
                                {/* Additional content can go here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="relative max-w-4xl w-full">
                        <button
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
                            onClick={prevImage}
                        >
                            ←
                        </button>
                        <img
                            src={`/storage/${user.portfolio[currentImageIndex].image_url}`}
                            className="max-h-[80vh] w-auto mx-auto rounded-lg shadow-2xl"
                            alt="Portfolio item"
                        />
                        <button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
                            onClick={nextImage}
                        >
                            →
                        </button>
                        <button
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
