import React from 'react';
import { Link } from '@inertiajs/react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ links, currentPage }) => {
    // Filter out 'Next' and 'Previous' links from the array
    const filteredLinks = links.filter(link => !['&laquo; Previous', 'Next &raquo;'].includes(link.label));

    // Define the number of pages to display at once
    const maxVisiblePages = 5;
    const totalPages = filteredLinks.length;
    const currentIndex = filteredLinks.findIndex(link => link.active);

    // Calculate the range of pages to display
    let startPage = Math.max(currentIndex - Math.floor(maxVisiblePages / 2), 0);
    let endPage = Math.min(startPage + maxVisiblePages, totalPages);

    if (endPage - startPage < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages, 0);
    }

    return (
        <div className="mb-10 mt-5 flex w-full items-center">
            <div className='flex mx-auto px-2 bg-gray-100 rounded-full py-1  items-center'>
                {/* Previous Button */}
                {links.find(link => link.label === '&laquo; Previous') && (
                    <Link
                        href={links.find(link => link.label === '&laquo; Previous').url || '#'}
                        className='block px-2'
                    >
                        <IoIosArrowBack />
                    </Link>
                )}

                {/* First page and ellipsis */}
                {startPage > 0 && (
                    <>
                        <Link href={filteredLinks[0].url} className="block px-3 py-1 rounded-full text-gray-400">1</Link>
                        <span className="block px-3 py-1">...</span>
                    </>
                )}

                {/* Page numbers */}
                {filteredLinks.slice(startPage, endPage).map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`block px-3 py-1 rounded-full ${link.active ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Last page and ellipsis */}
                {endPage < totalPages && (
                    <>
                        <span className="block px-3 py-1">...</span>
                        <Link href={filteredLinks[totalPages - 1].url} className="block px-3 py-1 rounded-full text-gray-400">{totalPages}</Link>
                    </>
                )}

                {/* Next Button */}
                {links.find(link => link.label === 'Next &raquo;') && (
                    <Link
                        href={links.find(link => link.label === 'Next &raquo;').url || '#'}
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

