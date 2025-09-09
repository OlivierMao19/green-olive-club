"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aboutValues, executivesList } from "@/lib/consts";
import {
  Brain,
  ChevronRight,
  Dumbbell,
  Eye,
  Heart,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function about() {
  const [activeTab, setActiveTab] = useState("mission");
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent leading-tight">
                About Us
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-emerald-800 tracking-wide">
                Green Olive Chinese Christian Club
              </h2>
            </div>

            <div className="flex justify-center py-8">
              <div className="relative">
                <Image
                  src="/bigLogo.png"
                  alt="bigLogo"
                  width={400}
                  height={500}
                  className="max-w-[300px] md:max-w-[350px] lg:max-w-[400px] z-10"
                />
              </div>
            </div>

            <p className="text-xl md:text-2xl text-emerald-700 font-medium italic max-w-2xl mx-auto leading-relaxed">
              Welcome to Green Olive Chinese Christian Club!
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Cards */}
      <section className="container mx-auto px-6 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12 glass-effect">
            <TabsTrigger value="mission" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Mission</span>
            </TabsTrigger>
            <TabsTrigger value="vision" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Vision</span>
            </TabsTrigger>
            <TabsTrigger value="values" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Values</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mission" className="animate-fade-in-up">
            <Card className="max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl text-primary flex items-center justify-center gap-3">
                  <Target className="w-8 h-8" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-center">
                  The Green Olive Chinese Christian Church (GOCCC) is dedicated
                  to fostering the holistic well-being of McGill
                  students--physically, mentally, and spiritually. Through
                  cultural, social, and faith-centered events, we celebrate
                  Chinese traditions while grounding our activities in the
                  values of Christianity. Our mission is to create a welcoming
                  community where young adults can explore the essence of
                  Christian faith, develop meaningful friendships, and learn how
                  to integrate these values into their daily academic and
                  personal lives.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision" className="animate-fade-in-up">
            <Card className="max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl text-primary flex items-center justify-center gap-3">
                  <Eye className="w-8 h-8" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-center">
                  We envision a community where members are equipped to live out
                  their faith in daily life, support one another through life's
                  challenges, and share God's love with the broader community.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="values" className="animate-fade-in-up">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
                  <Heart className="w-8 h-8" />
                  Our Values
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {aboutValues.map((value, index) => (
                  <Card
                    key={index}
                    className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-card border-0"
                  >
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full bg-white/80 flex items-center justify-center mb-4 ${value.color}`}
                      >
                        <value.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl text-primary">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Leadership Team */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-emerald-800 mb-4">
            Leadership Team
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the passionate individuals leading our community forward
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executivesList.map((executive) => (
            <div key={executive.id} className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 hover:-translate-y-1">
                <Link href={`/executives`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {executive.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-800 mb-2">
                    {executive.name}
                  </h4>
                  <p className="text-gray-600 font-medium">{executive.role}</p>
                </Link>
              </div>
            </div>
          ))}

          <div className="group cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl p-6 border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-all duration-300 h-full flex flex-col justify-center items-center text-center hover:-translate-y-1">
              <Link
                href={`/executives`}
                className="w-full flex flex-col justify-center items-center text-center"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold text-emerald-800 mb-2">
                  See all →
                </h4>
                <p className="text-emerald-700 font-medium">Our board team</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-800 to-green-700 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg opacity-90">
            Join us in our mission to build a stronger, more connected community
          </p>
        </div>
      </footer>
    </div>
  );
}
