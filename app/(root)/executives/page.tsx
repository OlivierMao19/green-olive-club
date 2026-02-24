"use client";

import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import ExecutiveImage from "@/components/ExecutiveImage";
import { useEffect, useState } from "react";
import { ExecutiveInfo, executivesList, helpersList } from "@/lib/consts";

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

export default function Executives() {
  const [, setSelectedExecutive] = useState<ExecutiveInfo | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="site-shell py-8 md:py-10">
      <div className="section-shell flex flex-col items-center p-2 px-5">
        <div className="container mb-10 justify-items-center md:w-[700px]">
          <div className="about-heading py-6 text-center text-5xl font-semibold text-emerald-900 md:mt-5">
            Meet Our Executive Team
          </div>
          <h1 className="text-center text-1xl text-emerald-900/72">
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
          {executivesList.map((executive) => (
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
                <h3 className="text-1xl text-emerald-600 font-bold">
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
          {helpersList.map((helper) => (
            <motion.div
              key={helper.id}
              className="executive-card group [perspective:1000px] overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedExecutive(helper)}
            >
              <ExecutiveImage
                execName={helper.name}
                execRole={helper.role}
                execMail={helper.email}
                execPhotoPath={helper.imagePath}
                execDescription={helper.description}
              />
              <div className="mt-5">
                <h2 className="text-2xl font-bold">{helper.name}</h2>
                <h3 className="text-1xl text-emerald-600 font-bold">
                  {helper.role}
                </h3>
                <div className="flex flex-row">
                  <Mail className="mt-1 mr-2 size-4 text-gray-600" />
                  <div className="text-gray-600">{helper.email}</div>
                </div>
                <div className="flex flex-row">
                  <Phone className="mt-1 mr-2 size-4 text-gray-600" />
                  <div className="text-gray-600">{helper.phone}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
