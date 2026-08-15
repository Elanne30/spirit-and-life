"use server";

import { submitContactMessage, type ContactSubmissionResult } from "@/app/lib/contact";

export type ContactFormState = ContactSubmissionResult | { status: "idle"; message: string };

export async function submitContactFormAction(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  return submitContactMessage({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  });
}