-- AlterTable
ALTER TABLE "User" ADD COLUMN "school" TEXT;

-- AlterTable
ALTER TABLE "GuestRegistration" ADD COLUMN "school" TEXT;
ALTER TABLE "GuestRegistration" ALTER COLUMN "mcgillId" DROP NOT NULL;
