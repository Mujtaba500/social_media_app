import prisma from "../db/config.js";
import { sendDataToClient } from "../websocketServer.js";

const sendNotificationAsync = async (
  authId: string,
  userId: string,
  type: any
) => {
  try {
    const newNotification = await prisma.notification.create({
      data: {
        type: type,
        from: authId!,
        to: userId,
      },
    });

    const notification = await prisma.notification.findUnique({
      where: { id: newNotification.id },
      select: {
        id: true,
        type: true,
        sentFrom: {
          select: {
            id: true,
            username: true,
            profilepic: true,
          },
        },
      },
    });

    sendDataToClient(userId, notification);
  } catch (error) {
    console.log("Error while sending notification", error);
  }
};

export default sendNotificationAsync;
