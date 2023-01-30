import Link from "next/link";
import { Fragment } from "react";
import { setPreviousLocationForCommunityPage } from "#/templates/CommunityPage";
import { setPreviousLocationForHashTagPage } from "#/templates/PostsByHashTag";
import { setPreviousLocationForUserProfilePage } from "#/templates/UserProfile";
import {
  getCommunityPageUrl,
  getPostsByHashtagUrl,
  getProfilePageUrl,
} from "#/utils/generateLinkUrls";
import { getExternalLink } from "#/utils/getExternalLink";

const MATCH_URL =
  /((?:https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
const MATCH_ANY_TAGS = /(\B(?:@|\+|#)\w+)/g;
const MATCH_USER = /\B@\w+/;
const MATCH_COMMUNITY = /\B\+\w+/;
const MATCH_HASHTAG = /\B#\w+/;

export interface WithTagsProps {
  text: string;
}

/** Takes a piece of text and turns any urls, users, communities, or hashtags into links */
export const WithTags = ({ text }: WithTagsProps) => {
  return (
    <>
      {text.split(MATCH_URL).map((chunk, i) => (
        <Fragment key={i}>
          {chunk.match(MATCH_URL)?.length ? (
            <a target="_blank" rel="noopener noreferrer" href={getExternalLink(chunk)}>
              {chunk}
            </a>
          ) : (
            <>
              {chunk.split(MATCH_ANY_TAGS).map((chunk, i) => (
                <Fragment key={i}>
                  {chunk.match(MATCH_USER)?.length ? (
                    <InternalLink
                      label={chunk}
                      href={getProfilePageUrl({ username: chunk.split("@")[1] })}
                      onClick={() =>
                        setPreviousLocationForUserProfilePage(chunk.split("@")[1])
                      }
                    />
                  ) : chunk.match(MATCH_COMMUNITY)?.length ? (
                    <InternalLink
                      label={chunk}
                      href={getCommunityPageUrl({ name: chunk.split("+")[1] })}
                      onClick={() =>
                        setPreviousLocationForCommunityPage(chunk.split("+")[1])
                      }
                    />
                  ) : chunk.match(MATCH_HASHTAG)?.length ? (
                    <InternalLink
                      label={chunk}
                      href={getPostsByHashtagUrl(chunk.split("#")[1])}
                      onClick={() =>
                        setPreviousLocationForHashTagPage(chunk.split("#")[1])
                      }
                    />
                  ) : (
                    chunk
                  )}
                </Fragment>
              ))}
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};

const InternalLink = (props: { label: string; href: string; onClick: () => void }) => (
  <Link href={props.href} passHref>
    <a onClick={props.onClick}>{props.label}</a>
  </Link>
);
