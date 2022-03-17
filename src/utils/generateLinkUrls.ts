import Router from "next/router";

export const getProfilePageUrl = ({ username }: { username: string }) =>
  `/profile/${username}`;

export const goToPostPage = (postId: string) => {
  Router.push({
    query: { backTo: Router.asPath },
    pathname: `/post/${postId}`,
  });
};

export const goToPostByHashTagPage = (hashtag: string) => {
  Router.push({
    query: { backTo: Router.asPath },
    pathname: `/posts/${hashtag}`,
  });
};
