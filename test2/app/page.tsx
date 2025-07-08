import { redirect } from "next/navigation";
import { useAuthStore } from "./auth-store";

export default function Home() {
  // This is a server component, so we can't use hooks directly
  // Instead, redirect to login
  redirect("/login");
}
