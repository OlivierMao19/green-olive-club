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
            <LoaderIcon className="animate-spin h-16 w-16 text-emerald-700" />
        </div>
    }


    return (
        <div className="site-shell py-8 md:py-10">
            <div className="section-shell">
                <h1 className="mb-8 text-center text-3xl font-bold tracking-tighter text-emerald-900 sm:text-4xl">Your Profile</h1>

                <div className="mb-6 space-y-3 p-5 bg-white/75 border border-emerald-100 rounded-xl shadow-sm w-full max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-700" />
                        <p className="text-sm font-medium text-emerald-900/80">
                            <span className="text-emerald-900/60">Name:</span> {profileData.name || "Not provided"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-700" />
                        <p className="text-sm font-medium text-emerald-900/80">
                            <span className="text-emerald-900/60">Email:</span> {profileData.email || "Not provided"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <IdCard className="h-4 w-4 text-emerald-700" />
                        <p className="text-sm font-medium text-emerald-900/80">
                            <span className="text-emerald-900/60">McGill ID:</span> {profileData.mcgillId || "Not provided"}
                        </p>
                    </div>
                </div>

                <Card className="w-full max-w-2xl mx-auto border-emerald-100/80 bg-white/90">
                    <CardHeader>
                        <CardTitle className="text-xl text-emerald-900">Personal Information</CardTitle>
                        <CardDescription>Update your profile information below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm initialData={profileData} onSubmitSuccess={refreshProfile} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
