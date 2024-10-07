import React from 'react';
import { Link } from '@inertiajs/react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ links, currentPage, searchKeyword }) => {
    const filteredLinks = links.filter(link => !['&laquo; Previous', 'Next &raquo;'].includes(link.label));

    const maxVisiblePages = 3;
    const totalPages = filteredLinks.length;
    const currentIndex = filteredLinks.findIndex(link => link.active);

    let startPage = Math.max(currentIndex - Math.floor(maxVisiblePages / 2), 0);
    let endPage = Math.min(startPage + maxVisiblePages, totalPages);

    if (endPage - startPage < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages, 0);
    }

    const appendPageToUrl = (url, page) => {
        if (!url) return url;

        const currentUrl = window.location.href;

        const hasPageParam = currentUrl.includes('&page=') || currentUrl.includes('?page=');

        if (hasPageParam) {
            return currentUrl.replace(/([&?])page=\d+/, `$1page=${page}`);
        } else {
            const separator = currentUrl.includes('?') ? '&' : '?';
            return `${currentUrl}${separator}page=${page}`;
        }
    };

    return (
        <div className="mb-5 mt-5 flex w-full items-center">
            <div className='flex mx-auto px-2 bg-gray-100 text-base rounded-full py-1 items-center'>
                {links.find(link => link.label === '&laquo; Previous') && (
                    <Link
                        href={appendPageToUrl(links.find(link => link.label === '&laquo; Previous').url, currentPage - 1) || '#'}
                        className='block px-2'
                    >
                        <IoIosArrowBack />
                    </Link>
                )}

                {startPage > 0 && (
                    <>
                        <Link
                            href={appendPageToUrl(filteredLinks[0].url, 1)}
                            className="block px-3 py-1 rounded-full text-gray-400"
                        >
                            1
                        </Link>
                        <span className="block px-3 py-1">...</span>
                    </>
                )}

                {filteredLinks.slice(startPage, endPage).map((link) => (
                    <Link
                        key={link.label} // Use `link.label` as key
                        href={appendPageToUrl(link.url, link.label) || '#'} // Use `link.label` directly
                        className={`block px-3 py-1 rounded-full ${link.active ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}
                    >
                        {link.label}
                    </Link>
                ))}

                {endPage < totalPages && (
                    <>
                        <span className="block px-3 py-1">...</span>
                        <Link
                            href={appendPageToUrl(filteredLinks[totalPages - 1].url, totalPages)}
                            className="block px-3 py-1 rounded-full text-gray-400"
                        >
                            {filteredLinks[totalPages - 1].label}
                        </Link>
                    </>
                )}

                {links.find(link => link.label === 'Next &raquo;') && (
                    <Link
                        href={appendPageToUrl(links.find(link => link.label === 'Next &raquo;').url, currentPage + 1) || '#'}
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

