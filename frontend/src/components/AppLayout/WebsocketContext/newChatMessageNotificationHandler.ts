import Router from "next/router";
import { GetState, SetState } from "zustand";
import { Api, NewChatMessageNotification } from "#/api";
import { WebsocketState } from ".";

export const generateNewChatMessageNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (newChatMessageNotification: NewChatMessageNotification) => {
    const { countOfUnreadChatRooms, chatMessage } = newChatMessageNotification;
    const { chatRoomId } = chatMessage;

    const { mapOfSubscribedChatChannelsToReceivedChatMessages } = get();

    const updatedMapOfSubscribedChatChannelsToReceivedChatMessages = new Map(
      mapOfSubscribedChatChannelsToReceivedChatMessages,
    );

    if (updatedMapOfSubscribedChatChannelsToReceivedChatMessages.has(chatRoomId)) {
      const oldChatMessages =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        updatedMapOfSubscribedChatChannelsToReceivedChatMessages.get(chatRoomId)!;
      const newChatMessages = [...oldChatMessages, chatMessage];

      updatedMapOfSubscribedChatChannelsToReceivedChatMessages.set(
        chatRoomId,
        newChatMessages,
      );
    }

    try {
      if (
        Router.pathname.includes("/messages/") &&
        chatRoomId === Router.query.chatRoomId
      ) {
        Api.markChatRoomAsRead({ chatRoomId });
      }
    } catch (error) {
      console.log(error);
    }

    set({
      updatedCountOfUnreadChatRooms: countOfUnreadChatRooms,
      mapOfSubscribedChatChannelsToReceivedChatMessages:
        updatedMapOfSubscribedChatChannelsToReceivedChatMessages,
    });
  };
