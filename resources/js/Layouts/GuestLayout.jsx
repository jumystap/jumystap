import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { IoChatbubblesOutline } from "react-icons/io5";
import {
  CgClose,
  CgMenuRight,
  CgShoppingBag,
  CgChevronDown,
} from "react-icons/cg";
import { Head, Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { HiOutlineHome, HiOutlineUserGroup } from "react-icons/hi2";
import { RiHome2Line } from "react-icons/ri";
import {
  MdOutlineBookmarks,
  MdOutlineCloud,
  MdOutlineGroupAdd,
  MdOutlineLogout,
  MdOutlineWorkOutline,
} from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";
import { Button, Dropdown, Space } from "antd";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
const items = [
  {
    key: "1",
    label: (
      <Link href="/reviews" className="block py-2 flex items-center">
        Оставить отзыв
      </Link>
    ),
  },
  {
    key: "2",
    label: (
      <Link href="/profile" className="block py-2">
        Профиль
      </Link>
    ),
  },
  {
    key: "3",
    label: (
      <Link href="/fav" className="block py-2">
        Избранные
      </Link>
    ),
  },
  {
    key: "4",
    label: (
      <Link href="/about" className="block py-2">
        О платформе
      </Link>
    ),
  },
];

export default function Guest({ children }) {
  const { t, i18n } = useTranslation();
  const { auth, url } = usePage().props;
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [source, setSource] = useState("");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  useEffect(() => {
    let savedLanguage = localStorage.getItem("i18nextLng") || "ru";
    if (savedLanguage !== "ru" && savedLanguage !== "kz") {
      savedLanguage = "ru";
    }
    i18n.changeLanguage(savedLanguage);

    const params = new URLSearchParams(location.search);
    const sourceParam = params.get("source") || "";
    if (sourceParam != "") {
      setSource(sourceParam);
      localStorage.setItem("source", sourceParam);
    }
  }, [i18n]);

  const handleLogout = () => {
    axios.post("/logout").then(() => {
      window.location.reload();
    });
  };

  const currentPath = new URL(url, window.location.origin);
  console.log(window.location.pathname);
  console.log(currentPath);

  const isActive = (path) => window.location.pathname === path;

  return (
    <>
      <div className="md:hidden block">
        <div className="sticky top-0 bg-white z-20 flex py-5 px-3 items-center">
          <Link
            className={`block ${isActive("/") ? "text-blue-500 font-semibold" : ""}`}
            href="/"
          >
            <img src="/images/Лого.png" className="w-[150px]" />
          </Link>
          <div className="ml-auto flex gap-x-4 items-center">
            <div
              className="items-center gap-1 px-5 py-2 text-sm border rounded-full text-gray-500 border-gray-300 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer"
              onClick={() =>
                changeLanguage(i18n.language === "ru" ? "kz" : "ru")
              }
            >
              {i18n.language == "ru" ? "Рус" : "Қаз"}
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full">
          <div className="bg-white grid grid-cols-4 w-full py-3 px-3">
            <Link
              className={`block flex-col text-center ${isActive("/") ? "text-blue-500" : "text-gray-500"}`}
              href="/"
            >
              <HiOutlineHome className="text-center text-2xl mx-auto" />
              <div className="text-center text-xs">Главная</div>
            </Link>
            <Link
              className={`block flex-col text-center ${isActive("/announcements") ? "text-blue-500" : "text-gray-500"}`}
              href="/announcements"
            >
              <MdOutlineWorkOutline className="mx-auto text-2xl" />
              <div className="text-center text-xs">Объявления</div>
            </Link>
            <Link
              className={`block flex-col text-center ${isActive("/employees") ? "text-blue-500" : "text-gray-500"}`}
              href="/employees"
            >
              <HiOutlineUserGroup className="text-2xl mx-auto" />
              <div className="text-center text-xs">Соискатели</div>
            </Link>
            <Dropdown
              menu={{
                items,
              }}
              placement="top"
              className={`cursor-pointer block flex-col text-center text-gray-500`}
            >
              <div>
                <HiOutlineDotsCircleHorizontal className="text-2xl mx-auto" />
                <div className="text-center text-xs">Еще</div>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className="pb-20">{children}</div>
      </div>
      <div className="md:flex hidden font-regular">
        <div className="mx-auto min-h-[650px] md:w-[1250px] grid grid-cols-9 px-5">
          <div className="sticky top-0 pt-5 items-center col-span-2 h-screen border-r pr-5 border-gray-200">
            <Link
              className={`block ${isActive("/") ? "text-blue-500 font-semibold" : ""}`}
              href="/"
            >
              <ApplicationLogo />
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 font-regular mt-5 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/") ? "text-black" : "text-gray-500"}`}
              href="/"
            >
              <HiOutlineHome className="text-2xl" />
              Главная
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/employees") ? "text-black" : "text-gray-500"}`}
              href="/employees"
            >
              <HiOutlineUserGroup className="text-2xl" />
              {t("nav_for_employers", { ns: "header" })}
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/announcements") ? "text-black" : "text-gray-500"}`}
              href="/announcements"
            >
              <MdOutlineWorkOutline className="text-2xl" />
              Вакансии
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/announcements") ? "text-black" : "text-gray-500"}`}
              href="/chat"
            >
              <IoChatbubblesOutline className="text-2xl" />
              Сообщения
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/about") ? "text-black" : "text-gray-500"}`}
              href="/about"
            >
              <MdOutlineCloud className="text-2xl" />О платформе
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/faq") ? "text-black" : "text-gray-500"}`}
              href="/faq"
            >
              <IoSchoolOutline className="text-2xl" />
              Об обучении
            </Link>
            <Link
              className={`flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/fav") ? "text-black" : "text-gray-500"}`}
              href="/fav"
            >
              <MdOutlineBookmarks className="text-2xl" />
              Избранные
            </Link>
            {!auth.user ? (
              <>
                <Link
                  className="text-center block px-10 mt-10 text-white font-bold py-1 text-lg bg-blue-500 border-[3px] hover:bg-white hover:text-blue-500 transition-all duration-300 border-blue-500 rounded-full"
                  href="/register"
                >
                  {t("register", { ns: "header" })}
                </Link>
                <Link
                  className="text-center hover:bg-blue-500 hover:text-white transition-all duration-300 block w-full mt-3 text-blue-500 font-bold py-1 text-lg border-[3px] border-blue-500 rounded-full"
                  href="/login"
                >
                  Войти
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex gap-x-3 py-3 mt-5 hover:px-3 items-center transition-all duration-300 hover:bg-gray-100 rounded-full"
                >
                  <img
                    src={`/storage/${auth.user.image_url}`}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                  <div className="">
                    <div className="font-bold">{auth.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {auth.user.email}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg flex items-center gap-x-4 mt-2 font-regular transition-all duration-150 py-2 hover:bg-gray-100 w-full text-left rounded-full hover:px-5"
                >
                  <MdOutlineLogout className="text-2xl" />
                  {t("logout", { ns: "header" })}
                </button>
              </>
            )}
            <div></div>
          </div>
          <div className="col-span-7">{children}</div>
        </div>
      </div>
    </>
  );
}
