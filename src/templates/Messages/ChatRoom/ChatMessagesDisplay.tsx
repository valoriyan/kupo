import { UseInfiniteQueryResult } from "react-query";
import {
  RenderableChatMessage,
  RenderableUser,
  SuccessfulGetPageOfChatMessagesResponse,
} from "#/api";
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
    SuccessfulGetPageOfChatMessagesResponse,
    Error
  >;
}) => {
  const {
    isFetching: isFetchingPageOfChatMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = infiniteQueryResultOfFetchingPageOfChatMessages;

  console.log("hasPreviousPage");
  console.log(hasPreviousPage);

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

  console.log(hasPreviousPage);

  const loadPreviousPageItem = isFetchingPreviousPage ?
    "Loading more..." :
    hasPreviousPage ? (
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

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: "$4",
  overflowY: "scroll",
});

const ClientUserMessage = styled("div", {
  marginLeft: "30%",
  padding: "$3",
  backgroundColor: "$primaryTranslucent",
  color: "$text",
  marginTop: "$4",

  borderRadius: "$4",
});

const OtherUserMessage = styled("div", {
  marginRight: "30%",

  backgroundColor: "$primary",
  color: "$text",
  padding: "$3",
  borderRadius: "$4",
  marginTop: "$4",
});
