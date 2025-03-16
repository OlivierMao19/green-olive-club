"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, IdCard } from "lucide-react"
import toast, { Toaster } from "react-hot-toast";

interface ProfileFormProps {
    initialData: {
        name: string
        email: string
        mcgillId: string
    }
    onSubmitSuccess?: () => void
}

export default function ProfileForm({ initialData, onSubmitSuccess }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(initialData)
    //const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // In profile-form.tsx
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const trimmedData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            mcgillId: formData.mcgillId.trim()
        }

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedData),
            })

            if (!response.ok) throw new Error('Failed to update')

            // Handle success
            /*toast({
                title: "Profile updated",
                description: "Your profile information has been successfully updated.",
            })*/
            toast.success("Successfully Updated!")

            if (onSubmitSuccess) {
                onSubmitSuccess()
            }

        } catch (error) {
            // Handle error
            console.error("Error updating profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <><Toaster /><form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-700" />
                    Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    onBlur={(e) => {
                        e.target.value = e.target.value.trim()
                        setFormData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))
                    }} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-700" />
                    Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                    onBlur={(e) => {
                        e.target.value = e.target.value.trim()
                        setFormData(prev => ({
                            ...prev,
                            email: e.target.value
                        }))
                    }} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="mcgillId" className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-green-700" />
                    McGill ID
                </Label>
                <Input
                    id="mcgillId"
                    name="mcgillId"
                    type="mcgillId"
                    value={formData.mcgillId}
                    onChange={handleChange}
                    placeholder="Your mcgill ID"
                    required
                    onBlur={(e) => {
                        e.target.value = e.target.value.trim()
                        setFormData(prev => ({
                            ...prev,
                            mcgillId: e.target.value
                        }))
                    }} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800 cursor-pointer">
                    {isLoading ? "Saving..." : "Save Profile"}
                </Button>
            </div>
        </form></>
    )
}

