"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, IdCard, Mail, User } from "lucide-react";
import CustomFieldsForm from "@/components/CustomFieldsForm";
import type { CustomAnswers, CustomField } from "@/lib/customFields";
import {
  type RegistrationDetails,
  normalizeRegistrationDetails,
  trimRegistrationDetails,
} from "@/lib/registrationDetails";

const EMPTY_CUSTOM_ANSWERS: CustomAnswers = {};

interface RegistrationDetailsFormProps {
  initialData: RegistrationDetails;
  onSubmit: (
    data: RegistrationDetails,
    customAnswers?: CustomAnswers
  ) => Promise<void>;
  submitLabel?: string;
  idPrefix?: string;
  customFields?: CustomField[];
  initialCustomAnswers?: CustomAnswers;
  showProfileFields?: boolean;
}

export default function RegistrationDetailsForm({
  initialData,
  onSubmit,
  submitLabel = "Submit",
  idPrefix = "registration",
  customFields = [],
  initialCustomAnswers,
  showProfileFields = true,
}: RegistrationDetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() =>
    normalizeRegistrationDetails(initialData)
  );
  const [customAnswers, setCustomAnswers] = useState<CustomAnswers>(
    () => initialCustomAnswers ?? EMPTY_CUSTOM_ANSWERS
  );
  const [isNonMcGill, setIsNonMcGill] = useState(
    () => Boolean(initialData.school?.trim())
  );

  useEffect(() => {
    const normalized = normalizeRegistrationDetails(initialData);
    setFormData(normalized);
    setIsNonMcGill(Boolean(normalized.school.trim()));
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

  const handleShowNonMcGill = () => {
    setIsNonMcGill(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const trimmed = trimRegistrationDetails(formData);
      await onSubmit(
        {
          ...trimmed,
          school: isNonMcGill ? trimmed.school : "",
        },
        customFields.length > 0 ? customAnswers : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {showProfileFields && (
        <>
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
        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor={`${idPrefix}-mcgillId`}
            className="flex items-center gap-2"
          >
            <IdCard className="h-4 w-4 text-green-700" />
            {isNonMcGill ? "Student ID" : "McGill Student ID"}
            <span className="font-normal text-muted-foreground">(opt.)</span>
          </Label>
          {!isNonMcGill && (
            <button
              type="button"
              onClick={handleShowNonMcGill}
              className="shrink-0 text-xs text-emerald-700 underline-offset-2 hover:underline"
            >
              Not from McGill?
            </button>
          )}
        </div>
        <Input
          id={`${idPrefix}-mcgillId`}
          name="mcgillId"
          value={formData.mcgillId}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={isNonMcGill ? "Your student ID" : "Your McGill ID"}
        />
      </div>

      {isNonMcGill && (
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-school`}
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4 text-green-700" />
            School
            <span className="font-normal text-muted-foreground">(opt.)</span>
          </Label>
          <Input
            id={`${idPrefix}-school`}
            name="school"
            value={formData.school}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your school name"
          />
        </div>
      )}
        </>
      )}

      <CustomFieldsForm
        fields={customFields}
        values={customAnswers}
        onChange={setCustomAnswers}
        idPrefix={`${idPrefix}-custom`}
      />

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
