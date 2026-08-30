-- AlterTable
ALTER TABLE "Event" ADD COLUMN "customFields" JSONB;

-- AlterTable
ALTER TABLE "GuestRegistration" ADD COLUMN "customAnswers" JSONB;

-- AlterTable
ALTER TABLE "UserOnEvent" ADD COLUMN "customAnswers" JSONB;
