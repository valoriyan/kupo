export const getProfilePageUrl = ({ username }: { username: string }) =>
  `/profile/${username}`;

export const getSinglePostUrl = (postId: string) => `/post/${postId}`;

export const getPostsByHashtagUrl = (hashtag: string) => `/posts/${hashtag}`;

export const getCommunityPageUrl = ({ name }: { name: string }) => `/community/${name}`;
