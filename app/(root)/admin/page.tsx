import { auth } from '@/auth'
import { redirect } from 'next/navigation';
export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.isAdmin) {
        redirect("/");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">📅 Admin - Create an Event</h1>
            {/* Add your create event form here */}
        </div>
    );
}