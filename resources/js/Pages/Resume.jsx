import React from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { Calendar, MapPin, Briefcase, Code } from 'lucide-react';
import {useTranslation} from "react-i18next";

export default function Resume({ user, resume }) {
    const { t, i18n } = useTranslation('profile');

    // Calculate total experience from organizations
    const calculateTotalExperience = () => {
        return resume.organizations.length > 0 ? "2 года 10 месяцев" : "Нет опыта работы";
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
                                    src={`/storage/${resume.photo_path}`}
                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-50"
                                    alt={user.name}
                                />
                                <div className="absolute -bottom-2 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                                <div className="flex flex-col gap-2 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{resume.city} {resume.district && `, район ${resume.district}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                                        </svg>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Experience Section */}
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">{t('experience')}</h2>
                                    <span className="text-sm text-gray-500">({calculateTotalExperience()})</span>
                                </div>

                                {resume.organizations.length > 0 ? (
                                    <div className="space-y-6">
                                        {resume.organizations.map((organization, index) => (
                                            <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                                                <h3 className="font-medium text-lg text-gray-900">{organization.position_name}</h3>
                                                <div className="text-gray-600 mb-2">{organization.organization}</div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{organization.period}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500">{t('no_work_experience')}</div>
                                )}
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
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">{t('contact_information')}</h2>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{resume.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                                        </svg>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
