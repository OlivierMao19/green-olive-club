import { auth } from "@/auth";
import EventsPage from "@/components/EventPage";

export default async function events() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin || false;

  return <EventsPage isAdmin={isAdmin} />;
}
