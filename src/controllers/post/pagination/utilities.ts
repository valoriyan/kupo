import { RenderablePost } from "../models";

export function getEncodedNextPageCursor({
  renderablePosts,
}: {
  renderablePosts: RenderablePost[];
}): string | undefined {
  const encodedNextPageCursor =
    renderablePosts.length > 0
      ? Buffer.from(
          String(
            renderablePosts[renderablePosts.length - 1]?.scheduledPublicationTimestamp,
          ),
          "binary",
        ).toString("base64")
      : undefined;

  return encodedNextPageCursor;
}
