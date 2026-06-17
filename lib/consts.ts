import { Heart, Users, Zap } from "lucide-react";

export const instagramUrl = "https://www.instagram.com/goccc.mcgill";
export const instagramHandle = "@goccc.mcgill";
export const email = "goccc@gmail.com";
export const address =
  "1625 Blvd. De Maisonneuve West 305, Montreal, QC H3G 1M9";

export type ExecutiveInfo = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  imagePath: string | undefined;
  description: string | undefined;
};

export const executivesList: ExecutiveInfo[] = [
  {
    id: 1,
    name: "Eno Luo",
    role: "Club President",
    email: "yangyu.luo@mail.mcgill.ca",
    phone: "Unavailable",
    imagePath: undefined,
    description: undefined,
  },
  {
    id: 2,
    name: "Dongze Wu",
    role: "External Vice President",
    email: "dongze.wu@mail.mcgill.ca",
    phone: "Unavailable",
    imagePath: undefined,
    description: undefined,
  },
  {
    id: 3,
    name: "Zhuoling Li",
    role: "Internal Vice President",
    email: "zhuoling.li@mail.mcgill.ca",
    phone: "Unavailable",
    imagePath: undefined,
    description: undefined,
  },
  {
    id: 4,
    name: "Enyi Hou",
    role: "Secretary",
    email: "enyi.hou@mail.mcgill.ca",
    phone: "438-543-9832",
    imagePath: undefined,
    description: undefined,
  },
  {
    id: 5,
    name: "Ewen Gueguen",
    role: "Treasurer & Lead Developer",
    email: "ewen.gueguen@mail.mcgill.ca",
    phone: "438-855-2381",
    imagePath: undefined,
    description: "Ewen has the money and is very cool. Trust his capabilties.",
  },
];

export const helpersList: ExecutiveInfo[] = [
  {
    id: 1,
    name: "Jiayin Li",
    role: "Event Assistant",
    email: "jiayin.li@mail.mcgill.ca",
    phone: "Unavailable",
    imagePath: undefined,
    description: undefined,
  },
  {
    id: 2,
    name: "Olivier Mao",
    role: "Junior Developer",
    email: "olivier.mao@mail.mcgill.ca",
    phone: "514-298-0081",
    imagePath: "logo.png",
    description:
      "Olivier assisted with the development of the GOCCC website alongside Ewen.",
  },
];

export const aboutValues = [
  {
    icon: Heart,
    title: "Spiritual Health",
    description:
      "Strengthening our faith through Bible studies, worship, and meaningful discussions.",
    color: "text-rose-600",
  },
  {
    icon: Users,
    title: "Mental Health",
    description:
      "Encouraging mindfulness, emotional well-being, and personal growth through workshops and support.",
    color: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Physical Health",
    description:
      "Promoting an active lifestyle with fun group activities and recreational events.",
    color: "text-orange-600",
  },
];
