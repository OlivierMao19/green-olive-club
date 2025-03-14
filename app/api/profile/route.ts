import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id && !session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id || undefined,
                email: session.user.email || undefined,
            }, select: {
                name: true,
                email: true,
                mcgillId: true,
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        return NextResponse.json(user)
    } catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()

        const updatedUser = await prisma.user.update({
            where: {
                id: session!.user!.id
            }, data: {
                name: data.name, email: data.email, mcgillId: data.mcgillId,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating profile", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}