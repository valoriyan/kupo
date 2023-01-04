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

export interface UnrenderableChatRoomWithJoinedUsers {
  chatRoomId: string;
  memberUserIds: string[];
}

export interface RenderableChatRoomWithJoinedUsers {
  chatRoomId: string;
  members: RenderableUser[];
  hasUnreadMessages: boolean;
}

export interface NewChatMessageNotification {
  countOfUnreadChatRooms: number;
  chatMessage: RenderableChatMessage;
}
