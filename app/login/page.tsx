import { AtSign } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect("/")
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-b from-green-100/80 to-white text-gray-700">
      <div className="flex w-full max-w-lg flex-col gap-6 text-green-700">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-green-700/80 text-gray-200 flex size-6 items-center justify-center rounded-md">
            <AtSign className="size-4" />
          </div>
          Green Olive Club
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}

