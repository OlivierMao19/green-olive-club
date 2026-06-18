-- CreateEnum
CREATE TYPE "RecurrenceRule" AS ENUM ('WEEKLY', 'BIWEEKLY');

-- CreateTable
CREATE TABLE "EventSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "imageId" TEXT,
    "recurrence" "RecurrenceRule" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSeries_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "seriesId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_seriesId_scheduledAt_key" ON "Event"("seriesId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "EventSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
