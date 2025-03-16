import GuestLayout from "@/Layouts/GuestLayout";
import { IoStar } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

export default function About(){
    const { t, i18n } = useTranslation('about');

    return(
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="mt-10 col-span-5 px-5">
                    <div className="font-semibold text-2xl">
                        {i18n.language === "ru" ? (
                            <>
                                JUMYSTAP.KZ - бесплатная площадка <br />
                                для <span className="border-b-[3px] border-blue-500">поиска сотрудников и вакансий!</span>
                            </>
                        ) : (
                            <>
                                JUMYSTAP.KZ - тегін қызметкерлер мен <br /> бос
                                <span className="border-b-[3px] border-blue-500"> жұмыс орындарын іздеу сайты!</span>
                            </>
                        )}
                    </div>
                    <div className="font-bold inline-block text-white bg-blue-500 rounded-lg px-5 py-2 text-lg mt-7">{t('for_employers_and_customers')}</div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('free_ad_submission')}
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('both_vacancies_and_bulk_orders')}
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('simple_registration')}
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('trained_candidates_with_verified_certificates')}
                    </div>
                    <div className="font-bold inline-block text-white bg-blue-500 rounded-lg px-5 py-2 text-lg mt-7">
                        {t('for_job_seekers_and_joltap_graduates')}
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('convenient_portfolio_placement')}
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('direct_contact_via_whatsapp')}
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        {t('permanent_job_or_bulk_orders_choose_what_you_need')}
                    </div>
                </div>
                <div className="md:block hidden border-l border-gray-200 h-screen sticky top-0 col-span-2">
                </div>
            </div>
        </GuestLayout>
    )
}
