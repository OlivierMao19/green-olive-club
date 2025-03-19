"use client";

import { Container, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import ExecutiveImage from "@/components/ExecutiveImage";
import { useEffect, useState } from "react";

interface ExecutiveInfo {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  imagePath: string | undefined;
  description: string | undefined;
}

const executivesList: ExecutiveInfo[] = [
  {
    id: 1,
    name: "Iris Liu",
    role: "Club President",
    email: "iris.liu@mail.mcgill.ca",
    phone: "514-532-5432",
    imagePath: "bigLogo.png",
    description: undefined,
  },
  {
    id: 2,
    name: "Hao Yuan Lu",
    role: "External Vice President",
    email: "haoyuan.lu@mail.mcgill.ca",
    phone: "514-533-1234",
    imagePath: undefined,
    description: undefined,
  },
  {
    id: 3,
    name: "Lynne",
    role: "Internal Vice President",
    email: "lynne@mail.mcgill.ca",
    phone: "543-123-1234",
    imagePath: "logo.png",
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
    imagePath: undefined,
    description: undefined,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function executives() {
  const [selectedExecutive, setSelectedExecutive] =
    useState<ExecutiveInfo | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-emerald-100 min-h-[100dvh]">
      <div className="items-center p-2 flex flex-col px-5">
        <div className="container mb-10 md:w-[700px] justify-items-center">
          <div className="text-5xl py-6 font-bold text-center md:mt-5">
            Meet Our Executive Team
          </div>
          <h1 className="text-center text-1xl text-gray-700">
            Our experienced leadership team is committed to building our
            community and creating meaningful experiences for all our members.
          </h1>
        </div>
        <motion.div
          className="grid w-full gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {executivesList.map((executive, index) => (
            <motion.div
              key={executive.id}
              className="executive-card group [perspective:1000px] overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedExecutive(executive)}
            >
              <ExecutiveImage
                execName={executive.name}
                execRole={executive.role}
                execMail={executive.email}
                execPhotoPath={executive.imagePath}
                execDescription={executive.description}
              />
              <div className="mt-5">
                <h2 className="text-2xl font-bold">{executive.name}</h2>
                <h3 className="text-1xl text-green-400 font-bold">
                  {executive.role}
                </h3>
                <div className="flex flex-row">
                  <Mail className="mt-1 mr-2 size-4 text-gray-600" />
                  <div className="text-gray-600">{executive.email}</div>
                </div>
                <div className="flex flex-row">
                  <Phone className="mt-1 mr-2 size-4 text-gray-600" />
                  <div className="text-gray-600">{executive.phone}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
