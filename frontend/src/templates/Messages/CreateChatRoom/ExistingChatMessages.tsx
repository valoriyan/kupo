import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { ErrorMessage } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { ChatMessagesList } from "../ChatRoom/ChatMessagesList";

export interface ExistingChatMessagesProps {
  clientUserId?: string;
  chatRoomId: string;
}

export const ExistingChatMessages = ({
  clientUserId,
  chatRoomId,
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
    />
  );
};
