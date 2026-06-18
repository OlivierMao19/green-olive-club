-- CreateTable
CREATE TABLE "EventSeriesException" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSeriesException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSeriesException_seriesId_scheduledAt_key" ON "EventSeriesException"("seriesId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "EventSeriesException" ADD CONSTRAINT "EventSeriesException_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "EventSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
