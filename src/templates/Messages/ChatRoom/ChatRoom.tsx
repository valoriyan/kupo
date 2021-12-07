import { useEffect } from "react";
import { RenderableChatMessage } from "#/api";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { FormStateProvider, useFormState } from "./FormContext";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { useDeleteChatMessage } from "#/api/mutations/chat/deleteChatMessage";
import { useGetChatRoomById } from "#/api/queries/chat/useGetChatRoomById";
import { useGetUsersByUserIds } from "#/api/queries/users/useGetUsersByIds";
import { styled } from "#/styling";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { ChatRoomMembersDisplay } from "./ChatRoomMembersDisplay";
import { ChatMessagesDisplay } from "./ChatMessagesDisplay";
import { NewMessageInput } from "./NewMessageInput";
import { useCreateNewChatMessage } from "#/api/mutations/chat/createNewChatMessage";

const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";
const DELETED_CHAT_MESSAGE_EVENT_NAME = "DELETED_CHAT_MESSAGE_EVENT_NAME";

const ChatRoomInner = ({ chatRoomId }: { chatRoomId: string }) => {
  const { receivedChatMessages, receiveNewChatMessage } = useFormState();
  const { socket } = useWebsocketState();

  const { mutateAsync: createNewChatMessage } = useCreateNewChatMessage();
  const { newChatMessage, setNewChatMessage } = useFormState();

  const {
    data: clientUserData,
    isError: isErrorAcquiringClientUserData,
    isLoading: isLoadingClientUserData,
  } = useGetUserProfile({ isOwnProfile: true });

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

  const onMount = () => {
    if (!!socket) {
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

    return function emptyCleanup() {};
  };

  useEffect(() => {
    return onMount();
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
      <NewMessageInput onSubmitNewChatMessage={onSubmitNewChatMessage} />
    </Grid>
  );
};

export const ChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  return (
    <FormStateProvider>
      <ChatRoomInner chatRoomId={chatRoomId} />
    </FormStateProvider>
  );
};

const Grid = styled("div", {
  display: "grid",
  gridTemplateRows: "10% 70% 20%",
  height: "100%",
});
