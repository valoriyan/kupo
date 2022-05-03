import { UseInfiniteQueryResult } from "react-query";
import {
  GetPageOfChatMessagesSuccess,
  RenderableChatMessage,
  RenderableUser,
} from "#/api";
import { ScrollArea } from "#/components/ScrollArea";
import { styled } from "#/styling";
import { ChatRoomMessage } from "./ChatRoomMessage";

export const ChatMessagesDisplay = ({
  chatMessages,
  clientUser,
  infiniteQueryResultOfFetchingPageOfChatMessages,
}: {
  chatMessages: RenderableChatMessage[];
  clientUser: RenderableUser;
  infiniteQueryResultOfFetchingPageOfChatMessages: UseInfiniteQueryResult<
    GetPageOfChatMessagesSuccess,
    Error
  >;
}) => {
  const {
    isFetching: isFetchingPageOfChatMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = infiniteQueryResultOfFetchingPageOfChatMessages;

  {
    isFetchingPageOfChatMessages ? (
      <div>
        Refreshing...
        <br />
      </div>
    ) : null;
  }

  const renderedMessages = chatMessages.map((message) => {
    const GridItem =
      message.authorUserId === clientUser.userId ? ClientUserMessage : OtherUserMessage;

    return (
      <GridItem key={message.chatMessageId}>
        <ChatRoomMessage message={message} clientUserData={clientUser} />
      </GridItem>
    );
  });

  const loadPreviousPageItem = isFetchingPreviousPage ? (
    "Loading more..."
  ) : hasPreviousPage ? (
    <button
      onClick={() => {
        fetchPreviousPage();
      }}
      disabled={!hasPreviousPage || isFetchingPreviousPage}
    >
      <h3>LOAD PREVIOUS</h3>
    </button>
  ) : (
    "Nothing more to load"
  );

  return (
    <Wrapper>
      {loadPreviousPageItem}
      {renderedMessages}
    </Wrapper>
  );
};

const Wrapper = styled(ScrollArea, {
  display: "flex",
  flexDirection: "column",
  p: "$4",
});

const ClientUserMessage = styled("div", {
  ml: "30%",
  p: "$3",
  backgroundColor: "$primaryTranslucent",
  color: "$text",
  mt: "$5",
  borderRadius: "$4",
});

const OtherUserMessage = styled("div", {
  mr: "30%",
  p: "$3",
  backgroundColor: "$background3",
  color: "$text",
  mt: "$5",
  borderRadius: "$4",
});
