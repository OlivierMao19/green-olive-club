import React, { useState } from "react";
import { MapPin, Tag, Calendar } from "lucide-react";
import { Event } from "../types/event";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventDate } from "../utils/eventUtils";

interface EventCardProps {
  event: Event;
  isPresent?: boolean;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isPresent = false,
  className = "",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getPlaceholder = () => (
    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">GOCCC</div>
        <div className="text-sm text-green-500">
          Green Olive Chinese Christian Club
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isPresent
          ? "ring-2 ring-green-400 ring-opacity-50 shadow-green-100"
          : ""
      } ${className}`}
      role="article"
      aria-label={`Event: ${event.title}`}
    >
      {isPresent && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          Happening Now
        </div>
      )}

      <div className="relative overflow-hidden">
        {event.imageUrl && !imageError ? (
          <div className="relative">
            <img
              src={event.imageUrl}
              alt={`${event.title} event photo`}
              className={`w-full h-48 object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
        ) : (
          getPlaceholder()
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-green-600 transition-colors duration-200">
            {event.title}
          </h3>
        </div>

        <p className="text-slate-600 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2 text-green-500" />
            <span>{formatEventDate(event.startDate, event.endDate)}</span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default EventCard;
