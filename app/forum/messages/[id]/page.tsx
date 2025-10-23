import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/forum-utils";
import ReplyToMessage from "./ReplyToMessage";

async function getMessage(messageId: string, userId: string) {
  try {
    // Get the message participation record for this user
    const participation = await prisma.ez_forum_message_participants.findFirst({
      where: {
        messageId,
        userId,
        isDeleted: false,
      },
      include: {
        message: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            participants: {
              where: {
                isDeleted: false,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!participation) {
      return null;
    }

    // Mark as read if unread
    if (!participation.isRead) {
      await prisma.ez_forum_message_participants.update({
        where: { id: participation.id },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    }

    return participation.message;
  } catch (error) {
    console.error("Error fetching message:", error);
    return null;
  }
}

export default async function MessagePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const message = await getMessage(params.id, session.user.id);

  if (!message) {
    notFound();
  }

  // Get recipients (excluding current user)
  const recipients = message.participants
    .filter((p) => p.userId !== session.user.id)
    .map((p) => p.user);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/forum" className="hover:text-purple-600">
          Forum
        </Link>
        <span className="mx-2">›</span>
        <Link href="/forum/messages" className="hover:text-purple-600">
          Messages
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{message.subject}</span>
      </nav>

      {/* Message Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{message.subject}</h1>
        </div>

        {/* Message Body */}
        <div className="p-6">
          {/* Sender Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {message.sender.image ? (
              <img
                src={message.sender.image}
                alt={message.sender.name || "User"}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {message.sender.name || "Anonymous"}
              </div>
              <div className="text-sm text-gray-500">
                {formatRelativeTime(new Date(message.createdAt))}
              </div>
            </div>
            {recipients.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">To:</span>{" "}
                {recipients.map((r) => r.name || "Anonymous").join(", ")}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: message.content.replace(/\n/g, "<br>"),
            }}
          />
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <Link
            href="/forum/messages"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Messages
          </Link>
          <Link
            href={`/forum/messages/compose?to=${message.sender.id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Reply
          </Link>
        </div>
      </div>

      {/* Quick Reply Form */}
      <ReplyToMessage
        messageId={message.id}
        originalSubject={message.subject}
        senderId={message.sender.id}
      />
    </div>
  );
}
