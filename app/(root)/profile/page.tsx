"use client"

import { useState, useEffect } from "react"
import ProfileForm from "./profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IdCard, LoaderIcon, Mail, User } from "lucide-react"

export default function ProfilePage() {
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        mcgillId: ""
    });

    const [loading, setLoading] = useState(true);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshProfile = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/profile');
                const data = await response.json();
                setProfileData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setLoading(false);
            }
        }
        fetchProfile();
    }, [refreshTrigger]);

    if (loading) {
        return <div className="flex justify-center items-center w-full py-24">
            <LoaderIcon className="animate-spin h-16 w-16 text-green-700" />
        </div>
    }


    return (
        <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 sm:w-full">
            <h1 className="mb-8 text-center text-3xl font-bold tracking-tighter text-green-800 sm:text-4xl">Your Profile</h1>

            <div className="mb-6 space-y-3 p-5 bg-green-50 border border-green-100 rounded-lg shadow-sm w-full max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-700" />
                    <p className="text-sm font-medium text-gray-700">
                        <span className="text-gray-500">Name:</span> {profileData.name || "Not provided"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-700" />
                    <p className="text-sm font-medium text-gray-700">
                        <span className="text-gray-500">Email:</span> {profileData.email || "Not provided"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-green-700" />
                    <p className="text-sm font-medium text-gray-700">
                        <span className="text-gray-500">McGill ID:</span> {profileData.mcgillId || "Not provided"}
                    </p>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl text-green-800">Personal Information</CardTitle>
                    <CardDescription>Update your profile information below</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm initialData={profileData} onSubmitSuccess={refreshProfile} />
                </CardContent>
            </Card>
        </div>
    )
}

