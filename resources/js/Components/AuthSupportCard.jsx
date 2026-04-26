import MobileSurface from "@/Components/Mobile/MobileSurface";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const baseCardClassName = "jt-mobile-info-card w-full max-w-md mx-auto p-5 md:col-span-2 md:max-w-none md:mx-0 md:h-full md:bg-[#F9FAFC] md:relative md:shadow-none";
const baseContentClassName = "w-full text-center md:w-auto md:max-w-none md:mx-0 md:text-left md:absolute md:bottom-5 md:pr-10 mt-6 md:mt-0";

export default function AuthSupportCard({
    children,
    title,
    description,
    phone = "+7 707 221 31 31",
    phoneHref = "tel:+77072213131",
    email = "janamumkindik@gmail.com",
    className = "",
    contentClassName = "",
}) {
    const { t } = useTranslation();
    const cardClassName = [baseCardClassName, className].filter(Boolean).join(" ");
    const mergedContentClassName = [baseContentClassName, contentClassName].filter(Boolean).join(" ");
    const whatsappHref = `https://api.whatsapp.com/send?phone=${phone.replace(/[^\d+]/g, "")}&text=${encodeURIComponent("Здравствуйте пишу с сайта JUMYSTAP")}`;

    return (
        <MobileSurface className={cardClassName}>
            {children ? <div className="hidden md:block">{children}</div> : null}
            <div className={mergedContentClassName}>
                <div className="text-lg">{title}</div>
                <div className="text-sm font-light text-gray-500">{description}</div>
                <div className="mt-6 text-sm">
                    <a
                        href={phoneHref}
                        className="flex items-center justify-center gap-2 hover:underline md:justify-start"
                    >
                        <FaPhoneAlt className="text-base" />
                        <span>{phone}</span>
                    </a>
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 hover:underline md:justify-start"
                    >
                        <FaWhatsapp className="text-xl" />
                        <span>{t("technical_support", { ns: "index" })}</span>
                    </a>
                    <a
                        href={`mailto:${email}`}
                        className="mt-3 flex items-center justify-center gap-2 hover:underline md:justify-start"
                    >
                        <FaEnvelope className="text-base" />
                        <span>{email}</span>
                    </a>
                </div>
            </div>
        </MobileSurface>
    );
}
