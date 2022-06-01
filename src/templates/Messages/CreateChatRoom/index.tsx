import Link from "next/link";
import Router from "next/router";
import { FormEvent, useState } from "react";
import { useCreateNewChatMessageInNewChatRoom } from "#/api/mutations/chat/createNewChatMessageInNewChatRoom";
import { useGetChatRoomIdWithUserIds } from "#/api/queries/chat/useGetChatRoomIdWithUserIds";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { useGetUsersByUsernames } from "#/api/queries/users/useGetUsersByUsernames";
import { Button } from "#/components/Button";
import { Flex, Grid } from "#/components/Layout";
import { styled } from "#/styling";
import { MessageComposer } from "../MessageComposer";
import { UsersInput } from "./UsersInput";
import { ExistingChatMessages } from "./ExistingChatMessages";

export const NewChatRoom = () => {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");

  const { data: clientUser, isLoading: isClientUserLoading } = useGetClientUserProfile();
  const { data: users, isLoading: areUsersLoading } = useGetUsersByUsernames({
    usernames,
  });

  const resolvedUsers = !!users ? users?.flatMap((user) => (user ? [user] : [])) : [];

  const userIds =
    !!users && clientUser
      ? resolvedUsers.map((user) => user.userId).concat([clientUser.userId])
      : [];

  const { data: existingChatRoom, isLoading: isExistingChatRoomLoading } =
    useGetChatRoomIdWithUserIds({ userIds });
  const { mutateAsync: createNewChatMessageInNewChatRoom } =
    useCreateNewChatMessageInNewChatRoom();

  const isLoading = isClientUserLoading || areUsersLoading || isExistingChatRoomLoading;

  const onSubmitNewChatMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const newChatRoomId = await createNewChatMessageInNewChatRoom({
      userIds,
      chatMessageText: newChatMessage,
    });

    await Router.push({
      pathname: "/messages/[chatRoomId]",
      query: { chatRoomId: newChatRoomId },
    });
  };

  return (
    <Grid css={{ height: "100%", gridTemplateRows: "auto 1fr auto" }}>
      <UsersInput
        usernames={usernames}
        setUsernames={setUsernames}
        resolvedUsers={resolvedUsers}
      />
      {existingChatRoom?.chatRoomId ? (
        <ExistingChatMessages
          clientUserId={clientUser?.userId}
          chatRoomId={existingChatRoom.chatRoomId}
        />
      ) : (
        <div />
      )}
      {existingChatRoom?.chatRoomId ? (
        <Footer>
          <Link href={`/messages/${existingChatRoom.chatRoomId}`} passHref>
            <Button as="a">Enter Chat Room</Button>
          </Link>
        </Footer>
      ) : (
        <MessageComposer
          newChatMessage={newChatMessage}
          setNewChatMessage={setNewChatMessage}
          onSubmitNewChatMessage={onSubmitNewChatMessage}
          disabled={isLoading}
        />
      )}
    </Grid>
  );
};

const Footer = styled(Flex, {
  justifyContent: "center",
  alignItems: "center",
  p: "$4",
  bg: "$background2",
  borderTop: "solid $borderWidths$1 $border",
});
