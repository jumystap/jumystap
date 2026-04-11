import { CgClose } from "react-icons/cg";

export default function MobileFilterSheet({ title, onClose, children }) {
    return (
        <div className="jt-mobile-sheet fixed left-0 top-0 z-40 h-screen w-full bg-white px-5 py-7 md:hidden">
            <div className="flex w-full items-center">
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
            <div className="mt-5 space-y-4 overflow-y-auto pb-8">{children}</div>
        </div>
    );
}
