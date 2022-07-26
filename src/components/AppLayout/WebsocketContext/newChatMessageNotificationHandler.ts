import { GetState, SetState } from "zustand";
import { NewChatMessageNotification } from "#/api";
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
        updatedMapOfSubscribedChatChannelsToReceivedChatMessages.get(chatRoomId)!;
      const newChatMessages = [...oldChatMessages, chatMessage];

      updatedMapOfSubscribedChatChannelsToReceivedChatMessages.set(
        chatRoomId,
        newChatMessages,
      );
    }

    set({
      updatedCountOfUnreadChatRooms: countOfUnreadChatRooms,
      mapOfSubscribedChatChannelsToReceivedChatMessages:
        updatedMapOfSubscribedChatChannelsToReceivedChatMessages,
    });
  };
