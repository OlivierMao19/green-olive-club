import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import CreateEventForm from './createEventForm';
export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.isAdmin) {
        redirect("/");
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-3xl px-4">
                <h1 className="text-2xl font-bold mb-6 mt-6 text-center">Admin - Create an Event</h1>
                <CreateEventForm />
            </div>
        </div>

    );
}