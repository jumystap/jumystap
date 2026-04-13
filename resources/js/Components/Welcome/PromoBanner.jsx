import { LeftOutlined, RightOutlined } from "@ant-design/icons";

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

export default function PromoBanner({ slide, onPrev, onNext }) {
    const containerClassName =
        slide.containerClassName ||
        "relative overflow-hidden rounded-[24px] border border-[#e5e8f0] bg-white px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.07)]";
    const accentClassName =
        slide.accentClassName ||
        "pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-[#eaf1ff] blur-2xl";
    const titleClassName =
        slide.titleClassName || "text-[18px] font-bold leading-5 text-[#f36a10]";
    const descriptionClassName =
        slide.descriptionClassName || "mt-2 text-[13px] leading-4 text-[#667085]";
    const primaryActionClassName =
        slide.primaryActionClassName ||
        "inline-flex min-h-[48px] items-center rounded-[18px] bg-[#f36a10] px-4 py-3 text-left text-[13px] font-semibold leading-4 text-white shadow-[0_10px_24px_rgba(243,106,16,0.28)] transition-opacity hover:opacity-95";
    const secondaryActionClassName =
        slide.secondaryActionClassName ||
        "inline-flex min-h-[48px] items-center rounded-[18px] border border-[#d9deea] bg-white px-4 py-3 text-left text-[13px] font-semibold leading-4 text-[#3052c8] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#5a7cf3]";
    const imageWrapperClassName =
        slide.imageWrapperClassName ||
        "shrink-0 rounded-[18px] border border-[#edf1f7] bg-[#f8faff] px-3 py-3";
    const imageClassName = slide.imageClassName || "h-6 w-auto object-contain";

    return (
        <section>
            <div className={containerClassName}>
                <div className={accentClassName} />

                <div className="relative space-y-4">
                    <div className="max-w-[220px]">
                        <h1 className={titleClassName}>{slide.title}</h1>
                        <p className={descriptionClassName}>{slide.description}</p>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                        <div className="flex flex-1 flex-wrap gap-2">
                            <PromoAction
                                action={slide.primaryAction}
                                fallbackClassName={primaryActionClassName}
                            />
                            <PromoAction
                                action={slide.secondaryAction}
                                fallbackClassName={secondaryActionClassName}
                            />
                        </div>

                        {slide.imageSrc ? (
                            <div className={imageWrapperClassName}>
                                <img
                                    src={slide.imageSrc}
                                    alt={slide.imageAlt || slide.title}
                                    className={imageClassName}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
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
