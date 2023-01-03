import Router from "next/router";
import { GetState, SetState } from "zustand";
import { Api, NewChatMessageNotification } from "#/api";
import { WebsocketState } from ".";

export const getNewChatMessageNotificationHandler =
  ({ set, get }: { set: SetState<WebsocketState>; get: GetState<WebsocketState> }) =>
  (newChatMessageNotification: NewChatMessageNotification) => {
    console.log(newChatMessageNotification);

    const { countOfUnreadChatRooms, chatMessage } = newChatMessageNotification;
    const { chatRoomId } = chatMessage;

    const { receivedChatMessagesByChatRoomId } = get();

    const updatedReceivedChatMessagesByChatRoomId = new Map(
      receivedChatMessagesByChatRoomId,
    );

    if (updatedReceivedChatMessagesByChatRoomId.has(chatRoomId)) {
      const oldChatMessages =
        updatedReceivedChatMessagesByChatRoomId.get(chatRoomId) ?? [];
      const newChatMessages = [...oldChatMessages, chatMessage];

      updatedReceivedChatMessagesByChatRoomId.set(chatRoomId, newChatMessages);
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
      receivedChatMessagesByChatRoomId: updatedReceivedChatMessagesByChatRoomId,
    });
  };
