export type CustomFieldType = "text" | "textarea" | "select";

export type CustomField = {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
};

export type CustomAnswers = Record<string, string>;

const FIELD_TYPES: CustomFieldType[] = ["text", "textarea", "select"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFieldType(value: unknown): value is CustomFieldType {
  return typeof value === "string" && FIELD_TYPES.includes(value as CustomFieldType);
}

export function createCustomField(
  partial: Pick<CustomField, "label" | "type"> &
    Partial<Pick<CustomField, "required" | "options">>
): CustomField {
  return {
    id: crypto.randomUUID(),
    label: partial.label.trim(),
    type: partial.type,
    required: partial.required ?? false,
    options:
      partial.type === "select"
        ? (partial.options ?? []).map((option) => option.trim()).filter(Boolean)
        : undefined,
  };
}

export function parseCustomFields(value: unknown): CustomField[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const fields: CustomField[] = [];

  for (const item of value) {
    if (!isRecord(item)) continue;

    const id = typeof item.id === "string" ? item.id.trim() : "";
    const label = typeof item.label === "string" ? item.label.trim() : "";
    const type = item.type;
    const required = item.required === true;

    if (!id || !label || !isFieldType(type)) {
      continue;
    }

    const field: CustomField = { id, label, type, required };

    if (type === "select" && Array.isArray(item.options)) {
      const options = item.options
        .filter((option): option is string => typeof option === "string")
        .map((option) => option.trim())
        .filter(Boolean);

      if (options.length === 0) {
        continue;
      }

      field.options = options;
    }

    fields.push(field);
  }

  return fields;
}

export function sanitizeCustomFieldsForSave(value: unknown): CustomField[] {
  return parseCustomFields(value).map((field) => ({
    ...field,
    label: field.label.trim(),
    options:
      field.type === "select"
        ? field.options?.map((option) => option.trim()).filter(Boolean)
        : undefined,
  }));
}

export function hasCustomFields(fields: CustomField[] | unknown): boolean {
  return parseCustomFields(fields).length > 0;
}

export function normalizeCustomAnswers(
  answers: CustomAnswers | null | undefined
): CustomAnswers {
  if (!answers) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(answers)
      .filter(([key, value]) => key.trim() && typeof value === "string")
      .map(([key, value]) => [key.trim(), value.trim()])
  );
}

export type CustomAnswersValidationResult =
  | { valid: true; answers: CustomAnswers }
  | { valid: false; message: string };

export function validateCustomAnswers(
  fields: CustomField[],
  answers: CustomAnswers | null | undefined
): CustomAnswersValidationResult {
  const normalized = normalizeCustomAnswers(answers);
  const sanitizedFields = sanitizeCustomFieldsForSave(fields);

  for (const field of sanitizedFields) {
    const value = normalized[field.id] ?? "";

    if (field.required && !value) {
      return {
        valid: false,
        message: `"${field.label}" is required`,
      };
    }

    if (!value) {
      continue;
    }

    if (field.type === "select" && field.options && !field.options.includes(value)) {
      return {
        valid: false,
        message: `Invalid option for "${field.label}"`,
      };
    }
  }

  const allowedIds = new Set(sanitizedFields.map((field) => field.id));
  const filteredAnswers = Object.fromEntries(
    Object.entries(normalized).filter(([fieldId]) => allowedIds.has(fieldId))
  );

  return { valid: true, answers: filteredAnswers };
}
