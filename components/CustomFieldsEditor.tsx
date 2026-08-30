"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  type CustomField,
  type CustomFieldType,
  createCustomField,
} from "@/lib/customFields";

interface CustomFieldsEditorProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: "Short text",
  textarea: "Long text",
  select: "Dropdown",
};

export default function CustomFieldsEditor({
  fields,
  onChange,
}: CustomFieldsEditorProps) {
  function addDraftField() {
    onChange([
      ...fields,
      createCustomField({ label: "", type: "text", required: false }),
    ]);
  }

  function updateField(index: number, updates: Partial<CustomField>) {
    onChange(
      fields.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...updates } : field
      )
    );
  }

  function removeField(index: number) {
    onChange(fields.filter((_, fieldIndex) => fieldIndex !== index));
  }

  function moveField(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const nextFields = [...fields];
    const [movedField] = nextFields.splice(index, 1);
    nextFields.splice(targetIndex, 0, movedField);
    onChange(nextFields);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-emerald-900">
          Additional registration fields
        </h3>
        <p className="mt-1 text-sm text-emerald-900/65">
          Ask attendees for extra information when they register, such as
          dietary restrictions or shirt size. Fields are saved when you create
          or update the event.
        </p>
      </div>

      {fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-3 rounded-lg border border-emerald-100 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`custom-field-label-${field.id}`}>
                      Field label
                    </Label>
                    <Input
                      id={`custom-field-label-${field.id}`}
                      value={field.label}
                      onChange={(e) =>
                        updateField(index, { label: e.target.value })
                      }
                      placeholder="e.g. Dietary restrictions"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`custom-field-type-${field.id}`}>
                        Field type
                      </Label>
                      <select
                        id={`custom-field-type-${field.id}`}
                        value={field.type}
                        onChange={(e) => {
                          const type = e.target.value as CustomFieldType;
                          updateField(index, {
                            type,
                            options:
                              type === "select"
                                ? field.options ?? ["Option 1"]
                                : undefined,
                          });
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 pt-8 text-sm text-emerald-900">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, { required: e.target.checked })
                        }
                        className="rounded border-emerald-300"
                      />
                      Required
                    </label>
                  </div>

                  {field.type === "select" && (
                    <div className="space-y-2">
                      <Label htmlFor={`custom-field-options-${field.id}`}>
                        Options (one per line)
                      </Label>
                      <Textarea
                        id={`custom-field-options-${field.id}`}
                        value={(field.options ?? []).join("\n")}
                        onChange={(e) =>
                          updateField(index, {
                            options: e.target.value
                              .split("\n")
                              .map((option) => option.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder={"Vegetarian\nVegan\nGluten-free\nNone"}
                        className="min-h-[90px]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveField(index, -1)}
                    disabled={index === 0}
                    aria-label="Move field up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveField(index, 1)}
                    disabled={index === fields.length - 1}
                    aria-label="Move field down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => removeField(index)}
                    aria-label="Remove field"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="rounded-full border-emerald-200"
        onClick={addDraftField}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add field
      </Button>
    </div>
  );
}
