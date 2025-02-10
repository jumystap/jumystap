import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from "react-i18next";
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { MdAccessTime } from "react-icons/md";
import Pagination from "@/Components/Pagination";
import FeedbackModal from "@/Components/FeedbackModal";
import Carousel from "@/Components/Carousel";
import InfoModal from "@/Components/InfoModal";

export default function Welcome({
  specializations,
  auth,
  employees,
  freelancers,
  visits,
  announcements,
  top_announcements,
  urgent_announcements,
  work_professions,
  digital_professions,
}) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  console.log(announcements);

  const kz = {
    ...ru,
    formatDistance: (token, count, options) => {
      const formatDistanceLocale = {
        lessThanXSeconds: {
          one: "1 секунд",
          other: "Секунд",
        },
        xSeconds: {
          one: "1 секунд",
          other: "{{count}} секунд",
        },
        halfAMinute: "жарты минут",
        lessThanXMinutes: {
          one: "Бірнеше минут",
          other: "Минут",
        },
        xMinutes: {
          one: "1 минут",
          other: "{{count}} минут",
        },
        aboutXHours: {
          one: "Шамамен 1 сағат",
          other: "Шамамен {{count}} сағат",
        },
        xHours: {
          one: "1 сағат",
          other: "{{count}} сағат",
        },
        xDays: {
          one: "1 күн",
          other: "{{count}} күн",
        },
        aboutXWeeks: {
          one: "Шамамен 1 апта",
          other: "Шамамен {{count}} апта",
        },
        xWeeks: {
          one: "1 апта",
          other: "{{count}} апта",
        },
        aboutXMonths: {
          one: "Шамамен 1 ай",
          other: "Шамамен {{count}} ай",
        },
        xMonths: {
          one: "1 ай",
          other: "{{count}} ай",
        },
        aboutXYears: {
          one: "Шамамен 1 жыл",
          other: "Шамамен {{count}} жыл",
        },
        xYears: {
          one: "Бір жыл",
          other: "{{count}} жыл",
        },
        overXYears: {
          one: "Бір жылдан астам",
          other: "{{count}} жылдан астам",
        },
        almostXYears: {
          one: "Бір жылға жуық",
          other: "{{count}} жылға жуық",
        },
      };

      const result = formatDistanceLocale[token];

      if (typeof result === "string") {
        return result;
      }

      const form =
        count === 1 ? result.one : result.other.replace("{{count}}", count);

      if (options?.addSuffix) {
        if (options?.comparison > 0) {
          return form + " кейін";
        } else {
          return form + " бұрын";
        }
      }

      return form;
    },
  };

  console.log(announcements);
  const handleFeedbackSubmit = (feedback) => {
    axios
      .post("/send-feedback", { feedback })
      .then((response) => {
        console.log(t("feedback_sent", { ns: "header" }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <FeedbackModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        specializations={specializations}
      />
      <GuestLayout>
        <Head title="Работа и вакансии в Казахстане | Биржа труда - Жумыстап">
          <meta
            name="description"
            content="Жумыстап – биржа труда в Казахстане. Удобный поиск работы и вакансий, размещение резюме. Тысячи актуальных предложений для соискателей и работодателей"
          />
        </Head>
        <div className="grid md:grid-cols-7 grid-cols-1 z-20">
          <div className="col-span-5">
            <div className="flex border-b md:sticky md:top-0 z-20 bg-white bg-opacity-50 backdrop-blur-md border-gray-200">
              <div className="cursor-pointer hover:bg-gray-100 transition-all duration-150 font-semibold p-4 border-b-2 text-sm border-blue-500">
                Вакансии для вас
              </div>
            </div>
            <Carousel>
              <div className="block flex bg-gradient-to-r z-10 md:mx-5 mx-3 p-5 from-orange-500 via-orange-700 to-orange-800 mt-2 rounded-lg md:px-10 md:py-7 text-white">
                <div>
                  <div className="font-bold text-lg md:text-xl">
                    {i18n.language == "ru"
                      ? `Пройди бесплатное обучение`
                      : `Пройди бесплатное обучение `}
                  </div>
                  <div className="font-light md:mt-3">
                    {i18n.language == "ru"
                      ? "по рабочим профессиям"
                      : "по рабочим профессиям"}
                  </div>
                  <div className="flex gap-x-5 mt-3 items-center">
                    <div
                      onClick={() => setIsOpen(true)}
                      className="px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-orange-500 hover:bg-white transition-all duration-150 hover:text-black"
                    >
                      {i18n.language == "ru"
                        ? "Оставить заявку"
                        : "Оставить заявку"}
                    </div>
                    <a
                      href="https://www.instagram.com/joltap.kz"
                      className="block text-white text-sm font-light md:text-sm"
                    >
                      {i18n.language == "ru" ? "Подробнее" : "Толығырақ"}
                    </a>
                  </div>
                </div>
                <div className="ml-auto pt-2">
                  <img
                    src="/images/joltap.png"
                    className="md:w-[200px] w-[120px]"
                  />
                </div>
              </div>
              <div className="mx-3 md:mx-5 md:px-10 px-4 py-7 z-10 bg-gradient-to-r from-blue-500 to-blue-800  mt-2 rounded-lg">
                <div className="font-semibold text-lg md:text-xl text-white">
                  Подбери вакансии для себя!
                </div>
                <div className="font-light mt-2 text-white">
                  Заполни анкету и найди подходящие вакансии
                </div>
                {auth.user ? (
                  <div
                    className="text-blue-500 px-10 py-2 text-sm mt-4 cursor-pointer bg-white rounded-lg font-bold inline-block"
                    onClick={() => setIsInfoOpen(true)}
                  >
                    Заполнить
                  </div>
                ) : (
                  <Link
                    className="text-blue-500 px-10 py-2 text-sm mt-4 cursor-pointer bg-white rounded-lg font-bold inline-block"
                    href="/login"
                  >
                    Заполнить
                  </Link>
                )}
              </div>
                <div className="block flex bg-gradient-to-r z-10 md:mx-5 mx-3 p-5 from-orange-500 via-orange-700 to-orange-800 mt-2 rounded-lg md:px-10 md:py-7 text-white">
                    <div>
                        <div className="font-bold text-lg md:text-xl">
                            {i18n.language == "ru"
                                ? `Пройди платное обучение`
                                : `Пройди платное обучение `}
                        </div>
                        <div className="font-light md:mt-3">
                            {i18n.language == "ru"
                                ? `по курсу "Основы заработка на Youtube"`
                                : `по курсу "Основы заработка на Youtube"`}
                        </div>
                        <div className="flex gap-x-5 mt-3 items-center">
                            <a href="https://forms.gle/Mb2h6yuWh93YqgEXA" target="_blank"
                                className="px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-orange-500 hover:bg-white transition-all duration-150 hover:text-black"
                            >
                                {i18n.language == "ru"
                                    ? "Оставить заявку"
                                    : "Оставить заявку"}
                            </a>
                        </div>
                    </div>
                </div>
            </Carousel>
            <div className="flex mt-5 md:mx-5 ml-3 md:max-w-[800px] max-w-[95%] pb-2 gap-x-5 overflow-x-auto">
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image1.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      Идет запись
                    </div>
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      Новый
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                    Пункт замены масла и шиномонтаж
                  </div>
                </div>
                <div className="px-3 mb-2 mt-2 text-sm font-light text-gray-500">
                  Освойте навыки по замене масел и автошин с нуля!
                </div>
              </div>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image2.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      Идет запись
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                    Основы изготовления корпусной мебели
                  </div>
                </div>
                <div className="px-3 mt-2 text-sm font-light text-gray-500 mb-2">
                  Практические навыки — для тех, кто хочет начать карьеру в
                  мебельном деле.
                </div>
              </div>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image3.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      Идет запись
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                    Мастерская по ремонту обуви
                  </div>
                </div>
                <div className="px-3 mb-2 mt-2 text-sm font-light text-gray-500">
                  Научитесь ремонту обуви и изготовлению ключей с нуля!
                </div>
              </div>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image4.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      Идет запись
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                    <br />
                    Электрогазосварщик
                  </div>
                </div>
                <div className="px-3 mt-2 text-sm font-light text-gray-500">
                  Идеально для тех, кто хочет начать карьеру в промышленности
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200 mt-5"></div>
            {urgent_announcements.map((anonce, index) => (
              <Link
                href={`/announcement/${anonce.id}`}
                key={index}
                className="block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200 md:hidden block"
              >
                <div className="flex items-center">
                  <div className="flex gap-x-1 text-blue-400 items-center">
                    <div className="text-white bg-red-600 font-bold text-xs py-1 px-2 rounded">
                      СРОЧНО
                    </div>
                  </div>
                  <div className="ml-auto md:text-sm text-[10pt] text-right text-gray-500 flex items-center">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </div>
                <div className="md:mt-7 mt-5 text-lg font-bold">
                  {anonce.title}
                </div>
                <div className="flex md:mt-4 mt-2  gap-x-1 items-center">
                  <SiFireship className="text-red-600 text-lg" />
                  <div className="md:text-xl text-lg font-regular">
                    {anonce.salary_type == "exact" &&
                      anonce.cost &&
                      `${anonce.cost.toLocaleString()} ₸ `}
                    {anonce.salary_type == "min" &&
                      anonce.cost_min &&
                      `от ${anonce.cost_min.toLocaleString()} ₸ `}
                    {anonce.salary_type == "diapason" &&
                      anonce.cost_min &&
                      anonce.cost_max &&
                      `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ `}
                    {anonce.salary_type == "max" &&
                      anonce.cost_max &&
                      `до ${anonce.cost_max.toLocaleString()} ₸ `}
                    {anonce.salary_type == "undefined" && `Договорная`}
                    {anonce.salary_type == "za_smenu" && (
                      <>
                        {anonce.cost &&
                          `${anonce.cost.toLocaleString()} ₸ / за смену`}
                        {anonce.cost_min &&
                          !anonce.cost_max &&
                          `от ${anonce.cost_min.toLocaleString()} ₸ / за смену`}
                        {!anonce.cost_min &&
                          anonce.cost_max &&
                          `до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                        {anonce.cost_min &&
                          anonce.cost_max &&
                          `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                      </>
                    )}
                  </div>
                </div>
                <div className="md:mt-4 mt-2 text-sm text-gray-500 font-light"></div>
                <div className="flex gap-x-1 items-center mt-4">
                  <MdAccessTime className="text-xl" />
                  <div className="text-sm">
                    График работы: {anonce.work_time}
                  </div>
                </div>
              </Link>
            ))}
            {top_announcements.map((anonce, index) => (
              <Link
                href={`/announcement/${anonce.id}`}
                key={index}
                className="block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200 md:hidden"
              >
                <div className="flex">
                  <div className="flex gap-x-1 text-blue-400 items-center">
                    <div className="text-white bg-blue-500 font-bold text-xs py-1 px-3 rounded">
                      ТОП
                    </div>
                  </div>
                  <div className="ml-auto md:text-sm text-[10pt] text-right text-gray-500">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </div>
                <div className="md:mt-7 mt-5 text-lg font-bold">
                  {anonce.title}
                </div>
                <div className="flex md:mt-4 mt-2 gap-x-1 items-center">
                  <FaStar className="text-blue-500 text-lg" />
                  <div className="md:text-xl text-lg font-regular">
                    {anonce.salary_type == "exact" &&
                      anonce.cost &&
                      `${anonce.cost.toLocaleString()} ₸ `}
                    {anonce.salary_type == "min" &&
                      anonce.cost_min &&
                      `от ${anonce.cost_min.toLocaleString()} ₸ `}
                    {anonce.salary_type == "max" &&
                      anonce.cost_max &&
                      `до ${anonce.cost_max.toLocaleString()} ₸ `}
                    {anonce.salary_type == "diapason" &&
                      anonce.cost_min &&
                      anonce.cost_max &&
                      `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ `}
                    {anonce.salary_type == "undefined" && `Договорная`}
                    {anonce.salary_type == "za_smenu" && (
                      <>
                        {anonce.cost &&
                          `${anonce.cost.toLocaleString()} ₸ / за смену`}
                        {anonce.cost_min &&
                          !anonce.cost_max &&
                          `от ${anonce.cost_min.toLocaleString()} ₸ / за смену`}
                        {!anonce.cost_min &&
                          anonce.cost_max &&
                          `до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                        {anonce.cost_min &&
                          anonce.cost_max &&
                          `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-x-1 items-center mt-4">
                  <MdAccessTime className="text-xl" />
                  <div className="text-sm">
                    График работы: {anonce.work_time}
                  </div>
                </div>
              </Link>
            ))}
            {announcements.data.map((anonce, index) => (
              <Link
                href={`/announcement/${anonce.id}`}
                key={index}
                className={`block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex gap-x-1 ${anonce.city == "Астана" ? "text-blue-400" : "text-gray-500"} items-center`}
                  >
                    <FaLocationDot className="text-sm" />
                    <div className="text-[10pt] md:text-sm">{anonce.city}</div>
                  </div>
                  <div className="ml-auto md:text-sm text-[10pt] text-right text-gray-500">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </div>
                <div className="md:mt-7 mt-5 text-lg font-bold">
                  {anonce.title}
                </div>
                <div className="flex md:mt-4 mt-2 gap-x-3 items-center">
                  <div className="md:text-xl text-lg font-regular">
                    {anonce.salary_type == "exact" &&
                      anonce.cost &&
                      `${anonce.cost.toLocaleString()} ₸ `}
                    {anonce.salary_type == "min" &&
                      anonce.cost_min &&
                      `от ${anonce.cost_min.toLocaleString()} ₸ `}
                    {anonce.salary_type == "max" &&
                      anonce.cost_max &&
                      `до ${anonce.cost_max.toLocaleString()} ₸ `}
                    {anonce.salary_type == "diapason" &&
                      anonce.cost_min &&
                      anonce.cost_max &&
                      `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ `}
                    {anonce.salary_type == "undefined" && `Договорная`}
                    {anonce.salary_type == "za_smenu" && (
                      <>
                        {anonce.cost &&
                          `${anonce.cost.toLocaleString()} ₸ / за смену`}
                        {anonce.cost_min &&
                          !anonce.cost_max &&
                          `от ${anonce.cost_min.toLocaleString()} ₸ / за смену`}
                        {!anonce.cost_min &&
                          anonce.cost_max &&
                          `до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                        {anonce.cost_min &&
                          anonce.cost_max &&
                          `от ${anonce.cost_min.toLocaleString()} ₸ до ${anonce.cost_max.toLocaleString()} ₸ / за смену`}
                      </>
                    )}
                  </div>
                </div>
                <div className="md:mt-4 mt-2 text-sm text-gray-500 font-light"></div>
                <div className="flex gap-x-1 items-center mt-4">
                  <MdAccessTime className="text-xl" />
                  <div className="text-sm">
                    График работы: {anonce.work_time}
                  </div>
                </div>
              </Link>
            ))}
            <Pagination links={announcements.links} />
            <div className="pb-10">
              <div className="flex mt-5">
                <div className="mx-auto">
                  <div className="border-orange-500 text-orange-500 border px-10 rounded-lg py-2 font-light">
                    {work_professions.length}{" "}
                    {t("work_skills", { ns: "index" })}
                  </div>
                </div>
              </div>
              <div className="grid px-5 md:grid-cols-2 gap-5 mt-7">
                {work_professions.map((work, index) => (
                  <Link
                    href={`/profession/${work.group.name}#${work.id}`}
                    key={index}
                    className="flex gap-5 w-full py-3 border border-gray-300 px-5 rounded-lg items-center hover:border-[#f36706] transition-all duration-150"
                  >
                    <img
                      src={`/storage/${work.icon_url}`}
                      className="w-[30px] h-[30px]"
                      alt=""
                    />
                    <div>
                      {i18n.language == "ru" ? work.name_ru : work.name_kz}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex mt-5">
                <div className="mx-auto">
                  <div className="border-orange-500 border px-10 text-orange-500 rounded-lg mt-5 py-2 font-light">
                    {digital_professions.length}{" "}
                    {t("digital_skills", { ns: "index" })}
                  </div>
                </div>
              </div>
              <div className="grid px-5 md:grid-cols-2 gap-5 mt-7">
                {digital_professions.map((digital, index) => (
                  <Link
                    href={`/profession/${digital.group.name}#${digital.id}`}
                    key={index}
                    className="flex gap-5 w-full py-3 border border-gray-300 px-5 rounded-lg items-center hover:border-[#f36706] transition-all duration-150"
                  >
                    <img
                      src={`/storage/${digital.icon_url}`}
                      className="w-[30px] h-[30px]"
                      alt=""
                    />
                    <div>
                      {i18n.language == "ru"
                        ? digital.name_ru
                        : digital.name_kz}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2 border-l md:block hidden border-gray-200 h-screen sticky top-0">
            <div>
              <div className="font-bold p-3 text-sm border-b border-gray-200">
                Вам могут понравиться
              </div>
              {urgent_announcements.map((urgent, key) => (
                <Link
                  href={`/announcement/${urgent.id}`}
                  key={key}
                  className="block hover:bg-gray-100 transition-all duration-150 border-b border-gray-200 p-3"
                >
                  <div className="flex items-center">
                    <div className="uppercase text-white text-xs px-2 bg-red-600 font-bold rounded">
                      {t("urgent", { ns: "index" })}
                    </div>
                    <div className="flex items-center font-bold gap-x-2 text-sm ml-auto">
                      <SiFireship className="text-red-600 text-lg" />
                      {urgent.salary_type == "exact" &&
                        urgent.cost &&
                        `${urgent.cost.toLocaleString()} ₸ `}
                      {urgent.salary_type == "min" &&
                        urgent.cost_min &&
                        `от ${urgent.cost_min.toLocaleString()} ₸ `}
                      {urgent.salary_type == "max" &&
                        `до ${urgent.cost_max.toLocaleString()} ₸ `}
                      {urgent.salary_type == "diapason" &&
                        `от ${urgent.cost_min.toLocaleString()} ₸`}
                      {urgent.salary_type == "undefined" && `Договорная`}
                    </div>
                  </div>
                  <div className="mt-3 text-[11pt] max-w-[400px]">
                    {urgent.title}
                  </div>
                  <div className="flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm">
                    <FaLocationDot className="text-red-600" />
                    {urgent.city}
                  </div>
                  <div className="text-sm font-light text-gray-500">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(urgent.created_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </Link>
              ))}
              {top_announcements.map((top, key) => (
                <Link
                  href={`/announcement/${top.id}`}
                  key={key}
                  className="block hover:bg-gray-100 transition-all duration-150 border-b border-gray-200 p-3"
                >
                  <div className="flex items-center">
                    <div className="uppercase text-white text-xs px-2 bg-blue-500 font-bold rounded">
                      {t("top", { ns: "index" })}
                    </div>
                    <div className="flex gap-x-2 items-center font-bold text-sm ml-auto">
                      <FaStar className="text-blue-500 text-lg" />
                      {top.salary_type == "exact" &&
                        top.cost &&
                        `${top.cost.toLocaleString()} ₸ `}
                      {top.salary_type == "min" &&
                        `от ${top.cost_min.toLocaleString()} ₸ `}
                      {top.salary_type == "max" &&
                        `до ${top.cost_max.toLocaleString()} ₸ `}
                      {top.salary_type == "diapason" &&
                        `от ${top.cost_min.toLocaleString()} ₸`}
                      {top.salary_type == "undefined" && `Договорная`}
                    </div>
                  </div>
                  <div className="mt-3 text-[11pt] max-w-[400px]">
                    {top.title}
                  </div>
                  <div className="flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm">
                    <FaLocationDot className="text-blue-500" />
                    {top.city}
                  </div>
                  <div className="text-sm font-light text-gray-500">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(top.created_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
}
