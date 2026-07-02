"use client"

import toast, { Toaster } from "react-hot-toast";
import RegistrationDetailsForm from "@/components/RegistrationDetailsForm";
import type { RegistrationDetails } from "@/lib/registrationDetails";

interface ProfileFormProps {
    initialData: RegistrationDetails
    onSubmitSuccess?: () => void
}

export default function ProfileForm({ initialData, onSubmitSuccess }: ProfileFormProps) {
    const handleSubmit = async (trimmedData: RegistrationDetails) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedData),
            })

            if (!response.ok) throw new Error('Failed to update')

            toast.success("Successfully Updated!")

            if (onSubmitSuccess) {
                onSubmitSuccess()
            }

        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
        }
    }

    return (
        <>
            <Toaster />
            <RegistrationDetailsForm
                initialData={initialData}
                onSubmit={handleSubmit}
                submitLabel="Save Profile"
                idPrefix="profile"
            />
        </>
    )
}
