import { UserContentFeedFilter, UserContentFeedFilterType } from "#/api";

export function generateContentFeedFilterDisplayName({
  userContentFeedFilter,
}: {
  userContentFeedFilter: UserContentFeedFilter;
}) {
  if (userContentFeedFilter.type === UserContentFeedFilterType.Username) {
    return `@${userContentFeedFilter.value}`;
  } else if (userContentFeedFilter.type === UserContentFeedFilterType.Hashtag) {
    return `#${userContentFeedFilter.value}`;
  } else if (userContentFeedFilter.type === UserContentFeedFilterType.FollowingUsers) {
    return `Following`;
  } else if (userContentFeedFilter.type === UserContentFeedFilterType.AllPostsForAdmins) {
    return `ALL POSTS`;
  } else {
    throw new Error(`Unknown content feed filter type: ${userContentFeedFilter.type}`);
  }
}
