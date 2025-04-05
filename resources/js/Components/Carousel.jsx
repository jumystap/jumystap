import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Carousel = ({ children, autoplay = true, autoplayInterval = 3000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const totalSlides = React.Children.count(children);
    const carouselRef = useRef(null); // Add ref to track the carousel container

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        if (!autoplay || isHovered) return; // Stop if not autoplaying or if hovered

        const interval = setInterval(nextSlide, autoplayInterval);

        // Cleanup interval on unmount or when conditions change
        return () => clearInterval(interval);
    }, [autoplay, autoplayInterval, isHovered]); // Add isHovered to dependencies

    // Handle mouse events
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            ref={carouselRef}
            className="relative overflow-hidden z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Carousel Content */}
            <div
                className="flex transition-transform duration-1000"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {React.Children.map(children, (child, index) => (
                    <div key={index} className="min-w-full max-w-[300px]">
                        {child}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <Button
                shape="circle"
                icon={<LeftOutlined />}
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white"
            />
            <Button
                shape="circle"
                icon={<RightOutlined />}
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white"
            />
        </div>
    );
};

export default Carousel;
