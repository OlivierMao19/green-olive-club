"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CustomAnswers, CustomField } from "@/lib/customFields";

interface CustomFieldsFormProps {
  fields: CustomField[];
  values: CustomAnswers;
  onChange: (values: CustomAnswers) => void;
  idPrefix?: string;
}

export default function CustomFieldsForm({
  fields,
  values,
  onChange,
  idPrefix = "custom-field",
}: CustomFieldsFormProps) {
  if (fields.length === 0) {
    return null;
  }

  function handleChange(fieldId: string, value: string) {
    onChange({
      ...values,
      [fieldId]: value,
    });
  }

  function handleBlur(fieldId: string, value: string) {
    onChange({
      ...values,
      [fieldId]: value.trim(),
    });
  }

  return (
    <div className="space-y-4">
      {fields.length > 0 && (
        <div className="border-t border-emerald-100 pt-4">
          <p className="mb-4 text-sm font-medium text-emerald-900">
            Additional information
          </p>
        </div>
      )}

      {fields.map((field) => {
        const fieldId = `${idPrefix}-${field.id}`;
        const value = values[field.id] ?? "";

        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {!field.required && (
                <span className="font-normal text-muted-foreground"> (opt.)</span>
              )}
            </Label>

            {field.type === "textarea" ? (
              <Textarea
                id={fieldId}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(field.id, e.target.value)
                }
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) =>
                  handleBlur(field.id, e.target.value)
                }
                placeholder={`Enter ${field.label.toLowerCase()}`}
                required={field.required}
                className="min-h-[100px]"
              />
            ) : field.type === "select" ? (
              <select
                id={fieldId}
                value={value}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">
                  {field.required ? "Select an option" : "None"}
                </option>
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={fieldId}
                value={value}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={(e) => handleBlur(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                required={field.required}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
