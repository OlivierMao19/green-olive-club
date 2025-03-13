import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function EventPage({ params }: { params: { eventId: string } }) {
    const { eventId } = await Promise.resolve(params);
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    return (
        <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 sm:w-full mt-6">
            <Card className="h-[75svh]">
                <CardContent className="flex flex-col items-between justify-center py-12 space-y-10">
                    <h1 className="text-3xl font-bold">{event.title}</h1>
                    <p className="text-gray-600 mt-2">Description: </p>
                    <p>{event.description}</p>
                    <p className="text-gray-500 mt-4">
                        Location: {event.location}
                    </p>
                    <p className="text-gray-500 mt-4">
                        Scheduled At: {new Date(event.scheduledAt).toLocaleString()}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}