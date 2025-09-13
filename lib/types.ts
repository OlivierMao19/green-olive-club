export type Activity = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  registered: boolean;
  image_url: string | null;
};
