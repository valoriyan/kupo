import { UserContentFeedFilter, UserContentFeedFilterType } from "#/api";

export function generateContentFeedFilterDisplayName({
  userContentFeedFilter,
}: {
  userContentFeedFilter: UserContentFeedFilter;
}) {
  if (!userContentFeedFilter.value) {
    return userContentFeedFilter.contentFeedFilterId;
  } else if (userContentFeedFilter.type === UserContentFeedFilterType.Username) {
    return `@${userContentFeedFilter.value}`;
  } else if (userContentFeedFilter.type === UserContentFeedFilterType.Hashtag) {
    return `#${userContentFeedFilter.value}`;
  } else if (userContentFeedFilter.type === UserContentFeedFilterType.PublishingChannel) {
    return `+${userContentFeedFilter.value}`;
  } else {
    throw new Error(`Unknown content feed filter type: ${userContentFeedFilter.type}`);
  }
}
