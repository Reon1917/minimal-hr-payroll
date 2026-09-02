import "server-only";

import { cookies } from "next/headers";
import type { Locale } from "@/lib/format";

const englishLoaders = {
  nav: () => import("@/messages/en/nav.json").then((module) => module.default),
  common: () => import("@/messages/en/common.json").then((module) => module.default),
  dashboard: () => import("@/messages/en/dashboard.json").then((module) => module.default),
  employees: () => import("@/messages/en/employees.json").then((module) => module.default),
  leave: () => import("@/messages/en/leave.json").then((module) => module.default),
  payroll: () => import("@/messages/en/payroll.json").then((module) => module.default),
  admins: () => import("@/messages/en/admins.json").then((module) => module.default),
  auth: () => import("@/messages/en/auth.json").then((module) => module.default),
};

type MessageCatalog = {
  [Namespace in keyof typeof englishLoaders]: Awaited<ReturnType<(typeof englishLoaders)[Namespace]>>;
};
export type MessageNamespace = keyof MessageCatalog;

const loaders: Record<Locale, { [Namespace in MessageNamespace]: () => Promise<MessageCatalog[Namespace]> }> = {
  en: englishLoaders,
  th: {
    nav: () => import("@/messages/th/nav.json").then((module) => module.default),
    common: () => import("@/messages/th/common.json").then((module) => module.default),
    dashboard: () => import("@/messages/th/dashboard.json").then((module) => module.default),
    employees: () => import("@/messages/th/employees.json").then((module) => module.default),
    leave: () => import("@/messages/th/leave.json").then((module) => module.default),
    payroll: () => import("@/messages/th/payroll.json").then((module) => module.default),
    admins: () => import("@/messages/th/admins.json").then((module) => module.default),
    auth: () => import("@/messages/th/auth.json").then((module) => module.default),
  },
};

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("locale")?.value === "th" ? "th" : "en";
}

export async function getMessages<const Namespaces extends readonly MessageNamespace[]>(...namespaces: Namespaces) {
  const locale = await getLocale();
  const entries = await Promise.all(namespaces.map(async (namespace) => [namespace, await loaders[locale][namespace]()] as const));
  return {
    locale,
    messages: Object.fromEntries(entries) as Pick<MessageCatalog, Namespaces[number]>,
  };
}
