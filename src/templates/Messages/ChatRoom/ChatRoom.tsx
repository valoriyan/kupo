import { useEffect, MouseEvent } from "react";
import { RenderableChatMessage } from "#/api";
import { useCreateNewChatMessage } from "#/api/mutations/chat/createNewChatMessage";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/chat/useGetPageOfChatMessagesFromChatRoomId";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { FormStateProvider, useFormState } from "./FormContext";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { useDeleteChatMessage } from "#/api/mutations/chat/deleteChatMessage";
import { NewMessageFormInput } from "./NewMessageFormInput";
import { useGetChatRoomById } from "#/api/queries/chat/useGetChatRoomById";
import { useGetUsersByUserIds } from "#/api/queries/users/useGetUsersByIds";

const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";
const DELETED_CHAT_MESSAGE_EVENT_NAME = "DELETED_CHAT_MESSAGE_EVENT_NAME";

const ChatRoomMessage = ({ message }: { message: RenderableChatMessage }) => {
  const { authorUserId, text, creationTimestamp } = message;

  const { data, isLoading, isError, error } = useGetUserByUserId({
    userId: authorUserId,
  });

  const { mutateAsync: deleteChatMessage } = useDeleteChatMessage({
    chatRoomId: message.chatRoomId,
  });

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const { username } = data;

  const onClickDelete = async (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    await deleteChatMessage({
      chatMessageId: message.chatMessageId,
      isInformedByWebsocketMessage: false,
    });
  };

  return (
    <div>
      {username}: {text} @ {creationTimestamp}{" "}
      <span onClick={onClickDelete}> | delete | </span>
    </div>
  );
};

const ChatRoomInner = ({ chatRoomId }: { chatRoomId: string }) => {
  const { newChatMessage, receivedChatMessages, receiveNewChatMessage } = useFormState();
  const { socket } = useWebsocketState();

  const {
    data,
    isError,
    isLoading,
    error,
    isFetching: isFetchingChatMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useGetPageOfChatMessagesFromChatRoomId({
    chatRoomId,
  });

  const { data: chatRoomData } = useGetChatRoomById({ chatRoomId });
  const chatRoomUserIds = !!chatRoomData
    ? chatRoomData.members.map((member) => member.userId)
    : [];

  const { data: chatRoomMembers } = useGetUsersByUserIds({ userIds: chatRoomUserIds });
  const { mutateAsync: createNewChatMessage } = useCreateNewChatMessage();
  const { mutateAsync: deleteChatMessage } = useDeleteChatMessage({
    chatRoomId,
  });

  const onMount = () => {
    if (!!socket) {
      console.log("MOUNTING SOCKET!");

      function handleNewChatMessage(chatMessage: RenderableChatMessage) {
        receiveNewChatMessage({
          chatMessage,
        });
      }

      function handleDeleteChatMessage(chatMessageId: string) {
        console.log("RECEIEVED");
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

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const messages = data.pages
    .flatMap((page) => {
      return page.chatMessages;
    })
    .concat(receivedChatMessages);

  const renderedMessages = messages.map((message) => (
    <ChatRoomMessage key={message.chatMessageId} message={message} />
  ));

  async function onSubmitNewChatMessage(event: React.FormEvent) {
    event.preventDefault();
    createNewChatMessage({
      chatRoomId,
      chatMessageText: newChatMessage,
    });
  }

  const memberNames = !!chatRoomMembers
    ? chatRoomMembers
        .filter((chatRoomMember) => !!chatRoomMember)
        .map((chatRoomMember) => chatRoomMember!.username)
        .join(", ")
    : "";

  return (
    <div>
      Chat Room: {chatRoomId}
      <br />
      <br />
      Members: {memberNames}
      <br />
      <br />
      {isFetchingChatMessages ? (
        <div>
          Refreshing...
          <br />
        </div>
      ) : null}
      <form onSubmit={onSubmitNewChatMessage}>
        <NewMessageFormInput />
      </form>
      <br />
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          fetchPreviousPage();
        }}
        disabled={!hasPreviousPage || isFetchingPreviousPage}
      >
        {isFetchingPreviousPage ? (
          "Loading more..."
        ) : hasPreviousPage ? (
          <h3>LOAD PREVIOUS</h3>
        ) : (
          "Nothing more to load"
        )}
      </button>
      <br />
      <br />
      {renderedMessages}
    </div>
  );
};

export const ChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  return (
    <FormStateProvider>
      <ChatRoomInner chatRoomId={chatRoomId} />
    </FormStateProvider>
  );
};
