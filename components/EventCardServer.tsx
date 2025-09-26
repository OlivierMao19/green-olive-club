import { Activity } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import EventCardClient from "./EventCardClient";
import { getEventImage } from "@/lib/services";

type BaseProps = {
  event: Activity;
  isPast?: boolean;
  className?: string;
};

type AdminProps = BaseProps & {
  isAdmin: true;
  setAttendeesOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentEvent: Dispatch<SetStateAction<Activity | null>>;
};

type NonAdminProps = BaseProps & {
  isAdmin?: false | undefined;
};

type EventCardProps = AdminProps | NonAdminProps;

export default async function EventCard(props: EventCardProps) {
  const { event } = props;

  async function getImageUrl(): Promise<string | null> {
    const imageId = event.imageId;
    if (!imageId) return null;

    const { uploadedUrl, relativeUrl } = await getEventImage(imageId);

    return relativeUrl;
  }

  const url = await getImageUrl();

  return <EventCardClient imageURL={url} {...props} />;
}
