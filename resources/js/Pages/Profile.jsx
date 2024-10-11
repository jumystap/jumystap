import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import CreatePortfolioModal from '@/Components/CreatePortfolioModal';
import AddCertificateModal from '@/Components/AddCertificateModal';
import { Inertia } from "@inertiajs/inertia";
import Dashboard from "./Company/Dashboard";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function Profile({ auth, user, announcements, employees, professions, userProfessions }) {
    const { t, i18n } = useTranslation();
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false);
    const [isAddCertificateModalOpen, setIsAddCertificateModalOpen] = useState(false);
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
                        <div className="grid grid-cols-1 md:grid-cols-7">
                            <div className='col-span-5'>
                                <div className='flex md:flex-row flex-col gap-x-3 p-10 bg-white border-b border-gray-200'>
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
                                            ):('')}
                                        </div>
                                        <div className="text-gray-500">
                                            @{user.email.split('@')[0]}
                                        </div>
                                        {userProfessions.length > 0 && (
                                            <>
                                                {userProfessions.map((profession, index) => (
                                                    <div className='mt-1' key={index}>{i18n.language == 'ru' ? (profession.profession_name):(profession.professions_name_kz)}</div>
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
                                            Изменить
                                        </Link>
                                        <Link
                                            href='/update_certificate'
                                            className='text-center mt-2 block border-2 text-blue-500 border-blue-500 px-5 py-2 rounded-lg'
                                        >
                                            Обновить сертификат
                                        </Link>
                                    </div>
                                </div>
                                <div className='px-5 mt-5'>
                                    <Link href='#' className='block px-7 py-2 bg-blue-500 text-white inline-block rounded-lg'>Создать резюме</Link>
                                </div>
                                <div className='flex'>
                                </div>
                            </div>
                            <div className="col-span-2 h-screen sticky top-0 border-l md:block hidden border-gray-200">
                            </div>
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
