import React, { useState, useEffect } from 'react';

const Carousel = ({ children, autoplay = true, autoplayInterval = 3000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % React.Children.count(children));
    };

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(nextSlide, autoplayInterval);
            return () => clearInterval(interval);
        }
    }, [autoplay, autoplayInterval]);

    return (
        <div className=" overflow-hidden z-10">
            <div className="flex transition-transform duration-1000" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {React.Children.map(children, (child, index) => (
                    <div className=" min-w-full max-w-[300px]">{child}</div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
