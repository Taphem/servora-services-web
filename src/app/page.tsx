import { redirect } from "next/navigation";

/**
 * This app's content starts at /services — root-level browsing/landing
 * content belongs to servora-web. A standalone deploy of this app should
 * still resolve to something useful rather than a blank page.
 */
export default function RootPage() {
  redirect("/services");
}
