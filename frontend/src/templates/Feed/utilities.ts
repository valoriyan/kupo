import { UserContentFeedFilter, UserContentFeedFilterType } from "#/api";

export function getContentFeedFilterDisplayName(
  contentFeedFilter: UserContentFeedFilter,
) {
  if (!contentFeedFilter.value) {
    return contentFeedFilter.contentFeedFilterId;
  } else if (contentFeedFilter.type === UserContentFeedFilterType.Username) {
    return `@${contentFeedFilter.value}`;
  } else if (contentFeedFilter.type === UserContentFeedFilterType.Hashtag) {
    return `#${contentFeedFilter.value}`;
  } else if (contentFeedFilter.type === UserContentFeedFilterType.PublishingChannel) {
    return `+${contentFeedFilter.value}`;
  } else {
    throw new Error(`Unknown content feed filter type: ${contentFeedFilter.type}`);
  }
}
