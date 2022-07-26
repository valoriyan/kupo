import { RenderableUser } from "../../user/models";

export interface UnrenderableChatMessage {
  chatMessageId: string;
  text: string;
  authorUserId: string;
  chatRoomId: string;
  creationTimestamp: number;
}

export interface RenderableChatMessage {
  chatMessageId: string;
  text: string;
  authorUserId: string;
  chatRoomId: string;
  creationTimestamp: number;
}

export interface UnrenderableChatRoomPreview {
  chatRoomId: string;
  memberUserIds: string[];
}

export interface RenderableChatRoomPreview {
  chatRoomId: string;
  members: RenderableUser[];
}

export interface NewChatMessageNotification {
  countOfUnreadChatRooms: number;
  chatMessage: RenderableChatMessage;
}
