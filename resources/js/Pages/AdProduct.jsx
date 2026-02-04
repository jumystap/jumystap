import GuestLayout from "@/Layouts/GuestLayout";
import {useTranslation} from 'react-i18next';
import React, {useState} from "react";
import {Link, Head} from "@inertiajs/react";
import {FaInstagram, FaTelegramPlane, FaWhatsapp} from "react-icons/fa";
import {FaTiktok} from "react-icons/fa6";
import ShareButtons from "@/Components/ShareButtons";

export default function Ad({auth, ad, category}) {
    const {t, i18n} = useTranslation('announcements');
    const [showFullText, setShowFullText] = useState(false);
    const maxLength = 90;
    const isLongText = ad.user.description ? ad.user.description.length > maxLength : false;

    const toggleShowFullText = () => setShowFullText((prev) => !prev);

    // Состояния для лайтбокса
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                <div className="grid md:grid-cols-7 grid-cols-1">
                    <div className="md:col-span-5">
                        <div className="border-b border-gray-200 px-4 md:px-6 py-4 text-sm font-semibold">
                            <Link
                                href="/ads"
                                className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-2"
                            >
                                <span>←</span>
                                Назад к товарам
                            </Link>
                        </div>
                        <div className="border-b border-gray-200 pt-6 px-4 md:px-6 py-5 md:py-6">
                            <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-6 md:gap-8 pt-4">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => allImages.length > 0 && openLightbox(0)}
                                        className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                    >
                                        <img
                                            src={(allImages[0] && (allImages[0].url || allImages[0])) || "/images/image.png"}
                                            alt={ad.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                    {previewImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            {previewImages.map((image, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => openLightbox(index)}
                                                    className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                                                >
                                                    <img
                                                        src={image.url || image}
                                                        alt={`${ad.title} - ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    {allImages.length > 3 && index === 2 && (
                                                        <span className="absolute inset-0 bg-black/50 text-white text-xl font-semibold flex items-center justify-center">
                                                            +{allImages.length - 3}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="relative space-y-4 pb-12">
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold leading-tight">{ad.title}</div>
                                        <div className="mt-1.5 text-xl md:text-2xl font-semibold">
                                            {ad.price_type === "exact" && ad.price_exact && `${ad.price_exact.toLocaleString()} ₸ `}
                                            {ad.price_type === "range" && ad.price_from && ad.price_to &&
                                                `${i18n?.language === "ru"
                                                    ? "от " + ad.price_from.toLocaleString() + " ₸ до " + ad.price_to.toLocaleString() + " ₸"
                                                    : ad.price_from.toLocaleString() + " ₸ бастап " + ad.price_to.toLocaleString() + " ₸ дейін"}`
                                            }
                                            {ad.price_type === "negotiable" && t("negotiable", {ns: "index"})}
                                        </div>
                                    </div>

                                    <a
                                        href={auth.user ? `/ad/connect/${ad.id}` : "/login"}
                                        className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold shadow-md shadow-blue-500/30"
                                    >
                                        Связаться по WhatsApp
                                    </a>

                                    <div>
                                        <div className="text-sm font-semibold">Описание товара:</div>
                                        <p className="mt-2 text-sm leading-6 text-gray-700 whitespace-pre-line">
                                            {ad.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 md:px-6 pb-6 flex items-center justify-end gap-3">
                            <span className="text-sm font-semibold text-gray-700">{t('share')}:</span>
                            <ShareButtons
                                title={
                                    (ad.price_exact ?? ad.price_from)
                                        ? `${ad.title}. Цена от ${ad.price_exact ?? ad.price_from} тенге`
                                        : ad.title
                                }
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 border-l border-gray-200 md:block hidden sticky top-0">
                        <div className="border-b border-gray-200 px-6 py-4 text-sm font-semibold">Информация об исполнителе</div>
                        <div className="px-6 py-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full border border-gray-200 overflow-hidden bg-gray-100">
                                    <img
                                        src={ad.user.avatar || "/images/default-avatar.png"}
                                        alt={ad.user.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold">{ad.user.name}</div>
                                    <div className="text-xs text-gray-500">Выпускник JOLTAP</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Категория:</div>
                                <div className="text-sm font-medium">{category}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Адрес:</div>
                                <div className="text-sm text-gray-800">
                                    {ad.city.title}{ad.address ? `, ${ad.address}` : ''}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Соц. сети:</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="h-9 w-9 rounded-lg bg-green-500 text-white flex items-center justify-center">
                                        <FaWhatsapp />
                                    </span>
                                    <span className="h-9 w-9 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                                        <FaTelegramPlane />
                                    </span>
                                    <span className="h-9 w-9 rounded-lg bg-pink-500 text-white flex items-center justify-center">
                                        <FaInstagram />
                                    </span>
                                    <span className="h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center">
                                        <FaTiktok />
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                {showFullText ? (ad?.user?.description || "") : (ad?.user?.description ? ad.user.description.slice(0, maxLength) : "")}
                                {isLongText && (
                                    <span onClick={toggleShowFullText} className="text-blue-500 cursor-pointer ml-2">
                                        {showFullText ? t('hide') : t('more_details')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {lightboxOpen && allImages.length > 0 && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <div className="relative max-w-5xl w-full px-4">
                            <button
                                className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
                                onClick={() => setLightboxOpen(false)}
                            >
                                ×
                            </button>

                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrev();
                                }}
                            >
                                ‹
                            </button>

                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                            >
                                ›
                            </button>

                            <img
                                src={allImages[currentImageIndex].url || allImages[currentImageIndex]}
                                alt={`${ad.title} - ${currentImageIndex + 1}`}
                                className="w-full h-auto max-h-screen object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <div
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-lg">
                                {currentImageIndex + 1} / {allImages.length}
                            </div>
                        </div>
                    </div>
                )}
            </GuestLayout>
        </>
    );
}
