import { useEffect } from "react";
import { RenderableChatMessage } from "#/api";
import { useCreateNewChatMessage } from "#/api/mutations/chat/createNewChatMessage";
import { useGetChatRoomById } from "#/api/queries/chat/useGetChatRoomById";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { useGetUsersByUserIds } from "#/api/queries/users/useGetUsersByIds";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { styled } from "#/styling";
import { ChatMessagesList } from "./ChatMessagesList";
import { ChatRoomMembersDisplay } from "./ChatRoomMembersDisplay";
import { FormStateProvider, useFormState } from "./FormContext";
import { MessageComposer } from "../MessageComposer";

const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";

export interface ChatRoomProps {
  chatRoomId: string;
}

export const ChatRoom = ({ chatRoomId }: ChatRoomProps) => {
  return (
    <FormStateProvider>
      <ChatRoomInner chatRoomId={chatRoomId} />
    </FormStateProvider>
  );
};

const ChatRoomInner = ({ chatRoomId }: ChatRoomProps) => {
  const { receivedChatMessages, receiveNewChatMessage } = useFormState();
  const { socket } = useWebsocketState();

  const { mutateAsync: createNewChatMessage } = useCreateNewChatMessage();
  const { newChatMessage, setNewChatMessage } = useFormState();

  const {
    data: clientUserData,
    isError: isErrorAcquiringClientUserData,
    isLoading: isLoadingClientUserData,
  } = useGetClientUserProfile();

  const chatMessagesQuery = useGetPageOfChatMessagesFromChatRoomId({
    chatRoomId,
  });

  const { data: chatRoomData } = useGetChatRoomById({ chatRoomId });
  const chatRoomUserIds = !!chatRoomData
    ? chatRoomData.members.map((member) => member.userId)
    : [];

  const {
    data: chatRoomMembersData,
    isError: isErrorAcquiringChatRoomMembersData,
    isLoading: isLoadingChatRoomMembersData,
  } = useGetUsersByUserIds({ userIds: chatRoomUserIds });

  useEffect(() => {
    if (socket) {
      console.log("MOUNTING SOCKET!");

      function handleNewChatMessage(chatMessage: RenderableChatMessage) {
        if (
          chatMessagesQuery.data &&
          !chatMessagesQuery.data.pages.some((page) => {
            const chatMessageIds = page.chatMessages.map(
              (existingChatMessage) => existingChatMessage.chatMessageId,
            );
            return chatMessageIds.includes(chatMessage.chatMessageId);
          })
        ) {
          receiveNewChatMessage({ chatMessage });
        }
      }

      socket.on(NEW_CHAT_MESSAGE_EVENT_NAME, handleNewChatMessage);

      return function cleanup() {
        socket.off(NEW_CHAT_MESSAGE_EVENT_NAME, handleNewChatMessage);
      };
    }
  }, [chatMessagesQuery.data, receiveNewChatMessage, socket]);

  if (
    (chatMessagesQuery.isError && !chatMessagesQuery.isLoading) ||
    (isErrorAcquiringClientUserData && !isLoadingClientUserData) ||
    (isErrorAcquiringChatRoomMembersData && !isLoadingChatRoomMembersData)
  ) {
    return <div>Error: {(chatMessagesQuery.error as Error).message}</div>;
  }

  if (
    chatMessagesQuery.isLoading ||
    !chatMessagesQuery.data ||
    isLoadingClientUserData ||
    !clientUserData ||
    isLoadingChatRoomMembersData ||
    !chatRoomMembersData
  ) {
    return <div>Loading</div>;
  }

  async function onSubmitNewChatMessage(event: React.FormEvent) {
    event.preventDefault();
    createNewChatMessage({
      chatRoomId,
      chatMessageText: newChatMessage,
    });

    setNewChatMessage("");
  }

  const chatMessages = chatMessagesQuery.data.pages
    .flatMap((page) => page.chatMessages)
    .concat(receivedChatMessages);

  return (
    <Grid>
      <ChatRoomMembersDisplay
        chatRoomMembers={chatRoomMembersData}
        clientUser={clientUserData}
      />
      <ChatMessagesList
        clientUserId={clientUserData.userId}
        chatMessages={chatMessages}
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
