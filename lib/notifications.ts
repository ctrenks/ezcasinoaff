import { prisma } from "./prisma";
import type { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  icon?: string;
  metadata?: any;
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  icon,
  metadata,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        icon,
        metadata,
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Create notifications for multiple users at once
 * Useful for broadcasting announcements (e.g., new casinos/games)
 */
export async function createBulkNotifications(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        icon: params.icon,
        metadata: params.metadata,
      })),
    });
    return notifications;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
}

/**
 * Helper function to create a PM notification
 */
export async function createPMNotification(
  recipientId: string,
  senderName: string,
  messageId: string,
  subject: string
) {
  return createNotification({
    userId: recipientId,
    type: "PRIVATE_MESSAGE",
    title: "💬 New Private Message",
    message: `${senderName} sent you a message: "${subject}"`,
    link: `/forum/messages/${messageId}`,
    icon: "💬",
    metadata: {
      messageId,
      senderName,
    },
  });
}

/**
 * Helper function to create a topic reply notification
 */
export async function createTopicReplyNotification(
  userId: string,
  replierName: string,
  topicTitle: string,
  topicSlug: string
) {
  return createNotification({
    userId,
    type: "TOPIC_REPLY",
    title: "💬 New Reply in Topic",
    message: `${replierName} replied to "${topicTitle}"`,
    link: `/forum/topic/${topicSlug}`,
    icon: "💬",
    metadata: {
      replierName,
      topicSlug,
    },
  });
}

/**
 * Helper function to notify all users about a new casino
 */
export async function notifyNewCasino(casinoName: string, casinoId: string) {
  // Get all active users with ezcasino access
  const users = await prisma.user.findMany({
    where: {
      ezcasino: true,
    },
    select: {
      id: true,
    },
  });

  const userIds = users.map((u) => u.id);

  return createBulkNotifications(userIds, {
    type: "NEW_CASINO",
    title: "🎰 New Casino Added",
    message: `${casinoName} has been added to the database`,
    link: `/casinos?search=${encodeURIComponent(casinoName)}`,
    icon: "🎰",
    metadata: {
      casinoName,
      casinoId,
    },
  });
}

/**
 * Helper function to notify all users about new games
 */
export async function notifyNewGames(gameCount: number, provider?: string) {
  // Get all active users with ezcasino access
  const users = await prisma.user.findMany({
    where: {
      ezcasino: true,
    },
    select: {
      id: true,
    },
  });

  const userIds = users.map((u) => u.id);

  const message = provider
    ? `${gameCount} new games from ${provider} have been added`
    : `${gameCount} new games have been added to the database`;

  return createBulkNotifications(userIds, {
    type: "NEW_GAME",
    title: "🎮 New Games Added",
    message,
    link: "/games",
    icon: "🎮",
    metadata: {
      gameCount,
      provider,
    },
  });
}
