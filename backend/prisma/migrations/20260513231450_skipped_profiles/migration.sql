-- CreateTable
CREATE TABLE "SkippedProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skippedUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkippedProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkippedProfile_userId_skippedUserId_key" ON "SkippedProfile"("userId", "skippedUserId");
