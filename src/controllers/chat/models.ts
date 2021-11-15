import { RenderableUser } from "../user/models";

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

export interface UnrenderableChatRoom {
  chatRoomId: string;
  memberUserIds: string[];
}

export interface RenderableChatRoom {
  chatRoomId: string;
  members: RenderableUser[];
}
