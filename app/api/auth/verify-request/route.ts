import { redirect } from "next/navigation"

export function GET() {
  redirect("/login/verify-request")
}
