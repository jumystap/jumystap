import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthSupportCard from "@/Components/AuthSupportCard";
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import MobileSurface from "@/Components/Mobile/MobileSurface";

export default function FAQ({ faqs = [] }) {
    const { t } = useTranslation();
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    const faqData = faqs;

    return (
        <GuestLayout>
            <div className='grid grid-cols-1 md:grid-cols-7'>
                <div className="col-span-5 mx-auto p-0 md:p-10">
                    <MobileSurface className="md:bg-transparent md:shadow-none md:border-0 md:p-0">
                        <h1 className="text-2xl md:text-xl font-bold text-center mb-4">{t('title', { ns: 'faq' })}</h1>
                        {faqData.map((item, index) => (
                            <div key={index} className="mb-4">
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="w-full text-left p-4 bg-gray-100 text-gray-500 rounded-md focus:outline-none focus:ring"
                                >
                                    <span className="font-semibold">{item.question}</span>
                                </button>
                                {openQuestion === index && (
                                    <div className="mt-2 p-4 bg-white border rounded-md shadow-md">
                                        {item.answers.map((answer, i) => (
                                            <p key={i} dangerouslySetInnerHTML={{ __html: answer }}></p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </MobileSurface>
                </div>
                <AuthSupportCard
                    className="hidden md:block md:sticky md:top-0 md:h-screen md:pt-10"
                    title={t('login_issues', { ns: 'faq' })}
                    description={t('if_you_experience_difficulties_you_can_contact_us_using_these_details', { ns: 'faq' })}
                />
            </div>
        </GuestLayout>
    );
}
