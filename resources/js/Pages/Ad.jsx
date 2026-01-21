import GuestLayout from "@/Layouts/GuestLayout";
import {useTranslation} from 'react-i18next';
import React, {useState} from "react";  // useEffect больше не нужен
import {Link, Head} from "@inertiajs/react";
import {FaRegHeart, FaHeart} from "react-icons/fa";
import {useForm} from '@inertiajs/react';
import {FaSquareCheck} from "react-icons/fa6";
import {MdIosShare} from "react-icons/md";
import ShareButtons from "@/Components/ShareButtons";

export default function Ad({auth, ad, category}) {
    const {t, i18n} = useTranslation('announcements');
    const {post, delete: destroy} = useForm();
    const [isFavorite, setIsFavorite] = useState(ad.is_favorite);
    const [showFullText, setShowFullText] = useState(false);

    // Состояния для лайтбокса
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const toggleShowFullText = () => setShowFullText(!showFullText);

    const maxLength = 90;
    const isLongText = ad.user.description ? ad.user.description.length > maxLength : false;

    const handleFavoriteClick = () => {
        if (isFavorite) {
            destroy(`/fav/${ad.id}`, {
                onSuccess: () => setIsFavorite(false),
            });
        } else {
            post(`/fav/${ad.id}`, {
                onSuccess: () => setIsFavorite(true),
            });
        }
    };

    const handleShare = () => {
        const url = `https://jumystap.kz/ad/${ad.id}`;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this ad',
                url: url,
            }).catch((error) => console.error('Sharing failed:', error));
        } else {
            alert(`Share this link: ${url}`);
        }
    };

    // Все изображения объявления (для лайтбокса)
    const allImages = ad.photos || [];

    // Только первые 3 для превью в объявлении
    const previewImages = allImages.slice(0, 3);

    // Открытие лайтбокса
    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    // Навигация
    const goPrev = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const goNext = () => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    // Закрытие по ESC или клику на overlay
    React.useEffect(() => {
        const handleKey = (e) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxOpen, currentImageIndex]);

    return (
        <>
            <Head title={`${ad.title} в ${ad.city} | Объявление от ${ad.user.name}`}>
                <meta name="description" content={`Объявление ${ad.title} в ${ad.city.title} от ${ad.user.name}.`}/>
            </Head>

            <GuestLayout>
                <div className='grid grid-cols-1 md:grid-cols-9'>
                    <div className="md:col-span-6 pt-5">
                    <div className='md:mb-5 mb-2 px-5'>
                        <div className='p-5 rounded-lg border border-gray-200'>
                            <div className=''>
                                <div className='text-xl md:text-2xl mt-1 font-bold max-w-[700px]'>{ad.title}</div>
                                <div className="mt-2 text-sm font-light">
                                    {ad.city.title}
                                    {ad.is_remote ? (
                                        <>
                                            <span>, {t('is_remote')}.</span>
                                        </>
                                    ) :
                                        <>
                                            <span>{ad.address ? ', ' + ad.address + '.' : ''}</span>
                                        </>
                                    }
                                </div>
                                <div className='mt-2 text-2xl'>
                                    {ad.price_type === "exact" &&
                                        ad.price_exact &&
                                        `${ad.price_exact.toLocaleString()} ₸ `}
                                    {ad.price_type === "range" &&
                                        ad.price_from &&
                                        ad.price_to &&
                                        `${i18n?.language === "ru" ? "от " + ad.price_from.toLocaleString() + " ₸ до " + ad.price_to.toLocaleString() + " ₸" :
                                            ad.price_from.toLocaleString() + " ₸ бастап " + ad.price_to.toLocaleString() + " ₸ дейін"}`
                                    }
                                    {ad.price_type === "negotiable" && t("negotiable", {ns: "index"})}

                                </div>
                            </div>
                            <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                {auth.user ? (
                                    <>
                                        <a href={`/ad/connect/${ad.id}`}
                                           className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{t('contact')}</span>
                                        </a>
                                        {auth.user.email === 'admin@example.com' && (
                                            <a href={`/ads/${ad.id}/edit`}
                                               className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                                <span className='font-bold'>{t('edit')}</span>
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Link href='/login'
                                              className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{t('contact')}</span>
                                        </Link>
                                        <Link href='/login'
                                              className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{ad.type_label}</span>
                                        </Link>
                                    </>
                                )}
                                <div
                                    onClick={handleShare}
                                    className={`border-2 ${isFavorite ? 'border-transparent' : 'border-blue-500'} rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                                    <MdIosShare className='text-blue-500 text-xl'/>
                                </div>
                            </div>
                        </div>
                        <div className='md:hidden mt-5 px-5 py-4 rounded-lg border border-gray-200'>
                            <div className='text-left font-regular text-xl'>{ad.user.name}</div>
                            <div className='text-left mt-2 font-light text-gray-500'>
                                {showFullText ? (ad?.user?.description || "") : (ad?.user?.description ? ad.user.description.slice(0, maxLength) : "")}
                                {isLongText && (
                                    <span onClick={toggleShowFullText} className="text-blue-500 cursor-pointer">
                                            {showFullText ? t('hide') : t('more_details')}
                                        </span>
                                )}
                            </div>
                            {ad.user.is_graduate ? (
                                <>
                                    <div className="flex mt-2 mb-3 text-gray-500 gap-x-1 font-light items-center text-sm">
                                        <FaSquareCheck className="text-green-600" />
                                        {t('is_graduate')}
                                    </div>
                                </>
                            ) : ('')}
                        </div>
                    </div>

                    <div className='mt-5 rounded-lg border mx-5'>
                        <div className="px-3 py-2 mt-2 text-md font-light">
                            <div className='text-left font-regular text-md text-bold'>
                                <b>{t('category')}:</b> {category}
                            </div>
                        </div>

                        {/* === Превью изображений (макс. 3) === */}
                        {previewImages.length > 0 && (
                            <div className="mt-6 px-3 pb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {previewImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                            onClick={() => openLightbox(index)}
                                        >
                                            <img
                                                src={image.url || image}
                                                alt={`${ad.title} - изображение ${index + 1}`}
                                                className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                            {allImages.length > 3 && index === 2 && (
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                <span className="text-white text-2xl font-bold">
                                                    +{allImages.length - 3}
                                                </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {allImages.length > 3 && (
                                    <p className="text-sm text-gray-500 mt-3 text-center">
                                        Нажмите на изображение, чтобы просмотреть все {allImages.length} фото
                                    </p>
                                )}
                            </div>
                        )}

                        {/* === Лайтбокс (модальное окно) === */}
                        {lightboxOpen && allImages.length > 0 && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                                onClick={() => setLightboxOpen(false)}
                            >
                                <div className="relative max-w-5xl w-full px-4">
                                    {/* Кнопка закрытия */}
                                    <button
                                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
                                        onClick={() => setLightboxOpen(false)}
                                    >
                                        ×
                                    </button>

                                    {/* Предыдущая */}
                                    <button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goPrev();
                                        }}
                                    >
                                        ‹
                                    </button>

                                    {/* Следующая */}
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goNext();
                                        }}
                                    >
                                        ›
                                    </button>

                                    {/* Текущее изображение */}
                                    <img
                                        src={allImages[currentImageIndex].url || allImages[currentImageIndex]}
                                        alt={`${ad.title} - ${currentImageIndex + 1}`}
                                        className="w-full h-auto max-h-screen object-contain"
                                        onClick={(e) => e.stopPropagation()} // чтобы клик по фото не закрывал
                                    />

                                    {/* Счётчик */}
                                    <div
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-lg">
                                        {currentImageIndex + 1} / {allImages.length}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-3 py-2 text-md font-light">
                            <div className='text-left font-regular text-md mt-3'>
                                <b>{t('description')}:</b>
                            </div>
                            {ad.description}
                        </div>

                        <p className="px-3 mt-5 py-2 border-gray-200 font-bold flex items-center gap-2">
                            {t('share')}:
                            <ShareButtons
                                title={
                                    (ad.price_exact ?? ad.price_from)
                                        ? `${ad.title}. Зарплата от ${ad.price_exact ?? ad.price_from} тенге`
                                        : ad.title
                                }
                            />
                        </p>
                    </div>
                    </div>
                    <div className="col-span-3 border-l h-screen md:block hidden sticky top-0 border-gray-200">
                        <div className='px-5 py-4 border-b border-t border-gray-200'>
                            <div className='text-left font-regular text-xl'>{ad.user.name}</div>
                            <div className='mt-2 text-left font-regular text-md text-bold'>
                                <b>{t('business_type')}:</b> {category}
                            </div>
                            <div className='text-left mt-2 font-regular'>
                                {showFullText ? (ad?.user?.description || "") : (ad?.user?.description ? ad.user.description.slice(0, maxLength) : "")}
                                {isLongText && (
                                    <span onClick={toggleShowFullText} className="text-blue-500 cursor-pointer">
                                        {showFullText ? t('hide') : t('more_details')}
                                    </span>
                                )}
                            </div>
                            {ad.user.is_graduate ? (
                                <>
                                    <div className="flex mt-10 mb-3 text-gray-500 gap-x-1 font-light items-center text-sm">
                                        <FaSquareCheck className="text-green-600" />
                                        {t('is_graduate')}
                                    </div>
                                </>
                            ) : ('')}
                            {auth.user ? (
                                <>
                                    <a href={`/ad/connect/${ad.id}`}
                                       className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                        <span className='font-bold'>{t('contact')}</span>
                                    </a>
                                </>
                            ) : (
                                <Link href='/login'
                                      className='text-white text-center shadow-lg shadow-blue-500/50 rounded-lg items-center w-full block bg-blue-500 py-2 px-5 md:px-10'>
                                    <span className='font-bold'>{t('contact')}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}
