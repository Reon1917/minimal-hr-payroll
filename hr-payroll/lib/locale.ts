import { cookies } from "next/headers";
import en from "@/messages/en.json";
import th from "@/messages/th.json";
import type { Locale } from "@/lib/format";

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("locale")?.value === "th" ? "th" : "en";
}

export async function getMessages() {
  const locale = await getLocale();
  return { locale, messages: locale === "th" ? th : en };
}

