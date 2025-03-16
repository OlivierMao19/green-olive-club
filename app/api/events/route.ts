import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const { title, description, location, scheduledAt } = await req.json();
        const parsedDate = new Date(scheduledAt)
        const event = await prisma.event.create({
            data: {
                title,
                description,
                location,
                scheduledAt: parsedDate,
            },
        })
        return NextResponse.json({ message: "Event created", event }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}