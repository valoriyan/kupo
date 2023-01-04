import { useEffect } from "react";
import { RenderableChatMessage } from "#/api";
import { useCreateNewChatMessage } from "#/api/mutations/chat/createNewChatMessage";
import { useMarkChatRoomAsRead } from "#/api/mutations/chat/markChatRoomAsRead";
import { useGetChatRoomById } from "#/api/queries/chat/useGetChatRoomById";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { useGetUsersByUserIds } from "#/api/queries/users/useGetUsersByIds";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { ErrorMessage } from "#/components/ErrorArea";
import { LoadingArea } from "#/components/LoadingArea";
import { styled } from "#/styling";
import { MessageComposer } from "../MessageComposer";
import { ChatMessagesList } from "./ChatMessagesList";
import { ChatRoomFormStateProvider, useChatRoomFormState } from "./ChatRoomFormContext";
import { ChatRoomMembersDisplay } from "./ChatRoomMembersDisplay";

export interface ChatRoomProps {
  chatRoomId: string;
}

export const ChatRoom = ({ chatRoomId }: ChatRoomProps) => {
  return (
    <ChatRoomFormStateProvider>
      <ChatRoomInner chatRoomId={chatRoomId} />
    </ChatRoomFormStateProvider>
  );
};

const ChatRoomInner = ({ chatRoomId }: ChatRoomProps) => {
  const {
    subscribeToChatRoomId,
    receivedChatMessagesByChatRoomId,
    unsubscribeFromChatRoomId,
  } = useWebsocketState();

  const { mutateAsync: markChatRoomAsRead } = useMarkChatRoomAsRead();

  useEffect(() => {
    if (!!chatRoomId) {
      markChatRoomAsRead(chatRoomId);
    }

    subscribeToChatRoomId(chatRoomId);

    return function cleanup() {
      unsubscribeFromChatRoomId(chatRoomId);
    };
  }, [chatRoomId, subscribeToChatRoomId, unsubscribeFromChatRoomId, markChatRoomAsRead]);

  const { mutateAsync: createNewChatMessage } = useCreateNewChatMessage();
  const { newChatMessage, setNewChatMessage } = useChatRoomFormState();

  const {
    data: clientUserData,
    isError: isErrorAcquiringClientUserData,
    isLoading: isLoadingClientUserData,
  } = useGetClientUserProfile();

  const { data: chatRoomData } = useGetChatRoomById({ chatRoomId });
  const chatRoomUserIds = !!chatRoomData
    ? chatRoomData.members.map((member) => member.userId)
    : [];

  const {
    data: chatRoomMembersData,
    isError: isErrorAcquiringChatRoomMembersData,
    isLoading: isLoadingChatRoomMembersData,
  } = useGetUsersByUserIds({ userIds: chatRoomUserIds });

  const chatMessagesQuery = useGetPageOfChatMessagesFromChatRoomId({ chatRoomId });

  if (
    (chatMessagesQuery.isError && !chatMessagesQuery.isLoading) ||
    (isErrorAcquiringClientUserData && !isLoadingClientUserData) ||
    (isErrorAcquiringChatRoomMembersData && !isLoadingChatRoomMembersData)
  ) {
    return (
      <ErrorMessage>
        {chatMessagesQuery.error?.message ?? "An Error Occurred"}
      </ErrorMessage>
    );
  }

  if (
    chatMessagesQuery.isLoading ||
    !chatMessagesQuery.data ||
    isLoadingClientUserData ||
    !clientUserData ||
    isLoadingChatRoomMembersData ||
    !chatRoomMembersData
  ) {
    return <LoadingArea size="lg" />;
  }

  async function onSubmitNewChatMessage(event: React.FormEvent) {
    event.preventDefault();
    createNewChatMessage({
      chatRoomId,
      chatMessageText: newChatMessage,
    });

    setNewChatMessage("");
  }

  const receivedChatMessages = receivedChatMessagesByChatRoomId.get(chatRoomId) || [];

  const chatMessages = chatMessagesQuery.data.pages
    .flatMap((page) => page.chatMessages)
    .concat(receivedChatMessages);

  const uniqueChatMessages = new Map<string, RenderableChatMessage>(
    chatMessages.map((message) => [message.chatMessageId, message]),
  );

  return (
    <Grid>
      <ChatRoomMembersDisplay
        chatRoomMembers={chatRoomMembersData}
        clientUser={clientUserData}
      />
      <ChatMessagesList
        clientUserId={clientUserData.userId}
        chatMessages={Array.from(uniqueChatMessages.values())}
        hasPreviousPage={chatMessagesQuery.hasPreviousPage}
        isFetchingPreviousPage={chatMessagesQuery.isFetchingPreviousPage}
        fetchPreviousPage={chatMessagesQuery.fetchPreviousPage}
      />
      <MessageComposer
        newChatMessage={newChatMessage}
        setNewChatMessage={setNewChatMessage}
        onSubmitNewChatMessage={onSubmitNewChatMessage}
      />
    </Grid>
  );
};

const Grid = styled("div", {
  height: "100%",
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr) auto",
});
