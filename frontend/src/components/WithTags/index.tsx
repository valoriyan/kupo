import Link from "next/link";
import { Fragment } from "react";
import { setPreviousLocationForHashTagPage } from "#/templates/PostsByHashTag";
import {
  getCommunityPageUrl,
  getPostsByHashtagUrl,
  getProfilePageUrl,
} from "#/utils/generateLinkUrls";

export interface WithTagsProps {
  text: string;
}

/** Takes a piece of text and turns any users, communities, or hashtags into links */
export const WithTags = ({ text }: WithTagsProps) => {
  return (
    <>
      {text.split(/(\B(?:@|\+|#)\w+)/g).map((chunk, i) => (
        <Fragment key={i}>
          {chunk.match(/\B@\w+/)?.length ? (
            <Link href={getProfilePageUrl({ username: chunk.split("@")[1] })} passHref>
              <a>{chunk}</a>
            </Link>
          ) : chunk.match(/\B\+\w+/)?.length ? (
            <Link href={getCommunityPageUrl({ name: chunk.split("+")[1] })} passHref>
              <a>{chunk}</a>
            </Link>
          ) : chunk.match(/\B#\w+/)?.length ? (
            <Link href={getPostsByHashtagUrl(chunk.split("#")[1])} passHref>
              <a onClick={() => setPreviousLocationForHashTagPage(chunk.split("#")[1])}>
                {chunk}
              </a>
            </Link>
          ) : (
            chunk
          )}
        </Fragment>
      ))}
    </>
  );
};
