import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links }) => {
    const filteredLinks = [];

    links.forEach((link, index) => {
        const label = parseInt(link.label);
        const currentPage = links.find(l => l.active).label;

        // Always show the first two and last two links
        if (label === 1 || label === 2 || label === parseInt(links[links.length - 3].label) || label === parseInt(links[links.length - 4].label)) {
            filteredLinks.push(link);
        }

        // Always show the current page and two pages before and after
        else if (label >= currentPage - 2 && label <= currentPage + 2) {
            filteredLinks.push(link);
        }

        // Add "..." where necessary
        else if (filteredLinks[filteredLinks.length - 1]?.label !== '...' && (label > currentPage + 2 && index < links.length - 4)) {
            filteredLinks.push({ label: '...', url: null });
        }
    });

    return (
        <div className="mt-5 flex w-full items-center">
            <div className='flex mx-auto items-center border-gray-300 border p-[0px] gap-[0px]'>
                {filteredLinks.map((link, index) => {
                    if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                        return null;
                    }

                    if (link.label === '...') {
                        return (
                            <span key={index} className="text-gray-400 px-2 border-l border-gray-300">
                                ...
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`block py-1 px-2 md:px-3 md:text-base text-sm ${link.label != 1 && 'border-l'} border-gray-300 ${link.active ? 'text-white bg-orange-500' : ''} ${!link.url ? 'text-gray-500 cursor-not-allowed' : ''}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Pagination;
