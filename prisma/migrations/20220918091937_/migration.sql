/*
  Warnings:

  - You are about to drop the column `roomRoomID` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomRoomID_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "roomRoomID",
ADD COLUMN     "msgInRoomID" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_msgInRoomID_fkey" FOREIGN KEY ("msgInRoomID") REFERENCES "Room"("roomID") ON DELETE SET NULL ON UPDATE CASCADE;
