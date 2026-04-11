import { FaInstagram, FaTelegramPlane } from "react-icons/fa";

const cardIcons = {
    telegram: FaTelegramPlane,
    instagram: FaInstagram,
};

const cardIconClasses = {
    telegram: "bg-[#edf4ff] text-[#1d90ff]",
    instagram: "bg-[#fff1f2] text-[#f0448f]",
};

export default function SocialPromoGrid({ items }) {
    return (
        <section className="grid grid-cols-2 gap-3">
            {items.map((item) => {
                const Icon = cardIcons[item.tone];

                return (
                    <a
                        key={item.key}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[108px] flex-col items-center justify-center rounded-[22px] border border-[#e5e8f0] bg-white px-3 py-4 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-colors hover:border-[#d7e2ff] hover:bg-[#f8faff]"
                    >
                        <div
                            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full text-[20px] ${
                                cardIconClasses[item.tone]
                            }`}
                        >
                            <Icon />
                        </div>
                        <div className="text-[11px] font-medium leading-[1.25] text-[#475467]">
                            {item.label}
                        </div>
                    </a>
                );
            })}
        </section>
    );
}
