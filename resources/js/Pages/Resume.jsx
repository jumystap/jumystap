import GuestLayout from "@/Layouts/GuestLayout";
import { IoStar } from "react-icons/io5";

export default function Resume({user, resume}){

    return(
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="mt-10 col-span-5 px-5">
                    <div className='flex gap-x-5'>
                        <div>
                            <img
                                src={`/storage/${resume.photo_path}`}
                                className='w-[100px] h-[100px] rounded-full object-cover'
                            />
                        </div>
                        <div>
                            <div className='text-xl'>{user.name}</div>
                            <div className='text-gray-500'>{user.email}</div>
                            <div className=''>{resume.city} {resume.district && `, район ${resume.district}`}</div>
                        </div>
                    </div>
                    <div>
                        <div className='md:text-xl text-lg mt-5 text-gray-500'>Опыт работы (2 года 10 месяцев)</div>
                        {resume.organizations.length > 0 ? (
                            <div className='mt-4 px-5 py-3 border border-gray-200 rounded-lg'>
                                {resume.organizations.map((organization, index) => (
                                    <div>
                                        <div className='text-sm'>{organization.organization}</div>
                                        <div className='text-2xl'>{organization.position_name}</div>
                                        <div>{organization.period}</div>
                                    </div>
                                ))}
                            </div>
                        ):(
                            <div>Нет опыта работы</div>
                        )}
                        <div className='md:text-xl text-lg mt-5 text-gray-500'>Ключевые навыки</div>
                        <div className='gap-2 flex flex-wrap mt-4'>
                            {resume.skills.map((skill, index) => (
                                <div className='py-1 px-5 bg-gray-100 text-gray-500 inline-block rounded-full'>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="md:block hidden border-l border-gray-200 h-screen sticky top-0 col-span-2">
                </div>
            </div>
        </GuestLayout>
    )
}

