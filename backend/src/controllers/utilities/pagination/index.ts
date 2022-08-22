export function encodeTimestampCursor({ timestamp }: { timestamp: number }) {
  return Buffer.from(String(timestamp), "binary").toString("base64");
}

export function decodeTimestampCursor({
  encodedCursor,
}: {
  encodedCursor: string;
}): number {
  const decodedCursor = Number(Buffer.from(encodedCursor, "base64").toString("binary"));
  return decodedCursor;
}
