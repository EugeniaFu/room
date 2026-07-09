/*
  Warnings:

  - The `status` column on the `ListingRoommate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RentalMode" AS ENUM ('SHARED', 'NEW_ONLY');

-- CreateEnum
CREATE TYPE "RoomOwnership" AS ENUM ('PRIVATE', 'SHARED');

-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('LIVING_ROOM', 'KITCHEN', 'BATHROOM', 'YARD', 'TERRACE', 'LAUNDRY_AREA', 'PARKING');

-- CreateEnum
CREATE TYPE "ListingReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TenancyStatus" AS ENUM ('INTERESTED', 'ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ReviewCategory" AS ENUM ('GENERAL', 'PUNTUALIDAD_PAGO', 'LIMPIEZA', 'CONVIVENCIA');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "allowedPetTypes" TEXT[],
ADD COLUMN     "amenities" "Amenity"[],
ADD COLUMN     "bedroomCount" INTEGER,
ADD COLUMN     "extraServices" TEXT[],
ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "hasPetsNow" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hostDescription" TEXT,
ADD COLUMN     "houseRules" TEXT[],
ADD COLUMN     "includedServices" TEXT[],
ADD COLUMN     "minStayMonths" INTEGER,
ADD COLUMN     "nearbyLandmark" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privateAreas" TEXT[],
ADD COLUMN     "rentalMode" "RentalMode",
ADD COLUMN     "reviewStatus" "ListingReviewStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "roomOwnership" "RoomOwnership",
ADD COLUMN     "seekingGender" "Gender",
ADD COLUMN     "seekingRoommateBio" TEXT,
ADD COLUMN     "sharedAreas" TEXT[],
ADD COLUMN     "wheelchairAccessible" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ListingRoommate" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "matchedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "TenancyStatus" NOT NULL DEFAULT 'INTERESTED';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "category" "ReviewCategory" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "matchId" TEXT;

-- CreateTable
CREATE TABLE "RentalAgreement" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "roomieId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "RentalAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RentalAgreement_listingId_idx" ON "RentalAgreement"("listingId");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "ListingRoommate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_roomieId_fkey" FOREIGN KEY ("roomieId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
