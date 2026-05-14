/*
  Warnings:

  - The `status` column on the `ConnectionRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `sleepSchedule` on the `Preference` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConnectionRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'RENTED', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('ROOM', 'APARTMENT', 'HOUSE', 'STUDIO');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "SleepSchedule" AS ENUM ('EARLY_SLEEPER', 'NIGHT_OWL', 'FLEXIBLE');

-- AlterTable
ALTER TABLE "ConnectionRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "ConnectionRequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "bathroomType" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "compatibilityScore" DOUBLE PRECISION,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "currentRoommates" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "furnished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "laundry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxRoommates" INTEGER,
ADD COLUMN     "parking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomType" TEXT,
ADD COLUMN     "utilitiesIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wifi" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "ListingImage" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "compatibilityScore" DOUBLE PRECISION,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "acceptsPets" BOOLEAN,
ADD COLUMN     "acceptsSmoking" BOOLEAN,
ADD COLUMN     "maxAge" INTEGER,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "preferredCity" TEXT,
ADD COLUMN     "preferredGender" "Gender",
ADD COLUMN     "preferredUniversity" TEXT,
DROP COLUMN "sleepSchedule",
ADD COLUMN     "sleepSchedule" "SleepSchedule" NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "cleanlinessLevel" INTEGER,
ADD COLUMN     "drinks" BOOLEAN,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "lookingFor" TEXT,
ADD COLUMN     "noiseLevel" INTEGER,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "personalityType" TEXT,
ADD COLUMN     "pets" BOOLEAN,
ADD COLUMN     "sleepSchedule" "SleepSchedule",
ADD COLUMN     "smokes" BOOLEAN,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeen" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockerId_blockedId_key" ON "BlockedUser"("blockerId", "blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteListing_userId_listingId_key" ON "FavoriteListing"("userId", "listingId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE INDEX "Listing_ownerId_idx" ON "Listing"("ownerId");

-- CreateIndex
CREATE INDEX "Match_user1Id_idx" ON "Match"("user1Id");

-- CreateIndex
CREATE INDEX "Match_user2Id_idx" ON "Match"("user2Id");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteListing" ADD CONSTRAINT "FavoriteListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteListing" ADD CONSTRAINT "FavoriteListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
