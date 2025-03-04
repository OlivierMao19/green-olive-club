import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  return (
    <div className="min-h-screen bg-lime-100">
      <Head>
        <title>Green Olive Chinese Christian Club</title>
        <meta name="description" content="Green Olive Chinese Christian Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-2">
        {/* Header/Navigation */}

        {/* Main Content */}
        <main className="flex flex-col md:flex-row items-center justify-between mt-16 mb-24">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="text-gray-600 italic mb-2">Become a member!</p>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to Our<br />Wonderful Club</h1>
            <p className="text-gray-700 mb-8">
              YEYEYYEYEYEYEYEY!<br />
              YEYEYEYEYYEYEYEYYEE
            </p>
            <Link href="/events">
              <button className="bg-gray-800 text-white py-4 px-8 flex items-center hover:bg-gray-700">
                Register to activities! <span className="ml-2">→</span>
              </button>
            </Link>
          </div>

          <div className="md:w-1/3 relative">
            <div className="border-8 border-white rounded-lg shadow-lg overflow-hidden transform rotate-2">
              <img
                src="/logo.png"
                alt="Music class with students playing various instruments"
                className="w-full"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
