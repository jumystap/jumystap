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
                <div className='grid grid-cols-1 md:grid-cols-3 pt-10 gap-5'>
                    <div className='border border-gray-300 rounded-lg p-5 md:p-10'>
                        <div className='flex'>
                            <div className='mx-auto'>
                                <img src={`/storage/${user.image_url}`} className='w-[100px] h-[100px] rounded-full object-cover' />
                            </div>
                        </div>
                        <div className="flex w-full">
                        <div className='font-bold mx-auto flex text-2xl text-center mt-3 items-center gap-2'>{user.name} {user.is_graduate ? (<RiVerifiedBadgeFill className='text-3xl text-orange-500' />):('')}</div>
                        </div>
                        <div className='mt-10'>
                            <div className="text-center">
                                {t('age', {ns: "header"})}: {user.age}
                            </div>
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
                            {auth.user == null ? (
                                <Link href="/register"className='text-white rounded-lg text-center mx-auto items-center inline-block mt-5 bg-orange-500 py-2 px-10'>
                                    <span className='font-bold'>Связаться</span>
                                </Link>
                            ):(
                                <a href={`https://wa.me/${user.phone}?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A`} className='text-white rounded-lg text-center mx-auto items-center inline-block mt-5 bg-orange-500 py-2 px-10'>
                                    <span className='font-bold'>Связаться</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className='col-span-2 border border-gray-300 rounded-lg p-5 md:p-5'>
                        {user.portfolio.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                                {user.portfolio.map((image, index) => (
                                    <div className="relative group" key={index}>
                                        <img
                                            src={`/storage/${image.image_url}`}
                                            className='w-full h-[200px] object-cover rounded cursor-pointer'
                                            onClick={() => openImageModal(index)}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="text-white bg-orange-500 py-2 px-4 rounded mr-2"
                                                onClick={() => openImageModal(index)}
                                            >
                                                Смотреть
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='flex h-full'>
                                <div className='my-auto mx-auto'>
                                    <div className='text-gray-500 font-bold'>У {user.name} нет портфолио</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex mt-10'>
                    <div className='font-bold'>Похожие исполнители</div>
                    <Link href='/employees' className='ml-auto text-orange-500 font-bold'>Вернуться к поиску</Link>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mt-4 gap-2'>
                    {employees.map((employee, index) => (
                        <Link href={`/user/${employee.id}`} key={index} className='p-3 hover:border-orange-500 transition-all duration-150 border border-gray-300 rounded-lg block'>
                            <div className='flex gap-3'>
                                <div>
                                    <img src={`/storage/${employee.image_url}`} alt="" className='w-[40px] h-[40px] object-cover rounded-full' />
                                    <div className='text-sm font-bold text-white bg-orange-500 rounded text-center relative w-[40px] bottom-[10px]'>
                                        {toDoubleString(employee.rating)}
                                    </div>
                                </div>
                                <div className='font-bold'>{employee.name}</div>
                            </div>
                            <div className='mt-2 text-sm'>
                                {employee.professions.length > 0 && (
                                    <>
                                        {employee.professions.map((profession, index) => (
                                            <div key={index}>{profession.profession_name}</div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </Link>
                    ))}
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
