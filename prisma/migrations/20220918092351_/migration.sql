/*
  Warnings:

  - Made the column `msgInRoomID` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_msgInRoomID_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "msgInRoomID" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_msgInRoomID_fkey" FOREIGN KEY ("msgInRoomID") REFERENCES "Room"("roomID") ON DELETE RESTRICT ON UPDATE CASCADE;
