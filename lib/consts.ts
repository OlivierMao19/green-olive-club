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
    name: "Tony Wu",
    role: "External Vice President",
    email: "dongze.we@mail.mcgill.ca",
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
    role: "Treasurer",
    email: "ewen.gueguen@mail.mcgill.ca",
    phone: "438-855-2381",
    imagePath: undefined,
    description:
      "Ewen manages our finances with precision and foresight. His strategic approach to budgeting has allowed us to expand our programs while maintaining financial stability.",
  },
  {
    id: 6,
    name: "Olivier Mao",
    role: "Senior Janitor",
    email: "olivier.mao@mail.mcgill.ca",
    phone: "514-298-0081",
    imagePath: "logo.png",
    description: undefined,
  },
];
