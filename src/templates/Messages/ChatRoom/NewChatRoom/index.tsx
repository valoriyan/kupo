import { ChangeEvent } from "react";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { FormStateProvider, useFormState } from "./FormContext";

export interface NewChatRoomProps {
  chatRoomId?: string;
}

const NewChatRoomUsernameListItem = ({ username }: { username: string }) => {
  const { data } = useGetUserProfile({ username });

  if (!!data) {
    return <span style={{ color: "red" }}>{data.username}</span>;
  } else {
    return <span>{username}</span>;
  }
};

export const NewChatRoom = ({ chatRoomId }: NewChatRoomProps) => {
  const { usernamesInChatRoom, setUsernamesInChatRoom } = useFormState();

  const renderedUsersInChatRoom = usernamesInChatRoom.map((username, index) => (
    <span key={index}>
      <NewChatRoomUsernameListItem username={username} />
      {index < usernamesInChatRoom.length - 1 ? ", " : ""}
    </span>
  ));

  async function onChangeUsernamesInChatRoom(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const updatedUsersInChatRoom = event.currentTarget.value.split(", ");

    setUsernamesInChatRoom(updatedUsersInChatRoom);
  }

  return (
    <FormStateProvider>
      {chatRoomId}
      <br />
      <br />
      Users: {renderedUsersInChatRoom}
      <br />
      <input onChange={onChangeUsernamesInChatRoom} type="text" />
    </FormStateProvider>
  );
};
