import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links }) => {

    return (
        <div className="mt-5 flex w-full items-center">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className='block'
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
};

export default Pagination;
