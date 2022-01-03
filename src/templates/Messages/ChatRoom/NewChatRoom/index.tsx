import { ChangeEvent, MouseEvent } from "react";
import Router from "next/router";
import { FormStateProvider, useFormState } from "./FormContext";
import { useGetUsersByUsernames } from "#/api/queries/users/useGetUsersByUsernames";
import { RenderableUser } from "#/api";
import { useGetChatRoomIdWithUserIds } from "#/api/queries/chat/useGetChatRoomIdWithUserIds";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { NewMessageInNewChatRoom } from "./NewMessageInNewChatRoom";

const NewChatRoomUsernameListItem = ({ user }: { user: RenderableUser | null }) => {
  if (!!user) {
    return <span style={{ color: "green" }}>{user.username}</span>;
  } else {
    return <span>{user}</span>;
  }
};

export const NewChatRoomInner = ({ clientUser }: { clientUser: RenderableUser }) => {
  const { usernamesInChatRoom, setUsernamesInChatRoom } = useFormState();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useGetUsersByUsernames({ usernames: usernamesInChatRoom });

  const userIds = !!users
    ? users.flatMap((user) => (user ? [user.userId] : [])).concat([clientUser.userId])
    : [clientUser.userId];

  const { data: doesChatRoomExistData } = useGetChatRoomIdWithUserIds({
    userIds,
  });

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  let renderedUsersInChatRoom;
  if (isLoading || !users) {
    renderedUsersInChatRoom = <div>Loading</div>;
  } else {
    renderedUsersInChatRoom = users.map((user, index) => (
      <span key={index}>
        <NewChatRoomUsernameListItem user={user} />
        {index < usernamesInChatRoom.length - 1 ? ", " : ""}
      </span>
    ));
  }

  async function onChangeUsernamesInChatRoom(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const updatedUsersInChatRoom = event.currentTarget.value.split(", ");

    setUsernamesInChatRoom(updatedUsersInChatRoom);
  }

  const isCompleteUserList = !!users && users.every((user) => !!user);

  const handleClickSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    console.log(doesChatRoomExistData);
    event.preventDefault();
    if (!!doesChatRoomExistData) {
      if (doesChatRoomExistData.doesChatRoomExist && !!doesChatRoomExistData.chatRoomId) {
        Router.push(`/messages/${doesChatRoomExistData.chatRoomId}`);
      } else {
        Router.push({
          pathname: `/messages/new`,
          query: { userIds },
        });
      }
    }
  };

  return (
    <div>
      <br />
      <br />
      Users: {renderedUsersInChatRoom}
      <br />
      <input onChange={onChangeUsernamesInChatRoom} type="text" />
      <br />
      <br />
      <br />
      <button
        onClick={handleClickSubmit}
        disabled={!isCompleteUserList}
        style={{ color: isCompleteUserList ? "green" : "red" }}
      >
        Enter Chat Room
      </button>
    </div>
  );
};

export const NewChatRoom = ({ userIds }: { userIds?: string[] }) => {
  const { data, error, isLoading } = useGetUserProfile({ isOwnProfile: true });

  if (!!userIds) {
    return <NewMessageInNewChatRoom userIds={userIds} />;
  }

  if (error && !isLoading) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  return (
    <FormStateProvider>
      <NewChatRoomInner clientUser={data} />
    </FormStateProvider>
  );
};
