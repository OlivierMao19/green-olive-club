"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { ChevronRight, CalendarIcon, Clock, MapPin } from "lucide-react"
import Link from "next/link"
const activities = [
    {
        id: 1,
        title: "Weekly Bible Study",
        description: "Join us as we study the Book of John together.",
        date: new Date(2025, 2, 10, 19, 0),
        location: "Community Center, Room 203",
        type: "bible-study",
        registered: false,
    },
    {
        id: 2,
        title: "Monthly Fellowship Dinner",
        description: "Bring a dish to share as we enjoy food and fellowship together.",
        date: new Date(2025, 2, 15, 18, 30),
        location: "Grace Church Fellowship Hall",
        type: "fellowship",
        registered: false,
    },
    {
        id: 3,
        title: "Prayer Meeting",
        description: "A time to pray for our community, church, and world.",
        date: new Date(2025, 2, 17, 20, 0),
        location: "Online via Zoom",
        type: "prayer",
        registered: false,
    },
    {
        id: 4,
        title: "Community Service Day",
        description: "Volunteering at the local food bank. All members welcome!",
        date: new Date(2025, 2, 22, 9, 0),
        location: "City Food Bank",
        type: "service",
        registered: false,
    },
    {
        id: 5,
        title: "Chinese New Year Celebration",
        description: "Celebrating with traditional food, performances, and games.",
        date: new Date(2025, 2, 28, 17, 0),
        location: "Community Center Main Hall",
        type: "cultural",
        registered: false,
    },
]
export default function events() {
    // Mock data for activities
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [userActivities, setUserActivities] = useState(activities)
    const { toast } = useToast()
    const { user } = useAuth()

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "bible-study":
                return "bg-blue-100 text-blue-800"
            case "fellowship":
                return "bg-green-100 text-green-800"
            case "prayer":
                return "bg-purple-100 text-purple-800"
            case "service":
                return "bg-orange-100 text-orange-800"
            case "cultural":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleRegister = (id: number) => {
        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to register for activities",
                variant: "destructive",
            })
            return
        }

        setUserActivities(
            userActivities.map((activity) =>
                activity.id === id ? { ...activity, registered: !activity.registered } : activity,
            ),
        )

        const activity = userActivities.find((a) => a.id === id)

        toast({
            title: activity?.registered ? "Registration cancelled" : "Successfully registered",
            description: activity?.registered
                ? `You have cancelled your registration for ${activity.title}`
                : `You have registered for ${activity?.title}`,
        })
    }

    const filteredActivities = date
        ? userActivities.filter(
            (activity) =>
                activity.date.getDate() === date.getDate() &&
                activity.date.getMonth() === date.getMonth() &&
                activity.date.getFullYear() === date.getFullYear(),
        )
        : userActivities

    return (
        <div className="container px-4 py-12 md:px-6">
            <h1 className="mb-8 text-center text-3xl font-bold tracking-tighter text-green-800 sm:text-4xl">
                Club Activities
            </h1>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Calendar</CardTitle>
                                <CardDescription>Select a date to view activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" onClick={() => setDate(new Date())} className="w-full">
                                    Reset to Today
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Types</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Bible Study</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Fellowship</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Prayer</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Service</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cultural</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-green-700">
                            {date ? `Activities for ${formatDate(date)}` : "All Upcoming Activities"}
                        </h2>
                        {user && user.isAdmin && (
                            <Button asChild>
                                <Link href="/activities/create">Create Activity</Link>
                            </Button>
                        )}
                    </div>

                    {filteredActivities.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <CalendarIcon className="mb-4 h-12 w-12 text-gray-400" />
                                <p className="text-center text-lg text-gray-600">No activities scheduled for this date</p>
                                <Button variant="outline" onClick={() => setDate(undefined)} className="mt-4">
                                    View All Activities
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {filteredActivities.map((activity) => (
                                <Card key={activity.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl text-green-800">{activity.title}</CardTitle>
                                                <CardDescription className="mt-1">{activity.description}</CardDescription>
                                            </div>
                                            <Badge className={getTypeColor(activity.type)}>
                                                {activity.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formatDate(activity.date)}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {formatTime(activity.date)}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                {activity.location}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" asChild>
                                            <Link href={`/activities/${activity.id}`}>
                                                Details <ChevronRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleRegister(activity.id)}
                                            variant={activity.registered ? "destructive" : "default"}
                                            className={activity.registered ? "" : "bg-green-700 hover:bg-green-800"}
                                        >
                                            {activity.registered ? "Cancel Registration" : "Register"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
