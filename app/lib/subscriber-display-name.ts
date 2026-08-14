export type SubscriberIdentity = {
  name?: string | null;
  email?: string | null;
};

function titleCase(value: string) {
  return value
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

export function getSubscriberDisplayName(subscriber: SubscriberIdentity) {
  const storedName = subscriber.name?.trim();
  if (storedName) return storedName;

  const email = subscriber.email?.trim();
  if (!email) return "Subscriber";

  const localPart = (email.split("@")[0] ?? "").split(/\d/, 1)[0] ?? "";
  const words = localPart.match(/[a-zA-Z]{2,}/g) ?? [];
  if (words.length === 1 && words[0].length > 14) return email;
  const derived = words.slice(0, 2).map(titleCase).join(" ");

  return derived || email;
}