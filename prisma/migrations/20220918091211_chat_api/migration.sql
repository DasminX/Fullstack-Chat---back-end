-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "userAvatarImgUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeRoomID" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activeUsersNum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomMsgArr" TEXT[],

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomID")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageID" TEXT NOT NULL,
    "textContent" VARCHAR(255) NOT NULL,
    "sendByUserID" TEXT NOT NULL,
    "sendDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeRoomID_fkey" FOREIGN KEY ("activeRoomID") REFERENCES "Room"("roomID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendByUserID_fkey" FOREIGN KEY ("sendByUserID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
