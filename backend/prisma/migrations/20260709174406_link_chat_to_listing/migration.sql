-- DropIndex
DROP INDEX "ConnectionRequest_senderId_receiverId_key";

-- AlterTable
ALTER TABLE "ConnectionRequest" ADD COLUMN     "listingId" TEXT;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "listingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionRequest_senderId_receiverId_listingId_key" ON "ConnectionRequest"("senderId", "receiverId", "listingId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

