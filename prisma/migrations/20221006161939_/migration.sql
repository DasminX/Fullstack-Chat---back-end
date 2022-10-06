-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "userAvatarImgUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "login" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeUsersIDs" TEXT[],
    "logoURL" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "roomPassword" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "sendByUserID" TEXT NOT NULL,
    "sendDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "textMessage" VARCHAR(255) NOT NULL,
    "sendInRoomID" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendByUserID_fkey" FOREIGN KEY ("sendByUserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendInRoomID_fkey" FOREIGN KEY ("sendInRoomID") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
