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