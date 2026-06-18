import { AtSign, Mail } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-b from-green-100/80 to-white text-gray-700">
      <div className="flex w-full max-w-lg flex-col gap-6 text-green-700">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-green-700/80 text-gray-200 flex size-6 items-center justify-center rounded-md">
            <AtSign className="size-4" />
          </div>
          Green Olive Club
        </Link>

        <Card className="text-green-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="size-6 text-green-700" />
            </div>
            <CardTitle className="text-2xl font-semibold text-green-700">
              Check your email
            </CardTitle>
            <CardDescription className="text-gray-500">
              A sign-in link has been sent to your email address. Click the link
              in the email to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-center text-sm text-gray-500">
              If you don&apos;t see it, check your spam folder. The link expires
              after a short time.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 w-full hover:text-green-700"
            >
              <Link href="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
