-- DropForeignKey
ALTER TABLE "ConnectionRequest" DROP CONSTRAINT "ConnectionRequest_listingId_fkey";

-- DropForeignKey
ALTER TABLE "ConnectionRequest" DROP CONSTRAINT "ConnectionRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "ConnectionRequest" DROP CONSTRAINT "ConnectionRequest_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_user2Id_fkey";

-- DropTable
DROP TABLE "ConnectionRequest";

-- DropTable
DROP TABLE "Match";

-- DropTable
DROP TABLE "SkippedProfile";

-- DropEnum
DROP TYPE "ConnectionRequestStatus";

-- DropEnum
DROP TYPE "MatchStatus";

