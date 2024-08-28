import ApplicationLogo from "@/Components/ApplicationLogo";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const isActive = (path) => {
        return url === path || (path !== '/admin' && url.startsWith(path));
    };

    const getBreadcrumbs = () => {
        if (url === '/admin') return 'Главная страница / Аналитика';
        if (url.startsWith('/admin/employers')) return 'Обьекты / Работодатели';
        if (url.startsWith('/admin/companies')) return 'Обьекты / Заказчики';
        if (url.startsWith('/admin/employees')) return 'Обьекты / Выпускники';
        if (url.startsWith('/admin/announcements')) return 'Обьекты / Обьявления';
        if (url.startsWith('/admin/professions')) return 'Справочники / Професии';
        return 'Главная страница';
    };

    return (
        <div className="flex w-full">
            <div className="w-[20%] border-r border-gray-300 min-h-screen h-full">
                <div className="flex items-center px-5 h-[70px] border-b border-gray-300 w-full">
                    <ApplicationLogo />
                </div>
                <div className="h-[93%] px-5 py-5 w-full">
                    <Link
                        href="/admin"
                        className={`block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                            isActive('/admin') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                        }`}
                    >
                        Главная страница
                    </Link>
                    <div className="w-full border-t border-gray-300 py-3 mt-3">
                        <div className="text-sm text-gray-500">Обьекты</div>
                        <Link
                            href="/admin/employers"
                            className={`mt-2 block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                                isActive('/admin/employers') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            Работодатели
                        </Link>
                        <Link
                            href="/admin/companies"
                            className={`mt-2 block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                                isActive('/admin/companies') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            Заказчики
                        </Link>
                        <Link
                            href="/admin/employees"
                            className={`mt-2 block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                                isActive('/admin/employees') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            Выпускники
                        </Link>
                        <Link
                            href="/admin/certificates"
                            className={`mt-2 block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                                isActive('/admin/certificates') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            Сертификаты
                        </Link>
                        <Link
                            href="/admin/announcements"
                            className={`mt-2 block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                                isActive('/admin/announcements') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            Обьявления
                        </Link>
                    </div>
                    <div className="w-full border-t border-gray-300 py-3 mt-3">
                        <div className="text-sm text-gray-500">Справочники</div>
                        <Link
                            href="/admin/professions"
                            className={`mt-2 block py-2 px-4 text-sm w-full font-semibold rounded-lg ${
                                isActive('/admin/professions') ? 'bg-[#f36706] text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            Професии
                        </Link>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex w-full border-b items-center h-[70px] px-10 border-gray-300">
                    <div className="font-semibold">
                        {getBreadcrumbs()}
                    </div>
                    <div
                        className="ml-auto font-semibold cursor-pointer relative"
                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                    >
                        Admin
                        {showAdminMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <a
                                    href="admin/logout"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-[#f3f4f6] py-10 px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
