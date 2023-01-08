import { RenderablePost, RootRenderablePost, SharedRenderablePost } from "../models";

export function getPreviewTemporaryUrlFromRenderablePost({
  renderablePost,
}: {
  renderablePost: RenderablePost;
}): string {
  let rootRenderablePost: RootRenderablePost;

  if (!!(renderablePost as SharedRenderablePost).sharedItem) {
    rootRenderablePost = (renderablePost as SharedRenderablePost).sharedItem;
  } else {
    rootRenderablePost = renderablePost as RootRenderablePost;
  }

  if (rootRenderablePost.mediaElements.length === 0) {
    return "";
  } else {
    return rootRenderablePost.mediaElements[0].temporaryUrl;
  }
}
