import { RenderablePost } from "#/api";

export interface PostProps {
  post: RenderablePost;
}

export const Post = (props: PostProps) => {
  console.log(props);
  return <div>Post</div>;
};
