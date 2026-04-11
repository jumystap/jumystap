import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function PromoBanner({ slide, onPrev, onNext, onCtaClick }) {
    return (
        <section>
            <div className="relative overflow-hidden rounded-[24px] border border-[#e5e8f0] bg-white px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
                <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-[#eaf1ff] blur-2xl" />

                <div className="relative space-y-4">
                    <div className="max-w-[220px]">
                        <h1 className="text-[18px] font-bold leading-5 text-[#f36a10]">
                            {slide.title}
                        </h1>
                        <p className="mt-2 text-[13px] leading-4 text-[#667085]">
                            {slide.description}
                        </p>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                        <button
                            type="button"
                            onClick={onCtaClick}
                            className="min-h-[48px] rounded-[18px] bg-[#f36a10] px-4 py-3 text-left text-[13px] font-semibold leading-4 text-white shadow-[0_10px_24px_rgba(243,106,16,0.28)] transition-opacity hover:opacity-95"
                        >
                            {slide.ctaLabel}
                        </button>

                        <div className="shrink-0 rounded-[18px] border border-[#edf1f7] bg-[#f8faff] px-3 py-3">
                            <img
                                src="/images/logo.png"
                                alt="JUMYSTAP"
                                className="h-6 w-auto object-contain"
                            />
                        </div>
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
