// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPostsByUserIdParams {}

export interface RenderedPost {
  id: string;
  userId: string;
  creationTimestamp: number;

  imageUrls?: string[];
  videoUrls?: string[];

  caption: string;
}

export interface SuccessfulGetPostsByUserIdResponse {
  posts: RenderedPost[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedtoGetPostsByUserIdResponse {}

export async function handleGetPostsByUserId() {
  // needs to be paginated (limit, offset)
  // needs to filter out posts by expiration and scheduled publication timestamp
  // check if requesting user is allowed to view posts - 403
}
