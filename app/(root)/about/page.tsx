import { executivesList } from "@/lib/consts";
import Image from "next/image";
import Link from "next/link";

export default function about() {
  return (
    <div className="relative flex flex-col text-gray-800">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-200/70 to-white">
        <div className="container px-8 py-4 mx-auto">
          <h1 className="text-5xl flex justify-center p-1 mt-5 text-center font-bold about-heading">
            About Us
          </h1>
          <h1 className="text-4xl flex justify-center p-1 text-center about-heading">
            Green Olive Chinese Christian Club
          </h1>
          <div className="flex justify-center mt-8">
            <Image
              src="/bigLogo.png"
              alt="bigLogo"
              width={300}
              height={400}
              className="max-w-[300px] md:max-w-[350px] lg:max-w-[400px] z-10"
            />
          </div>
        </div>
        <p className="text-2xl flex justify-center p-3 italic px-8 about-heading">
          Welcome to Green Olive Chinese Christian Club!
        </p>
      </section>

      <section className="space-y-8 px-8 md:px-12">
        <h2 className="mb-4 text-2xl font-bold text-green-700">Our Mission</h2>
        <p className="text-gray-600">
          The Green Olive Chinese Christian Club exists to provide a welcoming
          community where Chinese Christians and those interested in
          Christianity can grow in their faith, build meaningful relationships,
          and serve others together.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-green-700">Our Vision</h2>
        <p className="text-gray-600">
          We envision a community where members are equipped to live out their
          faith in daily life, support one another through life&apos;s
          challenges, and share God&apos;s love with the broader community.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-green-700">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>
            <span className="font-semibold">Spiritual Health:</span>{" "}
            Strengthening our faith through Bible studies, worship, and
            meaningful discussions.
          </li>
          <li>
            <span className="font-semibold">Mental Health:</span> Encouraging
            mindfulness, emotional well-being, and personal growth through
            workshops and support.
          </li>
          <li>
            <span className="font-semibold">Physical Health:</span> Promoting an
            active lifestyle with fun group activities and recreational events.
          </li>
        </ul>
      </section>

      <section className="w-full py-8 md:py-12 px-8 md:px-12">
        <h2 className="mb-4 text-2xl font-bold text-green-700">
          Leadership Team
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {executivesList.map((executive) => (
            <div className="rounded-lg bg-green-100/50 p-6 border border-green-100">
              <Link href="/executives">
                <h3 className="mb-2 text-xl font-semibold text-green-800">
                  {executive.name}
                </h3>
              </Link>
              <p className="text-gray-600">{executive.role}</p>
            </div>
          ))}

          <div className="rounded-lg bg-green-100/50 p-6 border border-green-100">
            <Link href="/executives">
              <h3 className="mb-2 text-xl font-semibold text-green-800">
                See all →
              </h3>
            </Link>
            <p className="text-gray-600">Our board team</p>
          </div>
        </div>
      </section>
    </div>
  );
}
