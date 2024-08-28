import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import ReactStars from "react-stars";
import UpdateEmployeeProfileModal from '@/Components/UpdateEmployeeProfileModal';
import UpdateNonEmployeeProfileModal from '@/Components/UpdateNonEmployeeProfileModal';
import CreateAnnouncementModal from '@/Components/CreateAnnouncementModal';
import CreatePortfolioModal from '@/Components/CreatePortfolioModal';
import AddCertificateModal from '@/Components/AddCertificateModal';
import { Inertia } from "@inertiajs/inertia";
import Dashboard from "./Company/Dashboard";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function Profile({ auth, user, announcements, employees, professions, userProfessions }) {
    const { t, i18n } = useTranslation();
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isNonEmployeeModalOpen, setIsNonEmployeeModalOpen] = useState(false);
    const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false);
    const [isAddCertificateModalOpen, setIsAddCertificateModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [missingCertificateProfession, setMissingCertificateProfession] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const deleteImage = (imageId) => {
        Inertia.delete(route('portfolio.delete', { id: imageId }), {
            onSuccess: () => {
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
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
                {user.role.name === 'employee' ? (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-3 pt-10 gap-5'>
                            <div className='border border-gray-300 rounded-lg p-5 md:p-10'>
                                <div className='flex'>
                                    <div className='mx-auto'>
                                        <img src={`/storage/${user.image_url}`} className='w-[100px] h-[100px] rounded-full object-cover' />
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className='mx-auto font-bold flex text-2xl text-center mt-3 items-center gap-2'>
                                        {user.name}
                                        {user.is_graduate ? (
                                            <RiVerifiedBadgeFill className='text-3xl text-orange-500' />
                                        ): ('')}
                                    </div>
                                </div>
                                <div className='mt-10'>
                                    <div className='text-center'>
                                        {i18n.language === 'ru' ? user.status : user.status_kz}
                                    </div>
                                    <div className='text-center'>
                                        {i18n.language === 'ru' ? user.work_status : user.work_status_kz}
                                    </div>
                                    <div className='text-center'>
                                        {i18n.language === 'ru' ? user.ip : user.ip_kz}
                                    </div>
                                </div>
                                <div className='mt-10'>
                                    <div className='text-center font-bold'>
                                        {userProfessions.length > 0 && (
                                            <>
                                                {userProfessions.map((profession, index) => (
                                                    <div key={index}>{profession.profession_name}: {profession.certificate_number}</div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className='flex'>
                                    <Link
                                        href='/update'
                                        className='text-white rounded-lg text-center mx-auto items-center inline-block mt-5 bg-orange-500 py-2 px-10 cursor-pointer'
                                    >
                                        <span className='font-bold'>Редактировать</span>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-span-2 border p-5 border-gray-300 rounded-lg h-full'>
                                <div
                                    className="cursor-pointer bg-orange-500 text-white inline-block py-2 px-9 rounded-lg"
                                    onClick={() => setIsCreatePortfolioModalOpen(true)}
                                >
                                    Добавить портфолио
                                </div>
                                {user.portfolio.length > 0 ? (
                                    <div className='mt-5 grid md:grid-cols-3 grid-cols-1 gap-5'>
                                        {user.portfolio.map((image, index) => (
                                            <div className="relative group" key={index}>
                                                <img
                                                    src={`/storage/${image.image_url}`}
                                                    className='w-full h-[200px] object-cover rounded'
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="text-white bg-orange-500 py-2 px-4 rounded mr-2"
                                                        onClick={() => openImageModal(index)}
                                                    >
                                                        Смотреть
                                                    </button>
                                                    <button
                                                        className="text-white bg-red-500 py-2 px-4 rounded"
                                                        onClick={() => deleteImage(image.id)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='flex w-full h-full pb-5'>
                                        <div className='text-center mx-auto my-auto text-gray-500'>У вас нет портфолио</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex mt-10'>
                            <div className='font-bold'>Актуальные объявления</div>
                            <Link href='/announcements' className='ml-auto text-orange-500 font-bold'>Перейти к поиску</Link>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-5'>
                            {announcements.map((anonce, index) => (
                                <div key={index} className='p-3 border border-gray-300 rounded-lg'>
                                    <div className='flex items-center'>
                                        <div className='text-[8pt] font-bold text-white py-1 px-2 rounded bg-[#f36706] '>
                                            {i18n.language === 'ru' ? anonce.type_ru.toUpperCase() : anonce.type_kz.toUpperCase()}
                                        </div>
                                        <div className='font-bold text-sm ml-auto'>
                                            {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                            {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                            {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                            {anonce.salary_type == 'undefined' && (`Договорная`)}
                                        </div>
                                    </div>
                                    <div className='mt-3 text-[10pt]'>
                                        {anonce.title}
                                    </div>
                                    <div className='mt-1 text-[10pt] text-gray-500'>
                                        {anonce.description.length > 60
                                            ? `${anonce.description.substring(0, 60)}...`
                                            : anonce.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <Dashboard user={user} announcements={announcements}/>
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
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
