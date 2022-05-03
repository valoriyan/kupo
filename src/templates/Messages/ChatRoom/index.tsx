import { useEffect } from "react";
import { RenderableChatMessage } from "#/api";
import { useCreateNewChatMessage } from "#/api/mutations/chat/createNewChatMessage";
import { useDeleteChatMessage } from "#/api/mutations/chat/deleteChatMessage";
import { useGetChatRoomById } from "#/api/queries/chat/useGetChatRoomById";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { useGetUsersByUserIds } from "#/api/queries/users/useGetUsersByIds";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { styled } from "#/styling";
import { ChatMessagesDisplay } from "./ChatMessagesDisplay";
import { ChatRoomMembersDisplay } from "./ChatRoomMembersDisplay";
import { FormStateProvider, useFormState } from "./FormContext";
import { MessageComposer } from "./MessageComposer";

const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";
const DELETED_CHAT_MESSAGE_EVENT_NAME = "DELETED_CHAT_MESSAGE_EVENT_NAME";

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

  const infiniteQueryResultOfFetchingPageOfChatMessages =
    useGetPageOfChatMessagesFromChatRoomId({
      chatRoomId,
    });

  const {
    data: pagesOfChatMessageData,
    isError: isErrorAcquiringChatMessageData,
    isLoading: isLoadingChatMessageData,
    error: errorFromAcquiringChatMessageData,
  } = infiniteQueryResultOfFetchingPageOfChatMessages;

  const { data: chatRoomData } = useGetChatRoomById({ chatRoomId });
  const chatRoomUserIds = !!chatRoomData
    ? chatRoomData.members.map((member) => member.userId)
    : [];

  const {
    data: chatRoomMembersData,
    isError: isErrorAcquiringChatRoomMembersData,
    isLoading: isLoadingChatRoomMembersData,
  } = useGetUsersByUserIds({ userIds: chatRoomUserIds });
  const { mutateAsync: deleteChatMessage } = useDeleteChatMessage({
    chatRoomId,
  });

  useEffect(() => {
    if (socket) {
      console.log("MOUNTING SOCKET!");

      function handleNewChatMessage(chatMessage: RenderableChatMessage) {
        if (
          pagesOfChatMessageData &&
          !pagesOfChatMessageData.pages.some((page) => {
            const chatMessageIds = page.chatMessages.map(
              (existingChatMessage) => existingChatMessage.chatMessageId,
            );
            return chatMessageIds.includes(chatMessage.chatMessageId);
          })
        ) {
          receiveNewChatMessage({
            chatMessage,
          });
        }
      }

      function handleDeleteChatMessage(chatMessageId: string) {
        console.log("RECEIEVED", chatMessageId);
        deleteChatMessage({
          chatMessageId,
          isInformedByWebsocketMessage: true,
        });
      }

      socket.on(NEW_CHAT_MESSAGE_EVENT_NAME, handleNewChatMessage);
      socket.on(DELETED_CHAT_MESSAGE_EVENT_NAME, handleDeleteChatMessage);

      return function cleanup() {
        socket.off(NEW_CHAT_MESSAGE_EVENT_NAME, handleNewChatMessage);
        socket.off(DELETED_CHAT_MESSAGE_EVENT_NAME, handleDeleteChatMessage);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  if (
    (isErrorAcquiringChatMessageData && !isLoadingChatMessageData) ||
    (isErrorAcquiringClientUserData && !isLoadingClientUserData) ||
    (isErrorAcquiringChatRoomMembersData && !isLoadingChatRoomMembersData)
  ) {
    return <div>Error: {(errorFromAcquiringChatMessageData as Error).message}</div>;
  }

  if (
    isLoadingChatMessageData ||
    !pagesOfChatMessageData ||
    isLoadingClientUserData ||
    !clientUserData ||
    isLoadingChatRoomMembersData ||
    !chatRoomMembersData
  ) {
    return <div>Loading</div>;
  }

  const chatMessages = pagesOfChatMessageData.pages
    .flatMap((page) => {
      return page.chatMessages;
    })
    .concat(receivedChatMessages);

  async function onSubmitNewChatMessage(event: React.FormEvent) {
    event.preventDefault();
    createNewChatMessage({
      chatRoomId,
      chatMessageText: newChatMessage,
    });

    setNewChatMessage("");
  }

  return (
    <Grid>
      <ChatRoomMembersDisplay
        chatRoomMembers={chatRoomMembersData}
        clientUser={clientUserData}
      />
      <ChatMessagesDisplay
        chatMessages={chatMessages}
        clientUser={clientUserData}
        infiniteQueryResultOfFetchingPageOfChatMessages={
          infiniteQueryResultOfFetchingPageOfChatMessages
        }
      />
      <MessageComposer onSubmitNewChatMessage={onSubmitNewChatMessage} />
    </Grid>
  );
};

const Grid = styled("div", {
  height: "100%",
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr) auto",
});
