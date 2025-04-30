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
import ScamModal from "@/Components/ScamModal";
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
  const [isScamOpen, setIsScamOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
    const handleButtonClick = (e, link, parameter_id) => {
        e.preventDefault();
        axios
            .post("/analytics/click", { parameter_id: parameter_id })
            .then((response) => {
                window.open(link, '_blank');
            })
            .catch((error) => {
                console.error(error);
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
                <div className="z-10 md:mx-5 mx-3 p-5 bg-gradient-to-r mt-2 rounded-lg md:px-10 md:py-7 text-white">
                    <div className="flex">
                        <div>
                            <p className="font-bold text-4xl text-orange-500">
                                {t("free_course", { ns: "index" })}
                            </p>
                            <p className="text-lg md:mt-1 text-gray-700">
                                {t("master_the_profession_of_a_painter_using_polymer_powder_coating", { ns: "index" })}<br/>
                            </p>
                        </div>

                        <div className="hidden md:block ml-auto">
                            <img src="/images/malyar.png" className="md:w-[150px] w-[200px]" alt="malyar" />
                        </div>
                    </div>

                    <div className="flex gap-x-5 mt-3 items-center">
                        <button onClick={() => setIsOpen(true)}
                                className="text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-400 transition-all duration-150"
                        >
                            {t("sign_up_now", { ns: "index" })}
                        </button>
                        <img src="/images/Лого.png" className="md:w-[150px] w-[200px]" alt="malyar" />
                    </div>
                </div>
                <div className="z-10 md:mx-5 mx-3 p-5 bg-gradient-to-r from-violet-950 to-violet-950 mt-2 rounded-lg md:px-10 md:py-7 text-white">
                    <div className="flex">
                        <div>
                            <p className="font-bold text-lg md:text-xl text-orange-500">
                                {t("new_paid_courses_from_skillstap", { ns: "index" })}
                            </p>
                            <p className="text-lg md:mt-1">
                                1. {t("basics_of_earning_money_on_youtube", { ns: "index" })}<br/>
                                2. {t("how_to_open_a_coffee_shop", { ns: "index" })}
                            </p>
                        </div>

                        <div className="hidden md:block ml-auto">
                            <img src="/images/resource.png" className="md:w-[100px] w-[120px]" alt="scam" />
                        </div>
                    </div>

                    <div className="flex gap-x-5 mt-3 items-center">
                        <button onClick={(e) => handleButtonClick(e, 'https://forms.gle/Mb2h6yuWh93YqgEXA', 1)}
                                className="text-center px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-orange-500 text-white hover:bg-white transition-all duration-150 hover:text-orange-500"
                        >
                            {t("submit_an_application", { ns: "index" })}
                        </button>
                    </div>
                </div>
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

            </Carousel>
            <div className="flex mt-5 md:mx-5 ml-3 md:max-w-[800px] max-w-[95%] pb-2 gap-x-5 overflow-x-auto">
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image1.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                        {t("enrollment_in_progress", { ns: "index" })}
                    </div>
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                        {t("new", { ns: "index" })}
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                      {t("oil_change_and_tire_service", { ns: "index" })}
                  </div>
                </div>
                <div className="px-3 mb-2 mt-2 text-sm font-light text-gray-500">
                    {t("learn_oil_and_tire_replacement", { ns: "index" })}
                </div>
              </div>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image2.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      {t("enrollment_in_progress", { ns: "index" })}
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                      {t("basics_of_cabinet_furniture_manufacturing", { ns: "index" })}
                  </div>
                </div>
                <div className="px-3 mt-2 text-sm font-light text-gray-500 mb-2">
                    {t("practical_skills_for_furniture_career", { ns: "index" })}
                </div>
              </div>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image3.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      {t("enrollment_in_progress", { ns: "index" })}
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                      {t("shoe_repair_workshop", { ns: "index" })}
                  </div>
                </div>
                <div className="px-3 mb-2 mt-2 text-sm font-light text-gray-500">
                    {t("learn_shoe_repair_and_key_making", { ns: "index" })}
                </div>
              </div>
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg"
              >
                <div className="w-[300px] px-3 bg-[url('/images/image4.png')] bg-center bg-cover text-white pb-5 text-lg rounded-t-lg pt-2">
                  <div className="flex-wrap flex gap-1">
                    <div className="px-4 py-1 text-xs border border-white bg-black bg-opacity-50 rounded-full inline-block">
                      {t("enrollment_in_progress", { ns: "index" })}
                    </div>
                  </div>
                  <div className="mt-10 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)] font-semibold">
                    <br />
                      {t("electric_gas_welder", { ns: "index" })}
                  </div>
                </div>
                <div className="px-3 mt-2 text-sm font-light text-gray-500">
                    {t("ideal_for_industry_career", { ns: "index" })}
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
            {announcements.data.map((anonce, index) => (
              <Link
                href={`/announcement/${anonce.id}`}
                key={index}
                className={`block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex gap-x-1 ${anonce.city === "Астана" ? "text-blue-400" : "text-gray-500"} items-center`}
                  >
                    <FaLocationDot className="text-sm" />
                    <div className="text-[10pt] md:text-sm">{anonce.city}</div>
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
                <div className="flex md:mt-4 mt-2 gap-x-3 items-center">
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
                      {i18n.language === "ru" ? work.name_ru : work.name_kz}
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
                        {urgent.salary_type === "max" && anonce.cost_max &&
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
                        {top.salary_type === "max" && anonce.cost_max &&
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
