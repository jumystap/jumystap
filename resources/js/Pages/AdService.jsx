import GuestLayout from "@/Layouts/GuestLayout";
import {useTranslation} from 'react-i18next';
import React, {useState} from "react";
import {Link, Head} from "@inertiajs/react";
import {FaInstagram, FaTelegramPlane, FaWhatsapp} from "react-icons/fa";
import {FaTiktok} from "react-icons/fa6";
import ShareButtons from "@/Components/ShareButtons";
import {formatDistanceToNow} from "date-fns";
import {ru} from "date-fns/locale";
import DOMPurify from 'dompurify';

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

    // Только первые 4 для превью в объявлении
    const previewImages = allImages.slice(0, 4);

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
                }
                return form + ' бұрын';
            }
            return form;
        }
    };

    const updatedAt = ad?.updated_at || ad?.published_at || ad?.created_at;
    const updatedAtLabel = updatedAt
        ? `${i18n.language === 'ru' ? 'Обновлено ' : ''}${formatDistanceToNow(new Date(updatedAt), {
            locale: i18n.language === 'ru' ? ru : kz,
            addSuffix: true
        })}${i18n.language === 'kz' ? ' жаңартылды' : ''}`
        : null;

    const cityTitle = ad?.city?.title || ad?.city || '';
    const locationLabel = ad?.is_remote
        ? (i18n.language === 'ru' ? 'Удаленно' : 'Қашықтан')
        : [cityTitle, ad?.address].filter(Boolean).join(', ');

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
            <Head title={`${ad.title}${cityTitle ? ` в ${cityTitle}` : ''} | Объявление от ${ad.user.name}`}>
                <meta name="description" content={`Объявление ${ad.title}${cityTitle ? ` в ${cityTitle}` : ''} от ${ad.user.name}.`}/>
            </Head>

            <GuestLayout>
                <div className="grid md:grid-cols-7 grid-cols-1">
                    <div className="md:col-span-5">
                        <div className="border-b border-gray-200 px-4 md:px-6 py-4">
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <Link
                                    href="/ads"
                                    className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-2 font-semibold"
                                >
                                    <span>←</span>
                                    Назад к услугам
                                </Link>
                                {updatedAtLabel && (
                                    <span className="text-xs text-gray-500 font-medium">{updatedAtLabel}</span>
                                )}
                            </div>
                        </div>
                        <div className="border-b border-gray-200 pt-6 pb-6 md:px-6">
                            <div className="space-y-3">
                                <div className="text-2xl md:text-3xl font-bold leading-tight">{ad.title}</div>
                                {locationLabel && (
                                    <div className="text-sm text-gray-500">{locationLabel}</div>
                                )}
                                <div className="text-xl md:text-2xl font-semibold">
                                    {ad.price_type === "exact" && ad.price_exact && `${ad.price_exact.toLocaleString()} ₸ `}
                                    {ad.price_type === "range" && ad.price_from && ad.price_to &&
                                        `${i18n?.language === "ru"
                                            ? "от " + ad.price_from.toLocaleString() + " ₸ до " + ad.price_to.toLocaleString() + " ₸"
                                            : ad.price_from.toLocaleString() + " ₸ бастап " + ad.price_to.toLocaleString() + " ₸ дейін"}`
                                    }
                                    {ad.price_type === "range" && !ad.price_from && ad.price_to &&
                                        `${i18n?.language === "ru"
                                            ? "до " + ad.price_to.toLocaleString() + " ₸"
                                            : ad.price_to.toLocaleString() + " ₸ дейін"}`
                                    }
                                    {ad.price_type === "range" && ad.price_from && !ad.price_to &&
                                        `${i18n?.language === "ru"
                                            ? "от " + ad.price_from.toLocaleString() + " ₸"
                                            : ad.price_from.toLocaleString() + " ₸ бастап"}`
                                    }
                                    {ad.price_type === "negotiable" && t("negotiable", {ns: "index"})}
                                </div>
                            </div>

                            <a
                                href={auth.user ? `/ad/connect/${ad.id}` : "/login"}
                                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold shadow-md shadow-blue-500/30"
                            >
                                Связаться по WhatsApp
                            </a>
                        </div>

                            <div className="border-b border-gray-200 px-4 md:px-6 py-4">
                                <div className="text-base font-semibold">Описание объявления:</div>
                                <div className="mt-3 text-sm leading-6 text-gray-700 whitespace-pre-line"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(ad.description),
                                    }}
                                />
                            </div>

                            <div className="border-b border-gray-200 px-4 md:px-6 py-4">
                                <div className="text-base font-semibold">Фото:</div>
                                {previewImages.length > 0 ? (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {previewImages.map((image, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => openLightbox(index)}
                                                className="relative aspect-[4/5] overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                                            >
                                                <img
                                                    src={image.url || image}
                                                    alt={`${ad.title} - ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {allImages.length > previewImages.length && index === previewImages.length - 1 && (
                                                    <span className="absolute inset-0 bg-black/55 text-white text-2xl font-semibold flex items-center justify-center">
                                                        +{allImages.length - previewImages.length}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-3 text-sm text-gray-400">Нет фотографий</div>
                                )}
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
                                    {[cityTitle, ad?.address].filter(Boolean).join(', ')}
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
