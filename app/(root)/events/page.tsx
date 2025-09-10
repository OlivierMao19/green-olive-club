import { auth } from "@/auth";
import EventsCalendar from "@/components/EventsCalendar";

export default async function events() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin || false;

  return <EventsCalendar isAdmin={isAdmin} />;
}
