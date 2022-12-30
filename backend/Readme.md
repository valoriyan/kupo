## Naming Convention

- assembler = a method that collects the various pieces of a renderable item
  - assemble--{plural}--FromCachedComponents
  - assemble--{singular}--FromCachedComponents
  - assemble--{plural}--ByIds
  - assemble--{singular}--ById

## Remaining files to add comments to in Controller

./user/utilities/constructRenderableUserFromParts.ts
./user/utilities/mergeArraysOfUnrenderableUsers.ts
./user/utilities/index.ts
./user/handleGetUserProfile.ts
./user/handleUpdateUserProfilePicture.ts
./user/handleSetUserHashtags.ts
./user/handleGetClientUserProfile.ts
./user/handleUpdateUserProfile.ts
./user/handleSearchUserProfilesByUsername.ts
./user/models.ts
./user/userPageController.ts
./models
./models/index.ts
./utilities
./utilities/pagination
./utilities/pagination/index.ts
./utilities/shareTypesWithFrontendController.ts
./utilities/collectTagsFromText.ts
./feed
./feed/handleGetPageOfAllPublishedItems.ts
./feed/handleGetPublishedItemsFromFollowedUsers.ts
./feed/handleSetUserContentFeedFilters.ts
./feed/handleGetPublishedItemsFromFollowedHashtag.ts
./feed/handleGetUserContentFeedFilters.ts
./feed/feedController.ts
./feed/models.ts
./publishingChannel
./publishingChannel/handleGetPublishingChannelByName.ts
./publishingChannel/publishingChannelController.ts
./publishingChannel/userInteraction
./publishingChannel/userInteraction/handleFollowPublishingChannel.ts
./publishingChannel/userInteraction/handleUnfollowPublishingChannel.ts
./publishingChannel/userInteraction/handleGetPublishingChannelsFollowedByUserId.ts
./publishingChannel/userInteraction/handleSubmitPublishedItemToPublishingChannel.ts
./publishingChannel/utilities
./publishingChannel/utilities/assembleRenderablePublishingChannel
./publishingChannel/utilities/assembleRenderablePublishingChannel/assembleRenderablePublishingChannelFromParts.ts
./publishingChannel/utilities/assembleRenderablePublishingChannel/index.ts
./publishingChannel/utilities/permissions.ts
./publishingChannel/creation/validations.ts
