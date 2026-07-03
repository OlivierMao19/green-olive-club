"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, IdCard } from "lucide-react";
import {
  type RegistrationDetails,
  normalizeRegistrationDetails,
  trimRegistrationDetails,
} from "@/lib/registrationDetails";

interface RegistrationDetailsFormProps {
  initialData: RegistrationDetails;
  onSubmit: (data: RegistrationDetails) => Promise<void>;
  submitLabel?: string;
  idPrefix?: string;
}

export default function RegistrationDetailsForm({
  initialData,
  onSubmit,
  submitLabel = "Submit",
  idPrefix = "registration",
}: RegistrationDetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() =>
    normalizeRegistrationDetails(initialData)
  );

  useEffect(() => {
    setFormData(normalizeRegistrationDetails(initialData));
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmed = value.trim();
    e.target.value = trimmed;
    setFormData((prev) => ({
      ...prev,
      [name]: trimmed,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(trimRegistrationDetails(formData));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-name`} className="flex items-center gap-2">
          <User className="h-4 w-4 text-green-700" />
          Name
        </Label>
        <Input
          id={`${idPrefix}-name`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-email`} className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-green-700" />
          Email
        </Label>
        <Input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${idPrefix}-mcgillId`}
          className="flex items-center gap-2"
        >
          <IdCard className="h-4 w-4 text-green-700" />
          McGill ID
        </Label>
        <Input
          id={`${idPrefix}-mcgillId`}
          name="mcgillId"
          value={formData.mcgillId}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your McGill ID"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer bg-green-700 hover:bg-green-800"
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
