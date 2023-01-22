import { RenderableUser } from "#/api";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { ErrorMessage } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { ChatMessagesList } from "../ChatRoom/ChatMessagesList";

export interface ExistingChatMessagesProps {
  clientUserId?: string;
  chatRoomId: string;
  members: RenderableUser[];
}

export const ExistingChatMessages = ({
  clientUserId,
  chatRoomId,
  members,
}: ExistingChatMessagesProps) => {
  const {
    data,
    isLoading,
    error,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  } = useGetPageOfChatMessagesFromChatRoomId({
    chatRoomId,
  });

  const chatMessages = data?.pages.flatMap((page) => page.chatMessages);

  const memberMap = members.reduce((acc, cur) => {
    acc[cur.userId] = cur;
    return acc;
  }, {} as Record<string, RenderableUser>);

  if (error && !isLoading) {
    return <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>;
  }

  if (isLoading || !chatMessages || !clientUserId) {
    return <LoadingArea size="md" />;
  }

  return (
    <ChatMessagesList
      clientUserId={clientUserId}
      chatMessages={chatMessages}
      hasPreviousPage={hasPreviousPage}
      isFetchingPreviousPage={isFetchingPreviousPage}
      fetchPreviousPage={fetchPreviousPage}
      isGroupChat={members.length > 1}
      memberMap={memberMap}
    />
  );
};
