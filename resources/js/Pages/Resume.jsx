import GuestLayout from "@/Layouts/GuestLayout";
import { IoStar } from "react-icons/io5";

export default function Resume({user, resume}){
    return(
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="mt-10 col-span-5 px-5">
                </div>
                <div className="md:block hidden border-l border-gray-200 h-screen sticky top-0 col-span-2">
                </div>
            </div>
        </GuestLayout>
    )
}

