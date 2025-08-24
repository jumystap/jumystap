import GuestLayout from "@/Layouts/GuestLayout";
import { Calendar, MapPin, Briefcase, Code, GraduationCap, Languages, HousePlus} from 'lucide-react';
import {useTranslation} from "react-i18next";

export default function Resume({ user, resume }) {
    const { t, i18n } = useTranslation('resume');
    const isRussian = i18n.language === 'ru';
    // Calculate total experience from organizations
    const calculateTotalExperience = () => {
        return resume.organizations.length > 0 ? "" : "Нет опыта работы";
    };

    return (
        <GuestLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto py-8 px-4">
                    {/* Header Section */}
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="relative">
                                <img
                                    src={`/storage/${resume.user.image_url}`}
                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-50"
                                    alt={resume.user.name}
                                />
                                <div className="absolute -bottom-2 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{resume.user.name}</h1>
                                <div className="flex flex-col gap-2 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span>{resume.user.gender_name}, {resume.user.age},  {resume.user.born}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{resume.city}{resume.city == 'Астана' && resume.district && `, район ${resume.district}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                                        </svg>
                                        <span>{resume.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2 5.5C2 4.12 3.12 3 4.5 3h2.55c.7 0 1.33.36 1.7.95l1.15 1.92c.36.59.39 1.33.07 1.95L8.5 9.5c1.1 2.3 2.9 4.1 5.2 5.2l1.68-1.47c.62-.32 1.36-.29 1.95.07l1.92 1.15c.59.37.95 1 .95 1.7V19.5c0 1.38-1.12 2.5-2.5 2.5C7.04 22 2 16.96 2 10.5V5.5z"
                                            />
                                        </svg>
                                        <span>+{resume.phone ?? resume.user.phone ?? ''}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <span className="py-1 px-3 rounded-lg mt-2 text-sm bg-green-100 inline-block text-green-500">
                                            {isRussian ? resume.user.status : resume.user.status_kz}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Experience Section */}
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">{resume.position}</h2>
                                    {resume.formatted_salary && (
                                        <>
                                            <h2 className="text-xl font-semibold text-gray-900">{resume.formatted_salary} ₸</h2>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 mb-6">
                                    <p>{t('employment_type_short')}: {resume.employment_type}</p>
                                    <p>{t('work_schedule_short')}: {resume.work_schedule}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">{t('experience')}</h2>
                                    <span className="text-sm text-gray-500">({calculateTotalExperience()})</span>
                                </div>
                                {resume.organizations.length > 0 ? (
                                    <div className="space-y-6">
                                        {resume.organizations.map((organization, index) => (
                                            <div key={index} className="relative pl-8 border-l-2 border-gray-200 last:pb-0">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                                                <h3 className="font-medium text-lg text-gray-900">{organization.position}</h3>
                                                <div className="text-gray-600 mb-2">{organization.organization}</div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{organization.period}</span>
                                                </div>
                                                <div className="text-gray-600">{organization.responsibilities}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500">{t('no_work_experience')}</div>
                                )}
                            </div>

                            {/* Education */}
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <GraduationCap className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">{t('education')}: {resume.education_level}</h2>
                                </div>
                                {resume.education_level_id != 1 && (
                                    <>
                                        <div className="flex flex-wrap justify-between items-start gap-2 mb-6">
                                            <div>
                                                <h3 className="font-medium text-lg text-gray-900">{resume.educational_institution}</h3>
                                                <div className="text-gray-600">{resume.faculty}</div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{resume.graduation_year}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center gap-3 mb-6">
                                    <Languages className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">{t('knowledge_of_languages')}</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resume.languages.map((language, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                                        >
                                            {language.language}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Code className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">{t('key_skills')}</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resume.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <HousePlus className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">{t('permissions_and_additional_information')}</h2>
                                </div>
                                <div className="flex flex-col gap-2 mb-6">
                                    <p>- {t('ip_status')}: {resume.ip_status ? t('yes') : t('no')}</p>
                                    <p>- {t('has_car')}: {resume.has_car ? t('yes') : t('no')}</p>
                                    {resume.driving_license_title && (
                                        <>
                                            <p>- {t('driving_license')}: {resume.driving_license_title}</p>
                                        </>
                                    )}
                                    {resume.about && (
                                        <>
                                            <p className="mt-3">{t('about')}: {resume.about}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        {/*<div className="space-y-6">*/}
                        {/*    <div className="bg-white rounded-xl shadow-sm p-6">*/}
                        {/*        <h2 className="font-semibold text-gray-900 mb-4">{t('contact_information')}</h2>*/}
                        {/*        <div className="space-y-3 text-sm text-gray-600">*/}
                        {/*            <div className="flex items-center gap-2">*/}
                        {/*                <MapPin className="w-4 h-4" />*/}
                        {/*                <span>{resume.city}</span>*/}
                        {/*            </div>*/}
                        {/*            <div className="flex items-center gap-2">*/}
                        {/*                <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">*/}
                        {/*                    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />*/}
                        {/*                </svg>*/}
                        {/*                <span>{resume.email ?? resume.user.email}</span>*/}
                        {/*            </div>*/}

                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </GuestLayout>
    );
}
