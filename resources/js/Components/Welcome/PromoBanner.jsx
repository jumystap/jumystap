import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

function PromoAction({ action, fallbackClassName }) {
    if (!action) {
        return null;
    }

    const className = action.className || fallbackClassName;

    if (action.href) {
        return (
            <a
                href={action.href}
                target={action.target}
                rel={action.rel}
                className={className}
            >
                {action.label}
            </a>
        );
    }

    return (
        <button type="button" onClick={action.onClick} className={className}>
            {action.label}
        </button>
    );
}

function resolveSlideConfig(slide) {
    return {
        containerClassName:
            slide.containerClassName ||
            "relative overflow-hidden rounded-[24px] border border-[#e5e8f0] bg-white px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.07)]",
        customContent: slide.customContent || null,
        contentClassName: slide.contentClassName || "relative space-y-4",
        accentClassName:
            slide.accentClassName ||
            "pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-[#eaf1ff] blur-2xl",
        textContainerClassName: slide.textContainerClassName || "max-w-[220px]",
        titleClassName:
            slide.titleClassName || "text-[18px] font-bold leading-5 text-[#f36a10]",
        descriptionClassName:
            slide.descriptionClassName || "mt-2 text-[13px] leading-4 text-[#667085]",
        actionsRowClassName:
            slide.actionsRowClassName || "flex items-end justify-between gap-3",
        actionsContainerClassName:
            slide.actionsContainerClassName || "flex flex-1 flex-wrap gap-2",
        primaryActionClassName:
            slide.primaryActionClassName ||
            "inline-flex min-h-[48px] items-center rounded-[18px] bg-[#f36a10] px-4 py-3 text-left text-[13px] font-semibold leading-4 text-white shadow-[0_10px_24px_rgba(243,106,16,0.28)] transition-opacity hover:opacity-95",
        secondaryActionClassName:
            slide.secondaryActionClassName ||
            "inline-flex min-h-[48px] items-center rounded-[18px] border border-[#d9deea] bg-white px-4 py-3 text-left text-[13px] font-semibold leading-4 text-[#3052c8] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#5a7cf3]",
        imageWrapperClassName:
            slide.imageWrapperClassName ||
            "shrink-0 rounded-[18px] border border-[#edf1f7] bg-[#f8faff] px-3 py-3",
        imageClassName: slide.imageClassName || "h-6 w-auto object-contain",
        ...slide,
    };
}

function PromoContent({ slide }) {
    const resolvedSlide = resolveSlideConfig(slide);

    if (resolvedSlide.customContent) {
        return resolvedSlide.customContent;
    }

    return (
        <>
            <div className={resolvedSlide.accentClassName} />

            <div className={resolvedSlide.contentClassName}>
                <div className={resolvedSlide.textContainerClassName}>
                    <h1 className={resolvedSlide.titleClassName}>{resolvedSlide.title}</h1>
                    <p className={resolvedSlide.descriptionClassName}>{resolvedSlide.description}</p>
                </div>

                <div className={resolvedSlide.actionsRowClassName}>
                    <div className={resolvedSlide.actionsContainerClassName}>
                        <PromoAction
                            action={resolvedSlide.primaryAction}
                            fallbackClassName={resolvedSlide.primaryActionClassName}
                        />
                        <PromoAction
                            action={resolvedSlide.secondaryAction}
                            fallbackClassName={resolvedSlide.secondaryActionClassName}
                        />
                    </div>

                    {resolvedSlide.imageSrc ? (
                        <div className={resolvedSlide.imageWrapperClassName}>
                            <img
                                src={resolvedSlide.imageSrc}
                                alt={resolvedSlide.imageAlt || resolvedSlide.title}
                                className={resolvedSlide.imageClassName}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default function PromoBanner({ slide, slides = [slide], onPrev, onNext }) {
    const measureRefs = useRef([]);
    const touchStartRef = useRef(null);
    const didSwipeRef = useRef(false);
    const [bannerHeight, setBannerHeight] = useState(null);
    const resolvedSlide = useMemo(() => resolveSlideConfig(slide), [slide]);
    const resolvedSlides = useMemo(
        () => slides.map((promoSlide) => resolveSlideConfig(promoSlide)),
        [slides]
    );

    useLayoutEffect(() => {
        const updateHeight = () => {
            const heights = measureRefs.current
                .map((node) => node?.offsetHeight || 0)
                .filter(Boolean);

            if (heights.length > 0) {
                setBannerHeight(Math.max(...heights));
            }
        };

        updateHeight();

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(updateHeight);
            measureRefs.current.forEach((node) => {
                if (node) {
                    observer.observe(node);
                }
            });

            return () => observer.disconnect();
        }

        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, [resolvedSlides]);

    const handleTouchStart = (event) => {
        const touch = event.touches?.[0];

        if (!touch) {
            return;
        }

        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
        didSwipeRef.current = false;
    };

    const handleTouchEnd = (event) => {
        const touch = event.changedTouches?.[0];
        const start = touchStartRef.current;

        touchStartRef.current = null;

        if (!touch || !start) {
            return;
        }

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;
        const isHorizontalSwipe =
            Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY);

        if (!isHorizontalSwipe) {
            return;
        }

        didSwipeRef.current = true;
        window.setTimeout(() => {
            didSwipeRef.current = false;
        }, 250);

        if (deltaX < 0) {
            onNext?.();
            return;
        }

        onPrev?.();
    };

    const handleClickCapture = (event) => {
        if (!didSwipeRef.current) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        didSwipeRef.current = false;
    };

    const containerClassName =
        resolvedSlide.containerClassName;

    return (
        <section
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClickCapture={handleClickCapture}
            style={{ touchAction: "pan-y" }}
        >
            <div
                className={containerClassName}
                style={bannerHeight ? { height: `${bannerHeight}px` } : undefined}
            >
                <PromoContent slide={slide} />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 invisible"
            >
                {resolvedSlides.map((promoSlide, index) => (
                    <div
                        key={promoSlide.key || index}
                        ref={(node) => {
                            measureRefs.current[index] = node;
                        }}
                        className={promoSlide.containerClassName}
                    >
                        <PromoContent slide={promoSlide} />
                    </div>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={onPrev}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9deea] bg-white text-[12px] text-[#667085] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#5a7cf3] hover:text-[#3052c8]"
                    aria-label="Previous banner"
                >
                    <LeftOutlined />
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9deea] bg-white text-[12px] text-[#667085] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#5a7cf3] hover:text-[#3052c8]"
                    aria-label="Next banner"
                >
                    <RightOutlined />
                </button>
            </div>
        </section>
    );
}
