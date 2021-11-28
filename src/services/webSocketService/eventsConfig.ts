export const DELETED_CHAT_MESSAGE_EVENT_NAME = "DELETED_CHAT_MESSAGE_EVENT_NAME";
export const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";

export const NEW_POST_NOTIFICATION_EVENT_NAME = "NEW_POST_NOTIFICATION";

export interface NewChatNotification {
  username: string;
  previewTemporaryUrl: string;
}
