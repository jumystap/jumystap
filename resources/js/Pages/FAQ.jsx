import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';

export default function FAQ() {
    const { t, i18n } = useTranslation();
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    const faqData = [
        {
            question: t('question_1', { ns: 'faq' }),
            answers: [
                t('answer_11', { ns: 'faq' }),
                t('answer_12', { ns: 'faq' }),
                t('answer_13', { ns: 'faq' }),
                t('answer_14', { ns: 'faq' })
            ]
        },
        {
            question: t('question_2', { ns: 'faq' }),
            answers: [
                t('graduate_answer_1', { ns: 'faq' }),
                t('graduate_answer_2', { ns: 'faq' }),
                t('graduate_answer_3', { ns: 'faq' }),
                t('graduate_answer_4', { ns: 'faq' }),
                t('graduate_answer_5', { ns: 'faq' }),
                t('graduate_answer_6', { ns: 'faq' }),
                t('graduate_answer_7', { ns: 'faq' }),
                t('graduate_answer_8', { ns: 'faq' }),
                t('graduate_answer_9', { ns: 'faq' })
            ]
        },
        {
            question: t('question_3', { ns: 'faq' }),
            answers: [
                t('graduate_answer_31', { ns: 'faq' }),
                t('graduate_answer_32', { ns: 'faq' }),
                t('graduate_answer_33', { ns: 'faq' })
            ]
        },
        {
            question: t('question_4', { ns: 'faq' }),
            answers: [
                t('graduate_answer_41', { ns: 'faq' }),
                t('graduate_answer_42', { ns: 'faq' }),
                t('graduate_answer_43', { ns: 'faq' }),
                t('graduate_answer_44', { ns: 'faq' }),
                t('graduate_answer_45', { ns: 'faq' })
            ]
        },
        {
            question: t('question_5', { ns: 'faq' }),
            answers: [
                t('employer_answer_51', { ns: 'faq' }),
                t('employer_answer_52', { ns: 'faq' }),
                t('employer_answer_53', { ns: 'faq' }),
                t('employer_answer_54', { ns: 'faq' }),
                t('employer_answer_55', { ns: 'faq' })
            ]
        },
        {
            question: t('question_6', { ns: 'faq' }),
            answers: [
                t('order_answer_61', { ns: 'faq' }),
                t('order_answer_62', { ns: 'faq' }),
                t('order_answer_63', { ns: 'faq' }),
                t('order_answer_64', { ns: 'faq' }),
                t('order_answer_65', { ns: 'faq' })
            ]
        },
        {
            question: t('question_7', { ns: 'faq' }),
            answers: [
                t('answer_71', { ns: 'faq' }),
                t('answer_72', { ns: 'faq' }),
                t('answer_73', { ns: 'faq' }),
                t('answer_74', { ns: 'faq' }),
                t('answer_75', { ns: 'faq' }),
                t('answer_76', { ns: 'faq' }),
                t('answer_77', { ns: 'faq' }),
                t('answer_78', { ns: 'faq' }),
                t('answer_79', { ns: 'faq' }),
                t('answer_710', { ns: 'faq' }),
                t('answer_711', { ns: 'faq' }),
                t('answer_712', { ns: 'faq' }),
                t('answer_713', { ns: 'faq' }),
                t('answer_714', { ns: 'faq' })
            ]
        },
        {
            question: t('question_8', { ns: 'faq' }),
            answers: [
                t('answer_81', { ns: 'faq' }),
                t('answer_82', { ns: 'faq' }),
                t('answer_83', { ns: 'faq' })
            ]
        },
        {
            question: t('question_9', { ns: 'faq' }),
            answers: [
                t('answer_91', { ns: 'faq' }),
                t('answer_92', { ns: 'faq' }),
                t('answer_93', { ns: 'faq' }),
                t('answer_94', { ns: 'faq' })
            ]
        },
        {
            question: t('question_10', { ns: 'faq' }),
            answers: [t('answer_10', { ns: 'faq' })]
        },
        {
            question: t('question_11', { ns: 'faq' }),
            answers: [
                t('answer_110', { ns: 'faq' }),
                t('graduate_answer_110', { ns: 'faq' }),
                t('graduate_answer_111', { ns: 'faq' }),
                t('graduate_answer_112', { ns: 'faq' }),
                t('graduate_answer_113', { ns: 'faq' }),
                t('employer_answer_110', { ns: 'faq' }),
                t('employer_answer_111', { ns: 'faq' }),
                t('employer_answer_112', { ns: 'faq' })
            ]
        },
        {
            question: t('question_12', { ns: 'faq' }),
            answers: [
                t('answer_120', { ns: 'faq' }),
                t('call_center1', { ns: 'faq' }),
                t('call_center2', { ns: 'faq' }),
                t('work_schedule', { ns: 'faq' })
            ]
        },
    ];

    return (
        <GuestLayout>
            <div className='grid grid-cols-1 md:grid-cols-7'>
                <div className="col-span-5 mx-auto p-10">
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
                </div>
                <div className='h-screen sticky md:block hidden top-0 border-l border-gray-200 pt-10 col-span-2 p-5'>
                    <div className='pr-10'>
                        <div className='text-lg'>{t('login_issues', { ns: 'faq' })}</div>
                        <div className='text-sm font-light text-gray-500'>
                            {t('if_you_experience_difficulties_you_can_contact_us_using_these_details', { ns: 'faq' })}
                        </div>
                        <div className='mt-10 text-sm'>
                            <div>+7 707 221 31 31</div>
                            <div className='mt-3'>janamumkindik@gmail.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

