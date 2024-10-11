import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";


export default function CreateResume({ auth }) {
    const { t, i18n } = useTranslation();

    return (
        <>
            <GuestLayout>
                <div className="grid grid-cols-1 md:grid-cols-7">
                    <div className='col-span-5'>
                    </div>
                    <div className="col-span-2 h-screen sticky top-0 border-l md:block hidden border-gray-200">
                    </div>
                </div>
            <GuestLayout/>
        </>
    );
}

