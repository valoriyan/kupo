export function generatePrivateUserWebSocketRoomName({
  userId,
}: {
  userId: string;
}): string {
  return `user:${userId}`;
}
