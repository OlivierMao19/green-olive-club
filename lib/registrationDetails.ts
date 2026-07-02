export type RegistrationDetails = {
  name: string;
  email: string;
  mcgillId: string;
};

export function trimRegistrationDetails(
  details: RegistrationDetails
): RegistrationDetails {
  return {
    name: details.name.trim(),
    email: details.email.trim().toLowerCase(),
    mcgillId: details.mcgillId.trim(),
  };
}

export function hasCompleteRegistrationDetails(
  details: Partial<RegistrationDetails> | null | undefined
): details is RegistrationDetails {
  return Boolean(
    details?.name?.trim() &&
      details?.email?.trim() &&
      details?.mcgillId?.trim()
  );
}
