import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function User({ auth, user, employees, userProfessions}) {
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
                                    <Link href="/register"className='md:hidden mt-3 text-white rounded-lg text-center inline-block bg-blue-500 py-2 px-10'>
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
                        <div className='mt-10'>
                            <div className='text-center font-bold text-lg'>
                                {userProfessions.length > 0 && (
                                    <>
                                        {userProfessions.map((profession, index) => (
                                            <div key={index}>{i18n.language == 'ru' ? (profession.profession_name):(profession.professions_name_kz)}</div>
                                        ))}
                                    </>
                                )}
                            </div>
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
}
