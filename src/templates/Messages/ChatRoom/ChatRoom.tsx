import { ChangeEvent, useEffect } from "react";
import { RenderableChatMessage } from "#/api";
import { useCreateNewChatMessage } from "#/api/mutations/chat/createNewChatMessage";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/useGetPageOfChatMessagesFromChatRoomId";
import { useGetUserByUserId } from "#/api/queries/useGetUserByUserId";
import { FormStateProvider, useFormState } from "./FormContext";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";

const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";

const ChatRoomMessage = ({ message }: { message: RenderableChatMessage }) => {
  const { authorUserId, text, creationTimestamp } = message;

  const { data, isLoading, isError, error } = useGetUserByUserId({
    userId: authorUserId,
  });

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const { username } = data;

  return (
    <div>
      {username}: {text} @ {creationTimestamp}
    </div>
  );
};

const ChatRoomInner = ({ chatRoomId }: { chatRoomId: string }) => {
  const {
    newChatMessage,
    setNewChatMessage,
    receivedChatMessages,
    receiveNewChatMessage,
  } = useFormState();
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

  const { mutateAsync: createNewChatMessage } = useCreateNewChatMessage();

  const onMount = () => {
    if (!!socket) {
      console.log("MOUNTING SOCKET!");

      function handleNewChatMessage(chatMessage: RenderableChatMessage) {
        receiveNewChatMessage({
          chatMessage,
        });
      }

      socket.on(NEW_CHAT_MESSAGE_EVENT_NAME, handleNewChatMessage);

      return function cleanup() {
        socket.off(NEW_CHAT_MESSAGE_EVENT_NAME, handleNewChatMessage);
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
    .filter((page) => !!page.success)
    .flatMap((page) => {
      return page.success!.chatMessages;
    })
    .concat(receivedChatMessages);

  const renderedMessages = messages.map((message) => (
    <ChatRoomMessage key={message.chatMessageId} message={message} />
  ));

  async function onChangeNewChatMessage(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    setNewChatMessage(event.currentTarget.value);
  }

  async function onSubmitNewChatMessage(event: React.FormEvent) {
    event.preventDefault();
    createNewChatMessage({
      chatRoomId,
      chatMessageText: newChatMessage,
    });
  }

  return (
    <div>
      Chat Room: {chatRoomId}
      <br />
      <br />
      <br />
      <br />
      {isFetchingChatMessages ? (
        <div>
          Refreshing...
          <br />
        </div>
      ) : null}
      <form onSubmit={onSubmitNewChatMessage}>
        <input value={newChatMessage} onChange={onChangeNewChatMessage} type="text" />
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
