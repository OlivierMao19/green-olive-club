export type Activity = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  registered: boolean;
  imageId: string | null;
};
