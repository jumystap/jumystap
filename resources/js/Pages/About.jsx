import GuestLayout from "@/Layouts/GuestLayout";
import { IoStar } from "react-icons/io5";

export default function About(){
    return(
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="mt-10 col-span-5 px-5">
                    <div className="font-semibold text-3xl">JUMYSTAP.KZ - бесплатная площадка <br/>для <span className="border-b-[3px] border-blue-500">поиска сотрудников и вакансий!</span></div>
                    <div className="font-bold inline-block text-white bg-blue-500 rounded-lg px-5 py-2 text-lg mt-7">Для работодателей и заказчиков</div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Бесплатная подача объявлений
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Как вакансии, так и заказы на объем
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Простая регистрация
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Обученные соискатели с подтвержденным сертификатами
                    </div>
                    <div className="font-bold inline-block text-white bg-blue-500 rounded-lg px-5 py-2 text-lg mt-7">Для соискателей и выпускников JOLTAP</div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Удобное размещение портфолио
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Прямая связь через WhatsApp
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-blue-500 p-1 rounded" />
                        Постоянная работа или заказы на объем: выбирайте что нужно Вам!
                    </div>
                </div>
                <div className="md:block hidden border-l border-gray-200 h-screen sticky top-0 col-span-2">
                </div>
            </div>
        </GuestLayout>
    )
}
