import React from 'react';
import { Link } from '@inertiajs/react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ links }) => {

    return (
        <div className="mb-10 mt-5 flex w-full items-center">
            <div className='flex md:hidden items-center w-full px-5 gap-x-3'>
                {links.map((link, index) => {
                    if (link.label == 'Next &raquo;'){
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className='w-full text-center block px-2 py-2 rounded-lg bg-blue-500 text-white'
                            >
                                Далее
                            </Link>
                        )
                    }
                    if (link.label == '&laquo; Previous'){
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className='w-full text-center py-2 bg-gray-100 text-gray-500 rounded-lg block px-2'
                            >
                                Назад
                            </Link>
                        )
                    }
                })}
            </div>
            <div className='hidden md:flex mx-auto px-2 bg-gray-100 rounded-full py-1  items-center'>
                {links.map((link, index) => {
                    if (link.label == 'Next &raquo;'){
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className='block px-2'
                            >
                                <IoIosArrowForward />
                            </Link>
                        )
                    }
                    if (link.label == '&laquo; Previous'){
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className='block px-2'
                            >
                                <IoIosArrowBack />
                            </Link>
                        )
                    }
                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`block px-3 py-1 rounded-full ${link.active ? ('bg-gray-200 text-gray-700'):('text-gray-400')}`}
                        >
                            {link.label}
                        </Link>
                )})}
            </div>
        </div>
    );
};

export default Pagination;
