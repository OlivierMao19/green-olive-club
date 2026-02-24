import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ContactRound,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { auth } from "@/auth";
import HomeRegisterButton from "@/components/HomeRegisterButton";
import CustomHomeButton from "@/components/CustomHomeButton";
import AnimatedImageCarousel from "@/components/AnimatedImageCarousel";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  const carouselImages = [
    {
      src: "/IMG_1.jpg",
      alt: "Club Image 1",
    },
    {
      src: "/IMG_2.jpg",
      alt: "Club Image 2",
    },
    {
      src: "/IMG_3.jpg",
      alt: "Club Image 3",
    },
    {
      src: "/IMG_4.jpg",
      alt: "Club Image 4",
    },
    {
      src: "/IMG_5.jpg",
      alt: "Club Image 5",
    },
  ];

  const featureCards = [
    {
      title: "Bible Studies",
      description:
        "Weekly sessions in English and Chinese focused on practical faith and honest questions.",
      icon: BookOpen,
    },
    {
      title: "Fellowship",
      description:
        "Shared meals, conversations, and social events that make it easy to build real friendships.",
      icon: Users,
    },
    {
      title: "Events",
      description:
        "Retreats, workshops, and campus activities designed for spiritual and personal growth.",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-16 py-8 md:space-y-20 md:py-12">
      <Toaster />

      <section className="site-shell">
        <div className="section-shell bg-grid-soft relative overflow-hidden">
          <div className="absolute -top-20 right-[-80px] h-56 w-56 rounded-full bg-emerald-200/45 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                McGill Student Community
              </p>
              <h1 className="about-heading text-balance text-5xl leading-[1.08] font-semibold text-emerald-950 md:text-6xl">
                Grow in faith, friendship, and purpose.
              </h1>
              <p className="max-w-xl text-base text-emerald-900/75 md:text-lg">
                Green Olive Chinese Christian Club is a welcoming space for
                students and friends to explore Christianity, build meaningful
                relationships, and serve together.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <CustomHomeButton link="/events">
                  Explore Upcoming Events
                </CustomHomeButton>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-emerald-200 bg-white/75 text-emerald-900 hover:bg-emerald-50"
                >
                  <Link href="/about">About Us</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.11em] text-emerald-900/60">
                    Gatherings
                  </p>
                  <p className="text-lg font-semibold text-emerald-900">Biweekly</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.11em] text-emerald-900/60">
                    Languages
                  </p>
                  <p className="text-lg font-semibold text-emerald-900">EN + 中文</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.11em] text-emerald-900/60">
                    Open To
                  </p>
                  <p className="text-lg font-semibold text-emerald-900">Everyone</p>
                </div>
              </div>
            </div>

            <AnimatedImageCarousel images={carouselImages} interval={8000} />
          </div>
        </div>
      </section>

      <section className="site-shell">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <h2 className="section-title">What You Can Expect</h2>
            <p className="section-subtitle">
              A simple rhythm of faith-centered activities, practical support,
              and genuine community.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-emerald-800 hover:text-emerald-700"
            >
              See this month&apos;s events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {featureCards.map((feature, index) => (
              <article
                key={feature.title}
                className={`border-l-2 border-emerald-300/80 pl-4 ${
                  index === 2 ? "sm:col-span-2 sm:max-w-[70%]" : ""
                }`}
              >
                <div className="mb-2 inline-flex rounded-lg bg-emerald-100/80 p-2 text-emerald-700">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-xl font-semibold text-emerald-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-emerald-900/72">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <div className="mx-auto max-w-[1400px] px-0 md:px-4">
          <div
            className="relative min-h-[280px] overflow-hidden bg-emerald-900/80 md:rounded-3xl"
            style={{
              backgroundImage:
                "linear-gradient(110deg, rgba(8,40,29,0.86), rgba(8,40,29,0.46)), url('/quebec_city.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="site-shell flex min-h-[280px] items-center py-10">
              <div className="max-w-2xl space-y-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100/85">
                  Community Life
                </p>
                <h2 className="about-heading text-4xl font-semibold leading-tight md:text-5xl">
                  A place to belong in Montreal.
                </h2>
                <p className="max-w-xl text-white/85">
                  Whether you are new to faith, exploring questions, or looking
                  for fellowship, Green Olive welcomes you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-5">
            <h2 className="section-title">About Our Club</h2>
            <p className="section-subtitle">
              We started Green Olive to provide a spiritual home for students
              and friends interested in Christianity and Chinese community life.
            </p>
            <p className="text-emerald-900/75">
              Our name represents growth, peace, and steady faith. You are
              welcome to join us whether you are curious, returning, or already
              deeply rooted in your faith.
            </p>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-emerald-200 bg-white/75 text-emerald-900 hover:bg-emerald-50"
            >
              <Link href="/about">
                Learn More
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </article>

          <article className="section-shell flex flex-col justify-between">
            <div>
              <h3 className="section-title mb-3 text-2xl">Join Our Community</h3>
              <p className="text-sm text-emerald-900/75">
                Create an account to register for events and stay updated.
              </p>
            </div>
            <div className="mt-6">
              <HomeRegisterButton isLoggedIn={!!user} />
            </div>
          </article>
        </div>
      </section>

      <section className="site-shell pb-6">
        <div className="border-t border-emerald-200/80 pt-10">
          <h2 className="section-title mb-8 text-center">Contact Us</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="text-center">
              <div className="mx-auto mb-3 inline-flex rounded-full bg-emerald-100 p-3 text-emerald-700">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-emerald-900">
                goccc@gmail.com
              </p>
            </article>

            <article className="text-center">
              <div className="mx-auto mb-3 inline-flex rounded-full bg-emerald-100 p-3 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-emerald-900">
                845 Sherbrooke St W, Montreal, Quebec H3A 0G4
              </p>
            </article>

            <article className="text-center">
              <div className="mx-auto mb-3 inline-flex rounded-full bg-emerald-100 p-3 text-emerald-700">
                <ContactRound className="h-5 w-5" />
              </div>
              <Link
                href="/executives"
                className="text-sm font-semibold text-emerald-900 hover:text-emerald-700"
              >
                Meet Our Executives
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
