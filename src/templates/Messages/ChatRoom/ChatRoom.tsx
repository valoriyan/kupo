import { RenderableChatMessage } from "#/api";
import { useGetPageOfChatMessagesFromChatRoomId } from "#/api/queries/useGetPageOfChatMessagesFromChatRoomId";
import { useGetUserByUserId } from "#/api/queries/useGetUserByUserId";

const ChatRoomMessage = ({message} : {message: RenderableChatMessage}) => {
  const { authorUserId, text, creationTimestamp } = message;

  const { data, isLoading, isError, error } = useGetUserByUserId({userId: authorUserId});

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const {username} = data;

  return (
    <div>
      {username}: {text} @ {creationTimestamp}
    </div>
  )
}

export const ChatRoom = ({ chatRoomId }: { chatRoomId: string; }) => {
  const {
    data,
    isError,
    isLoading,
    error,
  } = useGetPageOfChatMessagesFromChatRoomId({chatRoomId});
  
  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const messages = data.pages.filter((page) => !!page.success).flatMap(page => {
    return page.success!.chatMessages;
  });

  const renderedMessages = messages.map((message) => (
    <ChatRoomMessage key={message.chatMessageId} message={message} />
  ));

  return (
    <div>
      Chat Room: { chatRoomId }



      <br/>
      <br/>
      <br/>
      <br/>

      <input type="text" />

      <br/>
      <br/>
      <br/>
      <br/>

      {renderedMessages}

    </div>
  )
}