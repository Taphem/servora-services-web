import { redirect } from "next/navigation";
import { servicePath } from "@/lib/env";

/**
 * This app's content starts at its mount path (see env.basePath /
 * NEXT_PUBLIC_BASE_PATH) — root-level browsing/landing content belongs
 * to servora-web. A standalone deploy of this app should still resolve
 * to something useful rather than a blank page.
 */
export default function RootPage() {
  redirect(servicePath());
}
