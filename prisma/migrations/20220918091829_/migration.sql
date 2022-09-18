/*
  Warnings:

  - You are about to drop the column `activeUsersNum` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomMsgArr` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "roomRoomID" TEXT;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "activeUsersNum",
DROP COLUMN "roomMsgArr";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomRoomID_fkey" FOREIGN KEY ("roomRoomID") REFERENCES "Room"("roomID") ON DELETE SET NULL ON UPDATE CASCADE;
