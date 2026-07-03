const PROVIDER_LABELS: Record<string, string> = {
  github: "GitHub",
  google: "Google",
  resend: "email magic link",
};

export function formatProviderList(providerIds: string[]): string {
  const labels = [
    ...new Set(
      providerIds.map((id) => PROVIDER_LABELS[id] ?? id).filter(Boolean)
    ),
  ];

  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} or ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}`;
}

export function getAccountNotLinkedMessage(providers: string[]): string {
  const providerList = formatProviderList(providers);

  if (providerList) {
    return `An account with this email already exists. Please sign in with ${providerList} instead.`;
  }

  return "An account with this email already exists. Please sign in using the method you originally used.";
}
