"use server";

import { subscribeToNewsletter } from "@/app/lib/newsletter";

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function subscribeNewsletterAction(_previousState: NewsletterFormState, formData: FormData): Promise<NewsletterFormState> {
  const email = String(formData.get("email") ?? "");
  const result = await subscribeToNewsletter(email);

  return {
    status: result.status,
    message: result.message,
  };
}