import { MouseEvent } from "react";
import { DateTime } from "luxon";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { useDeleteChatMessage } from "#/api/mutations/chat/deleteChatMessage";
import { styled } from "#/styling";
import { RenderableChatMessage, RenderableUser } from "#/api";

export const ChatRoomMessage = ({
  message,
  clientUserData,
}: {
  clientUserData: RenderableUser;
  message: RenderableChatMessage;
}) => {
  const { authorUserId, text, creationTimestamp } = message;

  const { userId: clientUserId } = clientUserData;

  const {
    data: userData,
    isLoading: isLoadingUserData,
    isError: isErrorFromAcquiringUserData,
    error: errorFromAcquiringUserData,
  } = useGetUserByUserId({
    userId: authorUserId,
  });

  const { mutateAsync: deleteChatMessage } = useDeleteChatMessage({
    chatRoomId: message.chatRoomId,
  });

  if (isErrorFromAcquiringUserData && !isLoadingUserData) {
    return <div>Error: {(errorFromAcquiringUserData as Error).message}</div>;
  }

  if (isLoadingUserData || !userData) {
    return <div>Loading</div>;
  }

  const onClickDelete = async (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    await deleteChatMessage({
      chatMessageId: message.chatMessageId,
      isInformedByWebsocketMessage: false,
    });
  };

  const deleteButton =
    clientUserId === authorUserId ? <span onClick={onClickDelete}>x</span> : null;

  const formattedTimestamp = DateTime.fromMillis(creationTimestamp).toLocaleString(
    DateTime.TIME_SIMPLE,
  );

  return (
    <div>
      {text}
      <div>
        <Timestamp>{formattedTimestamp}</Timestamp>
        <DeletePostButton>{deleteButton}</DeletePostButton>
      </div>
    </div>
  );
};

const Timestamp = styled("span", {
  fontSize: "$1",
});

const DeletePostButton = styled("span", {
  display: "block",
  float: "right",
  color: "PaleVioletRed",
  cursor: "pointer",
});
