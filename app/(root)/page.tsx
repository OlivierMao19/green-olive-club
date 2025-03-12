import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, BookOpen } from "lucide-react"

export default function Home() {

  return (
    <div className="min-h-screen bg-lime-100">
      <Head>
        <title>Green Olive Chinese Christian Club</title>
        <meta name="description" content="Green Olive Chinese Christian Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-between ">
        {/* Main */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-100 to-white min-h-screen bg-lime-100">
          <div className="container mx-auto px-4 py-2">
            <main className="flex flex-col md:flex-row items-center justify-between mt-2 mb-24">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <p className="text-gray-600 italic mb-2">Become a member!</p>
                <h1 className="text-6xl font-bold text-gray-800 mb-6">Welcome to Our<br />Wonderful Club</h1>
                <p className="text-gray-700 text-xl mb-8">
                  YEYEYYEYEYEYEYEY!<br />
                  YEYEYEYEYYEYEYEYYEE
                </p>
                <Link href="/events">
                  <button className="bg-gray-800 mb-32 text-white py-4 px-8 flex items-center hover:bg-gray-600">
                    Register to activities! <span className="ml-2">→</span>
                  </button>
                </Link>
              </div>

              <div className="w-full md:w-1/3 mr:w-1/3 ml:w-1/10">
                <div className="border-8 border-white rounded-lg shadow-lg transform rotate-355">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full"
                  />
                </div>
              </div>
            </main>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          {/*<div className="w-full flex flex-row container px-0 md:px-0 justify-center">*/}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <BookOpen className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Bible Studies</h3>
              <p className="text-gray-600">
                Weekly Bible studies in both English and Chinese to deepen our understanding of God's word.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Users className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Fellowship</h3>
              <p className="text-gray-600">
                Regular social events, meals, and activities to build meaningful relationships.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CalendarDays className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Events</h3>
              <p className="text-gray-600">
                Special events throughout the year including retreats, holiday celebrations, and service projects.
              </p>
            </div>
          </div>
          {/* </div> */}
        </section>

        {/* About Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          {/* <div className="container px-4 md:px-6"> */}
          <div className="flex flex-col items-center space-y-4 text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-800">About Our Club</h2>
            <p className="max-w-[700px] text-gray-600 md:text-xl">
              The Green Olive Chinese Christian Club was founded to provide a spiritual home for Chinese Christians and
              those interested in learning about Christianity. Our name symbolizes peace, growth, and the nurturing of
              faith.
            </p>
            <p className="max-w-[700px] text-gray-600 md:text-xl">
              We welcome people of all backgrounds to join our community as we learn, worship, and serve together.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
          {/* </div> */}
        </section>
        {/* Upcoming event */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          {/* <div className="container px-4 md:px-6"> */}
          <div className="flex flex-col items-center space-y-4 text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-800">Upcoming Event</h2>
            <p className="max-w-[700px] text-gray-600 md:text-xl">
              Join us for our next event to connect with others, grow in faith, and have fun!
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/events">View Event Calendar</Link>
            </Button>
          </div>
          {/* </div> */}
        </section>
        {/* Join us Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          {/* <div className="container px-4 md:px-6"> */}
          <div className="flex flex-col items-center space-y-4 text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-800">Join Our Community</h2>
            <p className="max-w-[700px] text-gray-600 md:text-xl">
              Become a member to participate in activities, receive updates, and connect with other members.
            </p>
            <Button asChild size="lg" className="bg-green-700 hover:bg-green-800">
              <Link href="/register">Register Now</Link>
            </Button>
          </div>
          {/* </div> */}
        </section>
      </div>

    </div>
  );
}
