import React from 'react';
import { Link } from '@inertiajs/react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ links, searchKeyword }) => {
    const filteredLinks = links.filter(link =>
        !link.label.includes('Previous') && !link.label.includes('Next')
    );

    const maxVisiblePages = 3;
    const totalPages = filteredLinks.length;
    const currentIndex = filteredLinks.findIndex(link => link.active);
    const currentPage = parseInt(filteredLinks[currentIndex]?.label) || 1;

    let startPage = Math.max(currentIndex - Math.floor(maxVisiblePages / 2), 0);
    let endPage = Math.min(startPage + maxVisiblePages, totalPages);

    if (endPage - startPage < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages, 0);
    }

    const appendSearchToUrl = (url) => {
        if (!url) return '#';
        if (!searchKeyword) return url;
        const hasQuery = url.includes('?');
        return `${url}${hasQuery ? '&' : '?'}search=${encodeURIComponent(searchKeyword)}`;
    };

    const getLabelAsNumber = (label) => {
        const page = parseInt(label);
        return isNaN(page) ? null : page;
    };

    return (
        <div className="mb-5 mt-5 flex w-full items-center">
            <div className='flex mx-auto px-2 bg-gray-100 text-base rounded-full py-1 items-center'>
                {links.find(link => link.label.includes('Previous'))?.url && (
                    <Link
                        href={appendSearchToUrl(links.find(link => link.label.includes('Previous')).url)}
                        className='block px-2'
                    >
                        <IoIosArrowBack />
                    </Link>
                )}

                {startPage > 0 && (
                    <>
                        <Link
                            href={appendSearchToUrl(filteredLinks[0].url)}
                            className="block px-3 py-1 rounded-full text-gray-400"
                        >
                            {filteredLinks[0].label}
                        </Link>
                        <span className="block px-3 py-1">...</span>
                    </>
                )}

                {filteredLinks.slice(startPage, endPage).map((link) => (
                    <Link
                        key={link.label}
                        href={appendSearchToUrl(link.url)}
                        className={`block px-3 py-1 rounded-full ${
                            link.active
                                ? 'bg-gray-200 text-gray-700 font-bold'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}

                {endPage < totalPages && (
                    <>
                        <span className="block px-3 py-1">...</span>
                        <Link
                            href={appendSearchToUrl(filteredLinks[totalPages - 1].url)}
                            className="block px-3 py-1 rounded-full text-gray-400"
                        >
                            {filteredLinks[totalPages - 1].label}
                        </Link>
                    </>
                )}

                {links.find(link => link.label.includes('Next'))?.url && (
                    <Link
                        href={appendSearchToUrl(links.find(link => link.label.includes('Next')).url)}
                        className='block px-2'
                    >
                        <IoIosArrowForward />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Pagination;
