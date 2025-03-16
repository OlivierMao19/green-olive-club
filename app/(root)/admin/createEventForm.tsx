"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert the local datetime to ISO 8601 format with Z (UTC) suffix
    let isoDateTime = "";
    if (!dateTime) {
      alert("Please select a valid date and time");
    }
    const date = new Date(dateTime);
    // Format to ISO string (which includes the Z suffix for UTC)
    isoDateTime = date.toISOString();

    const scheduledAt = new Date(isoDateTime);

    console.log({
      title,
      description,
      location,
      scheduledAt: isoDateTime,
    });
    try {
      const response = await fetch("api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, location, scheduledAt }),
      });
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      setTitle("");
      setDescription("");
      setDateTime("");
      setLocation("");
      alert(`Event created successfully scheduled at: ${dateTime}`);
    } catch (error) {
      console.error(error);
      alert("Error creating event.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto py-8 px-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2 mt-3">
            <Label htmlFor="location" className="text-base">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="description" className="text-base">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[150px] w-full"
            />
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="datetime" className="text-base">
              Scheduled At (ISO 8601)
            </Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Will be converted to ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ) on
              submission
            </p>
          </div>

          <Button type="submit" className="px-8 py-2 mt-4">
            Create Event
          </Button>
        </form>
      </div>
    </div>
  );
}
