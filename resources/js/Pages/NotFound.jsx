import GuestLayout from "@/Layouts/GuestLayout";

export default function NotFound() {
    return (
        <GuestLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="font-semibold text-2xl text-center">
                    <h1>Запрашиваемая информация не найдена!</h1>
                </div>
            </div>
        </GuestLayout>
    );
}

