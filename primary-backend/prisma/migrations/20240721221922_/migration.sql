/*
  Warnings:

  - You are about to drop the column `UserId` on the `Zap` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Zap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Zap" DROP CONSTRAINT "Zap_UserId_fkey";

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "UserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Zap" ADD CONSTRAINT "Zap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
