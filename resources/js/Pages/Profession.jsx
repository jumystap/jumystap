import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Link, usePage } from '@inertiajs/react';
import { FaStar } from "react-icons/fa";

export default function Profession({ professions }) {
    const { t, i18n } = useTranslation();

    console.log(professions);

    return (
        <>
            <GuestLayout>
                <div className='px-5'>
                {professions.map((profession, index) => (
                    <div key={index} id={profession.id} className={`mt-10 border-b-2 border-gray-300 pb-10 ${profession.name_ru === 'Контент-криэйтор' && (`hidden`)} ${profession.name_ru === 'Продажи на Wildberries' && (`hidden`)}  ${profession.name_ru === 'Базовые цифровые навыки' && (`hidden`)}`}>
                        {profession.name_ru === 'SMM-специалист' && (
                            <div className="w-full mb-10 bg-gray-100 px-5 md:px-10 py-7 mt-10 max-w-[1300px] mx-auto">
                                <div className="text-center font-bold text-xl">
                                    {i18n.language == 'ru' ? (
                                    `ПАРТНЕРЫ НАШЕГО ОБУЧЕНИЯ - КРУПНОЕ МАРКЕТИНГОВОЕ АГЕНСТВО АСТАНЫ`
                                    ):(
                                        `БІЛІМІМІЗДІҢ СЕРІКТЕСТЕРІ - АСТАНАНЫҢ ІРІ МАРКЕТИНГТІК АГЕНТТІГІ`
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-10 items-center">
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/ok-no.png" className="mx-auto" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-2xl sm:text-5xl text-orange-500">6 {i18n.language == 'ru' ? (`лет`):(`жыл`)}</div>
                                        <div className="mt-4">{i18n.language == 'ru' ? (`на рынке маркетинга`):(`маркетинг нарығында`)}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-2xl sm:text-5xl text-orange-500">187</div>
                                        <div className="mt-4">{i18n.language == 'ru' ? (`реализованных проектов`):(`жасалған жоба`)}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-2xl sm:text-5xl text-orange-500">6</div>
                                        <div className="mt-5">{i18n.language == 'ru' ? (`направлений`) : (`бағыт`)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='flex flex-col md:flex-row items-center'>
                            <div className='flex w-full items-center gap-3'>
                                <img src={`/storage/${profession.icon_url}`} className='w-[50px] h-[50px]' />
                                <div className='text-2xl sm:text-4xl font-bold text-[#f36706]'>
                                    {i18n.language === 'ru' ? (
                                        profession.name_ru
                                    ) : (
                                        profession.name_kz
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center gap-4  md:ml-auto mr-auto font-bold mt-5 md:mt-0'>
                                <div>{t('graduates_count', { ns: 'profession' })}</div>
                                <div className='text-2xl sm:text-4xl text-[#f36706]'>{profession.release_count}</div>
                            </div>
                        </div>
                        <div className='inline-block text-white px-5 rounded-lg mt-10 text-lg font-bold py-2 bg-[#f36706]'>
                            {t('skills', { ns: 'profession' })}
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 gap-x-10 mt-5 font-light'>
                            {profession.skills.length > 0 ? (
                                <>
                                    {profession.skills.map((skill, index) => (
                                        <div key={index} className='flex gap-2 max-w-[600px] items-center'>
                                            <FaStar className='fixed-star' />
                                            {i18n.language === 'ru' ? (
                                                skill.name_ru
                                            ) : (
                                                skill.name_kz
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div>
                                    2
                                </div>
                            )}
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5 font-light'>
                            {profession.images.length > 0 ? (
                                <>
                                    {profession.images.map((image, index) => (
                                        <img key={index} src={`/storage/${image.image_url}`} alt="" className='rounded-lg' />
                                    ))}
                                </>
                            ) : (
                                <div>

                                </div>
                            )}
                        </div>
                        <div className='inline-block text-white px-5 rounded-lg mt-10 text-lg font-bold py-2 bg-[#f36706]'>
                            {t('teacher', { ns: 'profession' })}
                        </div>
                        {profession.teachers.length > 0 && (
                            <div className='flex flex-col md:flex-row gap-5'>
                                {profession.teachers.slice().reverse().map((teacher, index) => (
                                    <div key={index} className='flex mt-5 flex-col md:flex-row gap-5'>
                                        <img src={`/storage/${teacher.image_url}`} alt="" className='rounded-lg w-full md:w-[150px] object-cover' />
                                        <div>
                                            <div className='font-bold'>{teacher.last_name} {teacher.first_name} {teacher.middle_name}</div>
                                            {i18n.language === 'ru' ? (
                                                <div className='mt-2 max-w-[700px]' dangerouslySetInnerHTML={{ __html: teacher.description_ru }} />
                                            ) : (
                                                <div className='mt-2 max-w-[700px]' dangerouslySetInnerHTML={{ __html: teacher.description_kz }} />
                                            )}
                                            {teacher.skills.length > 0 && (
                                                <>
                                                    {teacher.skills.map((skill, index) => (
                                                        <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                            <FaStar className='fixed-star' />
                                                            {i18n.language === 'ru' ? (
                                                                skill.name_ru
                                                            ) : (
                                                                skill.name_kz
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='flex'>
                            <div className='flex gap-5 mx-auto mt-10 items-center'>
                                <a href={profession.video_url} className='block font-bold border-2 border-orange-500 px-5 py-2 text-orange-500 rounded-lg'>{i18n.language == 'ru' ? (`Смотреть видеоролик`):(`Бейнероликті көру`)}</a>
                                <div className='font-bold bg-orange-500 rounded-lg text-white px-5 py-2'>{i18n.language == 'ru' ? (`Создать объявление`) : (`Жарнама жасау`)}</div>
                            </div>
                        </div>
                        {profession.name_ru === 'Модельер-конструктор' && (
                            <>
                                <div className="mt-5">
                                    <div className='font-bold text-white py-2 px-5 bg-orange-500 rounded-lg uppercase text-lg inline-block'>{i18n.language == 'ru' ? (`Оборудование`):(`ЖАБДЫҚТАР`)}</div>
                                    <div className='flex gap-10 mt-10'>
                                        <div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Плоскошовная промышленная машинка Jack`
                                                ) : (
                                                    `Jack жалпақ тігісті өнеркәсіптік машина`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Закрепочная швейная машинка VMA`
                                                ) : (
                                                    `VMA бекіту тігін машинасы`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Петельная швейная машинка Jack`
                                                ) : (
                                                    `Jack ілмекті тігін машинасы`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Пуговичная швейная машинка и оверлок Jack`
                                                ) : (
                                                    `Jack түймелі тігін машинасы`
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex gap-5 ml-auto'>
                                            <img src="/eq/shveya-eq2.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/shveya-eq1.png" className='w-[300px] object-cover rounded-lg'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                    <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИМ ВЫПУСКНИКАМ ДОВЕРЯЮТ:`) : (`БІЗДІҢ ТҮЛЕКТЕРГЕ СЕНІМ АРТАДЫ:`)}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-8 pt-10">
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/yutariya.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ЮТАРИЯ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупнейшее швейное-текстильное производство РК`) : (`ҚР-ның ең ірі тігін-тоқыма өндірісі`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`22 года на рынке`) : (`22 жыл нарықта`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/danmard.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ДАНМАРД</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупное швейное предприятие по пошиву военной и спецодежды`) : (`Әскери және арнайы киім тігетін ірі тігін фабрикасы`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`Более 10 лет на рынке`) : (`10 жылдан астам нарықта`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/dala.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ДАЛА БРЕНД</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Современное ателье в нео-казахском стиле`) : (`Нео-қазақ стиліндегі заманауи ателье`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/wear.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ДУЙКАЗ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Совместное турецко-казахстанское предприятие по пошиву спецодежды`) : (`Арнайы киім тігетін түрік-қазақ бірлескен кәсіпорны`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/pidzhak.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ПИДЖАК KZ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупный портной дом индивидуального пошива`) : (`Жеке тігу қызметімен айналысатын ірі тігін үйі`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`Более 10 лет на рынке`) : (`10 жылдан астам нарықта`)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {profession.name_ru === 'Бариста' && (
                            <>
                                <div className="mt-5">
                                    <div className='font-bold text-white py-2 px-5 bg-orange-500 rounded-lg uppercase text-lg inline-block'>{i18n.language == 'ru' ? (`Оборудование`):(`ЖАБДЫҚТАР`)}</div>
                                    <div className='flex gap-10 mt-10'>
                                        <div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Кофемашина Nuova Simonelli Appia Life 1Gr S полуавтомат`
                                                ) : (
                                                    `Nuova Simonelli Appia life 1  GR S кофе машинасы жартылай автоматты`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Кофемолка Fiorenzato F64E`
                                                ) : (
                                                    `Fiorenzato F64e кофе тартқышы`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Блендер для приготовления молочно-кофейных напитков Braun`
                                                ) : (
                                                    `Braun сүт-кофе сусындарын дайындауға арналған блендер`
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex gap-5 ml-auto'>
                                            <img src="/eq/barista-eq1.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/barista-eq2.png" className='w-[300px] object-cover rounded-lg'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                    <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИМ ВЫПУСКНИКАМ ДОВЕРЯЮТ:`) : (`БІЗДІҢ ТҮЛЕКТЕРГЕ СЕНІМ АРТАДЫ:`)}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-8 pt-10 items-center">
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/joy.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ДЖОЙ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Столичная кофейня с исключительно высоким качеством зерен`) : (`Астананың жоғары сапалы дәндерімен танымал кофеханасы`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/pate.png" className="mx-auto w-[70px] h-[70px] object-cover" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ПАТЕ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Концептуальное заведение с фирменными авторскими пирогами и кофе`) : (`Авторлық пирогтар мен кофемен танымал концептуалды орын`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/aroma.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">АРОМА КОФЕ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Быстроразвивающаяся сеть кофеен Астаны`) : (`Астанада тез дамып келе жатқан кофехана желісі`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/global-coffee.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ГЛОБАЛ КОФЕ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупная сеть кофеен`) : (`Үлкен кофехана желісі`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`21 филиал в Астане`) : (`Астанадағы 21 филиал`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/delish.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ДЕЛИШ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Современная сеть кофеен`) : (`Заманауи кофехана желісі`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`5 филиалов в Астане`) : (`Астанадағы 5 филиал`)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {profession.name_ru === 'Продавец-кассир' && (
                            <>
                                <div className="mt-5">
                                    <div className='font-bold text-white py-2 px-5 bg-orange-500 rounded-lg uppercase text-lg inline-block'>{i18n.language == 'ru' ? (`Оборудование`):(`ЖАБДЫҚТАР`)}</div>
                                    <div className='flex gap-10 mt-10'>
                                        <div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Стационарный ручной сканер Symcode MJ-3300`
                                                ) : (
                                                    `Symcode MJ-3300 стационарлық қол сканері`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Кассовый аппарат OSO 508A 4/64 android, GS A4-PRO`
                                                ) : (
                                                    `OSO 508A 4/64 android, GS A4-PRO кассалық аппаратпен`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Электронные весы Rongta RLS1000`
                                                ) : (
                                                    `Rongta RLS1000 электронды таразы`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Термопринтер чеков Xprinter T80Q USB`
                                                ) : (
                                                    `Xprinter T80Q USB термопринтер чектер`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Термопринтер штрих-кодов xp-365b`
                                                ) : (
                                                    `xp-365b штрих-код термопринтері` 
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex gap-5 ml-auto'>
                                            <img src="/eq/kassir-eq1.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/kassir-eq2.png" className='w-[300px] object-cover rounded-lg'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                    <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИМ ВЫПУСКНИКАМ ДОВЕРЯЮТ:`) : (`БІЗДІҢ ТҮЛЕКТЕРГЕ СЕНІМ АРТАДЫ:`)}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 pt-10 items-center">
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/magnum.svg" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">МАГНУМ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупнейшая торгово-розничная сеть Казахстана:`) : (`Қазақстандағы ең ірі сауда желісі:`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`80 филиалов по Астане`) : (`Астанадағы 80 филиал`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/small.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">СМОЛЛ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупнейший работодатель в сфере ритейла`) : (`Ритейл саласындағы ең ірі жұмыс беруші`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`25 лет на рынке`) : (`25 жыл нарықта`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/fix-price.svg" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ФИКС ПРАЙС</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Стремительно растущая сеть магазинов фиксированных цен:`) : (`Тұрақты бағадағы дүкендер желісі қарқынды өсуде:`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`42 филиалов по Астане`) : (`Астанадағы 42 филиал`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/sportmaster.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">Спортмастер</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Крупнейшая торговая сеть по продаже спортивного инвентаря:`) : (`Спорттық жабдықтар сататын ірі сауда желісі:`)}</div>
                                            <div className="text-sm font-bold text-orange-500 text-center mt-4">{i18n.language == 'ru' ? (`7 филиалов по Астане`) : (`Астанадағы 7 филиал`)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {profession.name_ru === 'Основы изготовления корпусной мебели' && (
                            <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИМ ВЫПУСКНИКАМ ДОВЕРЯЮТ:`) : (`БІЗДІҢ ТҮЛЕКТЕРГЕ СЕНІМ АРТАДЫ:`)}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 pt-10 items-center">
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/gildiya.png" className="mx-auto" />
                                        </div>
                                        <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`ГИЛЬДИЯ МЕБЕЛЬЩИКОВ РК`) : (`ҚАЗАҚСТАННЫҢ ЖИҺАЗШЫЛАР ГИЛЬДИЯСЫ`)}</div>
                                        <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Объединение более 30 крупных мебельных производств по Казахстану!`) : (`Қазақстан бойынша 30-дан астам ірі жиһаз өндірушілердің бірлестігі!`)}</div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/distibution.png" className="mx-auto" />
                                        </div>
                                        <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`ЭМ-ДИ-ЭЙ ДИСТРИБЬЮШН`) : (`ЭМ-ДИ-ЭЙ ДИСТРИБЬЮШН`)}</div>
                                        <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Лидирующий цех по производству мебели для учебных и дошкольных учреждений`) : (`Оқу және мектепке дейінгі мекемелерге арналған жиһаз өндірісі бойынша жетекші цех`)}</div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/ayris.png" className="mx-auto" />
                                        </div>
                                        <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`АЙРИС`) : (`АЙРИС`)}</div>
                                        <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Более 10 лет на рынке корпусной мебели`) : (`Корпустық жиһаз нарығында 10 жылдан астам уақыттан бері`)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {profession.name_ru === 'Ремонт обуви и изготовление ключей' && (
                            <>
                                <div className="mt-5">
                                    <div className='font-bold text-white py-2 px-5 bg-orange-500 rounded-lg uppercase text-lg inline-block'>{i18n.language == 'ru' ? (`Оборудование`):(`ЖАБДЫҚТАР`)}</div>
                                    <div className='flex gap-10 mt-10'>
                                        <div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Рукавная швейная машинка Версаль`
                                                ) : (
                                                    `Версаль жең тігін машинасы`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Станок для ремонта обуви SL-128`
                                                ) : (
                                                    `Аяқ киім жөндеу машинасы SL-128`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Металлическая растяжка`
                                                ) : (
                                                    `Металл растяжкасы`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Станок Key cutting machine  MODERN JZ-988HV`
                                                ) : (
                                                    `Кілтті кесетін станок MODERN JZ-988HV`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Универсальный копировально-фрезерный станок Key cutting machine`
                                                ) : (
                                                    ` Key cutting machine әмбебап көшірме-фрезер станогы` 
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Домофонный аппарат TMD 5S`
                                                ) : (
                                                    `Домофон аппараты TMD 5S` 
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex grid-cols-2 grid gap-5 ml-auto'>
                                            <img src="/eq/shoes-eq4.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/shoes-eq2.jpg" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/shoes-eq3.jpg" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/shoes-eq1.jpg" className='w-[300px] object-cover rounded-lg'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                    <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИМ ВЫПУСКНИКАМ ДОВЕРЯЮТ:`) : (`БІЗДІҢ ТҮЛЕКТЕРГЕ СЕНІМ АРТАДЫ:`)}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 pt-10 items-center">
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/cobbler.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">КОББЛЕР</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Обувная мастерская премиум-класса`) : (`Премиум сыныптағы аяқ киім шеберханасы`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/luxerdry.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ЛЮКС ДРАЙ</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Химчистка и реставрация обуви`) : (`Аяқ киімді химиялық тазалау және қалпына келтіру`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/zolotaya-ruka.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">ЗОЛОТАЯ РУКА</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Сеть обувных мастерских столицы`) : (`Астанадағы аяқ киім шеберханаларының желісі`)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {profession.name_ru === 'Электрогазосварщик 3-го разряда' && (
                            <>
                                <div className="mt-5">
                                    <div className='font-bold text-white py-2 px-5 bg-orange-500 rounded-lg uppercase text-lg inline-block'>{i18n.language == 'ru' ? (`Оборудование`):(`ЖАБДЫҚТАР`)}</div>
                                    <div className='flex gap-10 mt-10'>
                                        <div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Сварочный полуавтомат Magmaweld ID 400 M-5 Pulse Smart`
                                                ) : (
                                                    `Дәнекерлеу жартылай автоматы Magmaweld ID 400 M-5 Pulse Smart`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Углошлифовальная машина`
                                                ) : (
                                                    `Бұрыштық тегістеуіш`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Экипировка на каждого студента для практических занятий (костюм сварщика, краги, сварочная маска)`
                                                ) : (
                                                    `Әрбір студентке практикалық сабаққа арналған құрал-жабдықтар (дәнекерлеуші ​​костюмі, леггинстер, дәнекерлеу маскасы)`
                                                )}
                                            </div>
                                            <div key={index} className='mt-4 flex gap-2 max-w-[600px] items-center'>
                                                <FaStar className='fixed-star' />
                                                {i18n.language === 'ru' ? (
                                                    `Накладки защитные для обуви для обуви, очки защитные, перчатки слесарные.`
                                                ) : (
                                                    `Аяқ киімге арналған қорғаныс жастықшалары, қорғаныш көзілдіріктері, слесарь қолғаптары.`
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex grid-cols-2 grid gap-5 ml-auto'>
                                            <img src="/eq/svarshik-eq1.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/svarshik-eq2.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/svarshik-eq3.png" className='w-[300px] object-cover rounded-lg'/>
                                            <img src="/eq/svarshik-eq4.png" className='w-[300px] object-cover rounded-lg'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                    <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИМ ВЫПУСКНИКАМ ДОВЕРЯЮТ:`) : (`БІЗДІҢ ТҮЛЕКТЕРГЕ СЕНІМ АРТАДЫ:`)}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 pt-10 items-center">
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/mera.kz.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`Астана таразы зауыты`) : (`Астана таразы зауыты`)}</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Завод по производству, поверке, модернизации и продаже весо-измерительного оборудования`) : (`Өлшеу жабдықтарын өндіру, тексеру, жаңарту және сату зауыты`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/intertech.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`ИНТЕРТЕХ`) : (`ИНТЕРТЕХ`)}</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Лидер в поставке высоко-технологичного оборудования для производственных работ и ремонта`) : (`Өндірістік жұмыс және жөндеуге арналған жоғары технологиялық жабдықтарды жеткізудегі көшбасшы`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/modex.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`МОДЕКС`) : (`МОДЕКС`)}</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Инновационный завод по производству железобетонных конструкций`) : (`Темірбетон конструкцияларын өндіретін инновациялық зауыт`)}</div>
                                        </div>
                                        <div>
                                            <div className="flex">
                                                <img src="/companies/glb.png" className="mx-auto" />
                                            </div>
                                            <div className="uppercase text-center font-semibold mt-4">{i18n.language == 'ru' ? (`GLB`) : (`GLB`)}</div>
                                            <div className="text-sm text-center mt-4">{i18n.language == 'ru' ? (`Единый проектировочно-производственный комплекс по крупнопанельному домостроению`) : (`Ірі панельді тұрғын үй құрылысына арналған бірыңғай жобалау-өндірістік кешен`)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {profession.name_ru === 'Основы бухгалтерского учета' && (
                            <div className="w-full bg-gray-100 px-5 md:px-10 py-7 mt-10 rounded-lg">
                                <div className="text-center font-bold text-xl">{i18n.language == 'ru' ? (`НАШИ ВЫПУСКНИКИ УСПЕШНО ИСПОЛЬЗУЮТ СВОИ НАВЫКИ В СЛЕДУЮЩИХ СФЕРАХ:`) : (`БІЗДІҢ ТҮЛЕКТЕР ӨЗ ҚАБІЛЕТТЕРІН ТӨМЕНДЕГІ САЛАЛАРДА СӘТТІ ҚОЛДАНАДЫ:`)}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 pt-10 items-center">
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/icon-shopping.png" className="mx-auto w-[100px] h-[100px] object-cover" />
                                        </div>
                                        <div className="text-center mt-4 uppercase">{i18n.language == 'ru' ? (`Торговля`) : (`Сауда`)}</div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/icon-tourism.png" className="mx-auto w-[100px] h-[100px] object-cover" />
                                        </div>
                                        <div className="text-center mt-4 uppercase">{i18n.language == 'ru' ? (`Туризм`) : (`Туризм`)}</div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/icon-transport.png" className="mx-auto w-[100px] h-[100px] object-cover" />
                                        </div>
                                        <div className="text-center mt-4 uppercase">{i18n.language == 'ru' ? (`Транспорт`) : (`Көлік`)}</div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/icon-service.png" className="mx-auto w-[100px] h-[100px] object-cover" />
                                        </div>
                                        <div className="text-center mt-4 uppercase">{i18n.language == 'ru' ? (`Сервис`) : (`Сервис`)}</div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="/companies/icon-production.png" className="mx-auto w-[100px] h-[100px] object-cover" />
                                        </div>
                                        <div className="text-center mt-4 uppercase">{i18n.language == 'ru' ? (`Производство`) : (`Өндіріс`)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </GuestLayout>
        </>
    )
}

