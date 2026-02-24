import Navbar from "@/components/ui/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const year = new Date().getFullYear();

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-clip font-sans">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float absolute left-[-120px] top-[150px] h-[320px] w-[320px] rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="animate-float absolute right-[-130px] top-[360px] h-[300px] w-[300px] rounded-full bg-lime-200/35 blur-3xl [animation-delay:1.1s]" />
      </div>
      <Navbar />
      <div className="relative z-10 flex-1">{children}</div>
      <footer className="relative z-10 mt-10 border-t border-emerald-200/70 bg-white/55 backdrop-blur">
        <div className="site-shell py-5 text-center text-sm font-medium text-emerald-900/70">
          &copy; {year} Green Olive Club. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
