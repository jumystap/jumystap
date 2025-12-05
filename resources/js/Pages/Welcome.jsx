import React, {useEffect, useState} from "react";
import {Link, Head, usePage, useForm} from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from "react-i18next";
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import {MdAccessTime, MdIosShare} from "react-icons/md";
import Pagination from "@/Components/Pagination";
import FeedbackModal from "@/Components/FeedbackModal";
import ScamModal from "@/Components/ScamModal";
import Carousel from "@/Components/Carousel";
import InfoModal from "@/Components/InfoModal";
import {IoSearch} from "react-icons/io5";
import {CgArrowsExchangeAltV} from "react-icons/cg";
import {CiLocationOn} from "react-icons/ci";

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
  const [isScamOpen, setIsScamOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { searchKeyword: querySearchKeyword } = usePage().props;

    const { data, setData, get } = useForm({
        searchKeyword: querySearchKeyword || '',
    });
    const handleSearchKeywordChange = (event) => {
        setData('searchKeyword', event.target.value);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchKeyword = params.get('searchKeyword');

        if (searchKeyword) {
            setData('searchKeyword', searchKeyword);
        }
    }, []);

    const handleSearch = () => {
        get('/', {preserveScroll: true, preserveState: true });
    };

    const handleSearchAnnouncements = () => {
        get('/announcements', {preserveScroll: true, preserveState: true });
    };

    const handleButtonClick = (e, link, parameter_id) => {
        e.preventDefault();

        // Open the popup immediately (Safari-safe)
        const newWin = window.open('', '_blank');

        axios
            .post("/analytics/click", { parameter_id: parameter_id })
            .then((response) => {
                // Set URL after async call
                if (newWin) newWin.location.href = link;
            })
            .catch((error) => {
                console.error(error);
                // Optional: close the new window if error
                if (newWin) newWin.close();
            });
    };


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
     <ScamModal
        isOpen={isScamOpen}
        onClose={() => setIsScamOpen(false)}
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
                  {t("vacancy_for_you", { ns: "index" })}
              </div>
            </div>
            <Carousel>
                <div className="z-10 md:mx-5 mx-3 p-5 bg-gradient-to-r from-blue-950 to-blue-950 mt-2 rounded-lg md:px-10 md:py-7 text-white">
                    <div className="flex">
                        <div>
                            <p className="font-bold text-lg md:text-xl">
                                {t("beware_of_scammers", { ns: "index" })}
                            </p>
                            <p className="text-lg md:mt-1">
                                {t("scam_report", { ns: "index" })}
                            </p>
                        </div>

                        <div className="hidden md:block ml-auto pt-2">
                            <img src="/images/scam.png" className="md:w-[200px] w-[120px]" alt="scam" />
                        </div>
                    </div>

                    <div className="flex gap-x-5 mt-3 items-center">
                        <a
                            href="https://api.whatsapp.com/send?phone=+77072213131&amp;text=Здравствуйте"
                            target="_blank"
                            className="text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-150 hover:text-white"
                        >
                            {t("write_whatsapp", { ns: "index" })}
                        </a>

                        <button
                            onClick={() => setIsScamOpen(true)}
                            className="text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-150"
                        >
                            {t("write_site", { ns: "index" })}
                        </button>
                    </div>
                </div>
                {/*<div className="z-10 md:mx-5 mx-3 p-5 bg-gradient-to-r from-violet-950 to-violet-950 mt-2 rounded-lg md:px-10 md:py-7 text-white">*/}
                {/*    <div className="flex">*/}
                {/*        <div>*/}
                {/*            <p className="font-bold text-lg md:text-xl text-orange-500">*/}
                {/*                {t("new_paid_courses_from_skillstap", { ns: "index" })}*/}
                {/*            </p>*/}
                {/*            <p className="text-sm md:mt-1">*/}
                {/*                1. {t("basics_of_earning_money_on_youtube", { ns: "index" })}<br/>*/}
                {/*                2. {t("how_to_open_a_coffee_shop", { ns: "index" })}<br/>*/}
                {/*                3. {t("mobilograph_pro", { ns: "index" })}<br/>*/}
                {/*            </p>*/}
                {/*        </div>*/}

                {/*        <div className="hidden md:block ml-auto">*/}
                {/*            <img src="/images/resource.png" className="md:w-[100px] w-[120px]" alt="scam" />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="flex gap-x-5 mt-3 items-center">*/}
                {/*        <button onClick={(e) => handleButtonClick(e, 'https://forms.amocrm.ru/rwcxdlc', 1)}*/}
                {/*                className="text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-orange-500 text-white hover:bg-white transition-all duration-150 hover:text-orange-500"*/}
                {/*        >*/}
                {/*            {t("submit_an_application", { ns: "index" })}*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="z-10 md:mx-5 mx-3 p-5 bg-gradient-to-r from-violet-200 to-violet-100 mt-2 rounded-lg md:px-10 md:py-7 text-white">*/}
                {/*    <div className="flex">*/}
                {/*        <div>*/}
                {/*            <p className="font-bold text-2xl text-violet-900">*/}
                {/*                {t("do_you_want_to_earn_from_400", { ns: "index" })}*/}
                {/*            </p>*/}
                {/*            <p className="md:text-lg text-black">*/}
                {/*                {t("master_the_profession_of_a_sales_manager", { ns: "index" })}<br/>*/}
                {/*            </p>*/}
                {/*            <button onClick={(e) => handleButtonClick(e, 'https://forms.amocrm.ru/rwcxdlc', 1)}*/}
                {/*                    className="mt-3 text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-violet-900 text-white hover:bg-white transition-all duration-150 hover:text-violet-900"*/}
                {/*            >*/}
                {/*                {t("more_button", { ns: "index" })}*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*        <div className="hidden md:block ml-auto">*/}
                {/*            <img src="/images/sales.png" className="md:w-[300px] w-[295px]" alt="scam" />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="z-10 md:mx-5 mx-3 p-5 bg-gradient-to-r from-orange-500 to-orange-500 mt-2 rounded-lg md:px-10 md:py-7 text-white">
                    <div className="flex">
                        <div>
                            <p className="mt-3 font-bold text-3xl text-white-500">
                                JOLTAP <div className="mb-3 bg-orange-400 text-white text-base font-bold py-1 px-4 border border-orange-300 rounded-full inline">
                                26.09 - 30.12
                            </div>
                                <br/>
                                жайлы бөліс
                            </p>
                            <p className="mt-3 text-lg md:mt-1 text-white">
                                Расскажи о JOLTAP
                            </p>
                            <a
                                href={`https://www.instagram.com/p/DPDtJM_iO9p/`}
                                target="_blank"
                                className="mt-3 text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-orange-500 hover:bg-orange-400 hover:text-white transition-all duration-150"
                            >
                                {t("more_button", { ns: "index" })}
                            </a>
                        </div>

                        <div className="hidden md:block ml-auto">
                            <img src="/images/share_joltap.png" className="md:w-[250px] w-[300px]" alt="malyar" />
                        </div>
                    </div>
                </div>
            </Carousel>
            <div className="flex mt-5 md:mx-5 ml-3 md:max-w-[800px] max-w-[95%] pb-2 gap-x-5 overflow-x-auto">
                <a
                    href={`https://t.me/jumystapjobs`}
                    target={`_blank`}
                    className="border border-gray-200 rounded-lg"
                >
                    <div className="w-[300px] px-3 bg-[url('/images/telegram.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                        <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                            <br />
                                {t("telegram_subscribe", { ns: "index" })}<br />&nbsp;
                        </div>
                    </div>
                    <div className="px-3 mt-2 text-sm font-light text-gray-500">
                        {t("telegram_vacancy", { ns: "index" })}<br />&nbsp;
                    </div>
                </a>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/3_in_1.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                    <br />
                      {t("oil_change", { ns: "index" })}<br />
                      {t("furniture_assembly", { ns: "index" })}<br />
                      {t("polymer_painter", { ns: "index" })}
                  </div>
                </div>
                <div className="px-3 mt-2 text-sm font-light text-gray-500">
                    {t("free_course", { ns: "index" })}<br />&nbsp;
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200 mt-5"></div>
              <div className='md:hidden mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
                  <input
                      type="text"
                      value={data.searchKeyword}
                      onChange={handleSearchKeywordChange}
                      placeholder={t('search', { ns: 'announcements' })}
                      className='block border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                  />
                  <button
                      className='md:block hidden text-white rounded-lg bg-blue-500 py-2 px-5'
                      onClick={handleSearchAnnouncements}
                  >
                      {t('search', { ns: 'announcements' })}
                  </button>
                  <button
                      className='md:hidden block text-white text-2xl rounded-lg bg-blue-500 py-2 px-4'
                      onClick={handleSearchAnnouncements}
                  >
                      <IoSearch />
                  </button>
              </div>
            {urgent_announcements.map((anonce, index) => (
              <Link
                href={`/announcement/${anonce.id}`}
                key={index}
                className="block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200 md:hidden block"
              >
                <div className="flex items-center">
                  <div className="flex gap-x-1 text-blue-400 items-center">
                    <div className="text-white bg-red-600 font-bold text-xs py-1 px-2 rounded">
                        {t("urgent", { ns: "index" })}
                    </div>
                  </div>
                  <div className="ml-auto md:text-sm text-[10pt] text-right text-gray-500 flex items-center">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(anonce.published_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </div>
                <div className="md:mt-7 mt-5 text-lg font-bold">
                  {anonce.title}
                </div>
                <div className="flex md:mt-4 mt-2  gap-x-1 items-center">
                  <SiFireship className="text-red-600 text-lg" />
                  <div className="md:text-xl text-lg font-regular">
                      {anonce.salary_type === "exact" &&
                          anonce.cost &&
                          `${anonce.cost.toLocaleString()} ₸ `}
                      {anonce?.salary_type === "min" && anonce.cost_min &&
                          `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸" : anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                      }
                      {anonce.salary_type === "max" && anonce.cost_max &&
                          `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸" : anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                      }
                      {anonce.salary_type === "diapason" &&
                          anonce.cost_min &&
                          anonce.cost_max &&
                          `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸" :
                              anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                      }
                      {anonce.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                      {anonce.salary_type === "za_smenu" && (
                          <>
                              {anonce.cost &&
                                  `${anonce.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                              }
                              {anonce.cost_min &&
                                  !anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                      t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                              }
                              {!anonce.cost_min &&
                                  anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                      t("per_shift", { ns: "index" }) + " " + anonce.cost_max.toLocaleString() + " ₸ / дейін"}`
                              }
                              {anonce.cost_min &&
                                  anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                      t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                              }
                          </>
                      )}
                  </div>
                </div>
                <div className="md:mt-4 mt-2 text-sm text-gray-500 font-light"></div>
                <div className="flex gap-x-1 items-center mt-4">
                  <MdAccessTime className="text-xl" />
                  <div className="text-sm">
                    {t("working_hours", { ns: "index" })}: {anonce.work_time}
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
                        {t("top", { ns: "index" })}
                    </div>
                  </div>
                  <div className="ml-auto md:text-sm text-[10pt] text-right text-gray-500">
                    {i18n.language == "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(anonce.published_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language == "kz" && ""}
                  </div>
                </div>
                <div className="md:mt-7 mt-5 text-lg font-bold">
                  {anonce.title}
                </div>
                <div className="flex md:mt-4 mt-2 gap-x-1 items-center">
                  <FaStar className="text-blue-500 text-lg" />
                  <div className="md:text-xl text-lg font-regular">
                      {anonce.salary_type === "exact" &&
                          anonce.cost &&
                          `${anonce.cost.toLocaleString()} ₸ `}
                      {anonce?.salary_type === "min" && anonce.cost_min &&
                          `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸" : anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                      }
                      {anonce.salary_type === "max" && anonce.cost_max &&
                          `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸" : anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                      }
                      {anonce.salary_type === "diapason" &&
                          anonce.cost_min &&
                          anonce.cost_max &&
                          `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸" :
                              anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                      }
                      {anonce.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                      {anonce.salary_type === "za_smenu" && (
                          <>
                              {anonce.cost &&
                                  `${anonce.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                              }
                              {anonce.cost_min &&
                                  !anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                      t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                              }
                              {!anonce.cost_min &&
                                  anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                      t("per_shift", { ns: "index" }) + " " + anonce.cost_max.toLocaleString() + " ₸ / дейін"}`
                              }
                              {anonce.cost_min &&
                                  anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                      t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                              }
                          </>
                      )}
                  </div>
                </div>
                <div className="flex gap-x-1 items-center mt-4">
                  <MdAccessTime className="text-xl" />
                  <div className="text-sm">
                    {t("working_hours", { ns: "index" })}: {anonce.work_time}
                  </div>
                </div>
              </Link>
            ))}
              <div className="hidden md:block">
                  <div className='mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
                      <input

                          type="text"
                          value={data.searchKeyword}
                          onChange={handleSearchKeywordChange}
                          placeholder={t('search', { ns: 'announcements' })}
                          className='block border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                      />
                      <button
                          className='text-white rounded-lg bg-blue-500 py-2 px-5'
                          onClick={handleSearchAnnouncements}
                      >
                          {t('search', { ns: 'announcements' })}
                      </button>
                  </div>
                {announcements.data.map((anonce, index) => (
                  <Link href={`/announcement/${anonce.id}`} key={index} className={`block px-5 py-5 border rounded-lg hover:border-blue-500 transition-all duration-150 border-gray-200 md:mx-5 mx-3 mt-3`}>
                      <div className='flex items-center'>
                          <div className={`flex gap-x-1 ${anonce.city == 'Астана' ? ('text-blue-400'):('text-gray-400')} items-center`}>
                              <CiLocationOn />
                              <div className='text-[10pt] md:text-sm'>{anonce.city}</div>
                          </div>
                          <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>
                              {i18n.language == 'ru' ? ('Изменено') : ('')} {`${formatDistanceToNow(new Date(anonce.updated_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('өзгертілді')}
                          </div>
                      </div>
                      <div className='mt-5 text-lg font-bold'>
                          {anonce.title}
                      </div>

                      <div className='flex md:mt-2 mt-2 gap-x-3 items-center'>
                          <div className='md:text-xl text-xl font-regular'>
                              {anonce.salary_type === "exact" &&
                                  anonce.cost &&
                                  `${anonce.cost.toLocaleString()} ₸ `}
                              {anonce?.salary_type === "min" && anonce.cost_min &&
                                  `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸" : anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                              }
                              {anonce.salary_type === "max" && anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸" : anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                              }
                              {anonce.salary_type === "diapason" &&
                                  anonce.cost_min &&
                                  anonce.cost_max &&
                                  `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸" :
                                      anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                              }
                              {anonce.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                              {anonce.salary_type === "za_smenu" && (
                                  <>
                                      {anonce.cost &&
                                          `${anonce.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                      }
                                      {anonce.cost_min &&
                                          !anonce.cost_max &&
                                          `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                              t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                                      }
                                      {!anonce.cost_min &&
                                          anonce.cost_max &&
                                          `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                              t("per_shift", { ns: "index" }) + " " + anonce.cost_max.toLocaleString() + " ₸ / дейін"}`
                                      }
                                      {anonce.cost_min &&
                                          anonce.cost_max &&
                                          `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                              t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                      }
                                  </>
                              )}
                          </div>
                      </div>
                      <div className='flex gap-x-2 mt-2'>
                          <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                              {anonce.experience}
                          </div>
                          <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                              {anonce.work_time}
                          </div>
                      </div>
                      <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                          {auth.user ? (
                              <>
                                  <a
                                      href={`/connect/${auth.user.id}/${anonce.id}`}
                                      onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                      className='text-blue-500 text-center rounded-lg text-sm items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                      <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                                  </a>
                                  {auth.user.email === 'admin@example.com' && (
                                      <a
                                          href={`/announcements/update/${anonce.id}`}
                                          onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                          className='text-blue-500 text-center rounded-lg items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                          <span className='font-bold'>{t('edit', { ns: 'announcements' })}</span>
                                      </a>
                                  )}
                              </>
                          ) : (
                              <Link
                                  href='/login'
                                  onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                  className='text-blue-500 text-center rounded-lg items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                  <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                              </Link>
                          )}
                          <div
                              onClick={(e) => {
                                  e.stopPropagation(); // Prevents click propagation to Link
                                  handleShare(anonce.id);
                              }}
                              className={`border-2 border-blue-500 rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                              <MdIosShare className='text-blue-500 text-xl' />
                          </div>
                      </div>
                  </Link>
                ))}
                <Pagination links={announcements.links} searchKeyword={data.searchKeyword} />
              </div>
            {/*<div className="pb-10">*/}
            {/*  <div className="flex mt-5">*/}
            {/*    <div className="mx-auto">*/}
            {/*      <div className="border-orange-500 text-orange-500 border px-10 rounded-lg py-2 font-light">*/}
            {/*        {work_professions.length}{" "}*/}
            {/*        {t("work_skills", { ns: "index" })}*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="grid px-5 md:grid-cols-2 gap-5 mt-7">*/}
            {/*    {work_professions.map((work, index) => (*/}
            {/*      <Link*/}
            {/*        href={`/profession/${work.group.name}#${work.id}`}*/}
            {/*        key={index}*/}
            {/*        className="flex gap-5 w-full py-3 border border-gray-300 px-5 rounded-lg items-center hover:border-[#f36706] transition-all duration-150"*/}
            {/*      >*/}
            {/*        <img*/}
            {/*          src={`/storage/${work.icon_url}`}*/}
            {/*          className="w-[30px] h-[30px]"*/}
            {/*          alt=""*/}
            {/*        />*/}
            {/*        <div>*/}
            {/*          {i18n.language === "ru" ? work.name_ru : work.name_kz}*/}
            {/*        </div>*/}
            {/*      </Link>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*  <div className="flex mt-5">*/}
            {/*    <div className="mx-auto">*/}
            {/*      <div className="border-orange-500 border px-10 text-orange-500 rounded-lg mt-5 py-2 font-light">*/}
            {/*        {digital_professions.length}{" "}*/}
            {/*        {t("digital_skills", { ns: "index" })}*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="grid px-5 md:grid-cols-2 gap-5 mt-7">*/}
            {/*    {digital_professions.map((digital, index) => (*/}
            {/*      <Link*/}
            {/*        href={`/profession/${digital.group.name}#${digital.id}`}*/}
            {/*        key={index}*/}
            {/*        className="flex gap-5 w-full py-3 border border-gray-300 px-5 rounded-lg items-center hover:border-[#f36706] transition-all duration-150"*/}
            {/*      >*/}
            {/*        <img*/}
            {/*          src={`/storage/${digital.icon_url}`}*/}
            {/*          className="w-[30px] h-[30px]"*/}
            {/*          alt=""*/}
            {/*        />*/}
            {/*        <div>*/}
            {/*          {i18n.language == "ru"*/}
            {/*            ? digital.name_ru*/}
            {/*            : digital.name_kz}*/}
            {/*        </div>*/}
            {/*      </Link>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <div className="col-span-2 border-l md:block hidden border-gray-200 h-screen sticky top-0">
            <div>
              <div className="font-bold p-3 text-sm border-b border-gray-200">
                  {t("you_might_like", { ns: "index" })}
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
                        {urgent.salary_type === "exact" &&
                            urgent.cost &&
                            `${urgent.cost.toLocaleString()} ₸ `}
                        {urgent?.salary_type === "min" && urgent.cost_min &&
                            `${i18n?.language === "ru" ? "от " + urgent.cost_min.toLocaleString() + " ₸" : urgent.cost_min.toLocaleString() + " ₸ бастап"}`
                        }
                        {urgent.salary_type === "max" && urgent.cost_max &&
                            `${i18n?.language === "ru" ? "до " + urgent.cost_max.toLocaleString() + " ₸" : urgent.cost_max.toLocaleString() + " ₸ дейін"}`
                        }
                        {urgent.salary_type === "diapason" &&
                            urgent.cost_min &&
                            urgent.cost_max &&
                            `${i18n?.language === "ru" ? "от " + urgent.cost_min.toLocaleString() + " ₸" :
                                urgent.cost_min.toLocaleString() + " ₸ бастап"}`
                        }
                        {urgent.salary_type === "undefined" && t("negotiable", { ns: "index" })}
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
                    {i18n.language === "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(urgent.published_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language === "kz" && ""}
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
                        {top.salary_type === "exact" &&
                            top.cost &&
                            `${top.cost.toLocaleString()} ₸ `}
                        {top?.salary_type === "min" && top.cost_min &&
                            `${i18n?.language === "ru" ? "от " + top.cost_min.toLocaleString() + " ₸" : top.cost_min.toLocaleString() + " ₸ бастап"}`
                        }
                        {top.salary_type === "max" && top.cost_max &&
                            `${i18n?.language === "ru" ? "до " + top.cost_max.toLocaleString() + " ₸" : top.cost_max.toLocaleString() + " ₸ дейін"}`
                        }
                        {top.salary_type === "diapason" &&
                            top.cost_min &&
                            top.cost_max &&
                            `${i18n?.language === "ru" ? "от " + top.cost_min.toLocaleString() + " ₸" :
                                top.cost_min.toLocaleString() + " ₸ бастап"}`
                        }
                        {top.salary_type === "undefined" && t("negotiable", { ns: "index" })}
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
                    {i18n.language === "ru" ? "Размещено" : ""}{" "}
                    {`${formatDistanceToNow(new Date(top.published_at), { locale: i18n.language === "ru" ? ru : kz, addSuffix: true })}`}{" "}
                    {i18n.language === "kz" && ""}
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
