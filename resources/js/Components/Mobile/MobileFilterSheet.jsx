import { CgClose } from "react-icons/cg";

export default function MobileFilterSheet({ title, onClose, children, footer = null }) {
    return (
        <div className="jt-mobile-sheet fixed inset-0 z-40 flex h-screen w-full flex-col bg-white md:hidden">
            <div className="flex items-center px-5 pb-4 pt-7">
                <div className="text-xl font-bold text-[#1f2937]">{title}</div>
                <button
                    type="button"
                    onClick={onClose}
                    className="jt-mobile-icon-btn ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#d9deea] bg-white text-2xl text-[#667085]"
                    aria-label="Close filters"
                >
                    <CgClose />
                </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                <div className="space-y-4 pb-4">{children}</div>
            </div>
            {footer ? (
                <div className="jt-mobile-sheet-footer px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
                    {footer}
                </div>
            ) : null}
        </div>
    );
}
