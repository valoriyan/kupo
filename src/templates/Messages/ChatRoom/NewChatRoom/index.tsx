import { ChangeEvent } from "react";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { FormStateProvider, useFormState } from "./FormContext";

const NewChatRoomUsernameListItem = ({ username }: { username: string }) => {
  const { data } = useGetUserProfile({ username });

  if (!!data) {
    return <span style={{ color: "green" }}>{data.username}</span>;
  } else {
    return <span>{username}</span>;
  }
};

export const NewChatRoomInner = () => {
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
    <div>
      <br />
      <br />
      Users: {renderedUsersInChatRoom}
      <br />
      <input onChange={onChangeUsernamesInChatRoom} type="text" />
    </div>
  );
};

export const NewChatRoom = () => {
  return (
    <FormStateProvider>
      <NewChatRoomInner />
    </FormStateProvider>
  );
};
