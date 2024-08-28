import GuestLayout from "@/Layouts/GuestLayout";
import { IoStar } from "react-icons/io5";

export default function About(){
    return(
        <GuestLayout>
            <div className="grid md:grid-cols-2 grid-cols-1 mt-5">
                <div className="mt-10">
                    <div className="font-semibold text-3xl">JUMYSTAP.KZ - бесплатная площадка <br/>для <span className="border-b-[3px] border-orange-500">поиска сотрудников и вакансий!</span></div>
                    <div className="font-bold inline-block text-white bg-orange-500 rounded-lg px-5 py-2 text-lg mt-7">Для работодателей и заказчиков</div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Бесплатная подача объявлений
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Как вакансии, так и заказы на объем
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Простая регистрация
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Обученные соискатели с подтвержденным сертификатами
                    </div>
                    <div className="font-bold inline-block text-white bg-orange-500 rounded-lg px-5 py-2 text-lg mt-7">Для соискателей и выпускников JOLTAP</div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Удобное размещение портфолио
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Прямая связь через WhatsApp
                    </div>
                    <div className="flex items-center text-lg gap-x-3 mt-4">
                        <IoStar className="fixed-s text-2xl text-white bg-orange-500 p-1 rounded" />
                        Постоянная работа или заказы на объем: выбирайте что нужно Вам!
                    </div>
                </div>
                <div className="flex md:mt-[0px] mt-10">
                    <img src="/images/banner.png" className="mx-auto my-auto w-[300px]"/>
                </div>
            </div>
        </GuestLayout>
    )
}
