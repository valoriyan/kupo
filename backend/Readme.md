## Naming Convention

- assembler = a method that collects the various pieces of a renderable item
  - assemble--{plural}--FromCachedComponents
  - assemble--{singular}--FromCachedComponents
  - assemble--{plural}--ByIds
  - assemble--{singular}--ById

## Remaining files to add comments to in Controller

./publishedItem/utilities/constructPublishedItemsFromParts.ts
./publishedItem/publishedItemInteraction/handleRemoveUserLikeFromPublishedItem.ts
./publishedItem/utilities/assembleBaseRenderablePublishedItem.ts
./publishedItem/utilities/pagination.ts
./publishedItem/utilities/viewingRights
./publishedItem/utilities/viewingRights/index.ts
./publishedItem/utilities/deleteBasePublishedItemComponents.ts
./publishedItem/utilities/mergeArraysOfUncompiledBasePublishedItem.ts
./publishedItem/shopItem
./publishedItem/shopItem/payments
./publishedItem/shopItem/payments/getCreditCardsStoredByUserId.ts
./publishedItem/shopItem/payments/makeCreditCardPrimary.ts
./publishedItem/shopItem/payments/handlePurchaseShopItem.ts
./publishedItem/shopItem/payments/storeCreditCard.ts
./publishedItem/shopItem/payments/removeCreditCard.ts
./publishedItem/shopItem/payments/models.ts
./publishedItem/shopItem/shopItemController.ts
./publishedItem/shopItem/utilities
./publishedItem/shopItem/utilities/assembleRootPurchasedShopItemDetailsFromParts.ts
./publishedItem/shopItem/utilities/assembleShopItemMediaElements.ts
./publishedItem/shopItem/utilities/index.ts
./publishedItem/shopItem/utilities/assembleRootShopItemPreviewFromParts.ts
./publishedItem/shopItem/handleDeleteShopItem.ts
./publishedItem/shopItem/handleCreateShopItem.ts
./publishedItem/shopItem/handleUpdateShopItem.ts
./publishedItem/shopItem/models.ts
./publishedItem/handleGetPublishedItemById.ts
./publishedItem/handleGetPublishedItems.ts
./user/handleGetPageOfUsersFollowingUserId.ts
./user/handleGetUsersByUsernames.ts
./user/handleGetPageOfUsersFollowedByUserId.ts
./user/userInteraction/handleUnfollowUserProfile/deleteAndEmitCanceledNewFollowerNotification.ts
./user/userInteraction/handleUnfollowUserProfile/index.ts
./user/userInteraction/handleResolveAllFollowRequests.ts
./user/userInteraction/handleBlockUser.ts
./user/userInteraction/handleUnblockUser.ts
./user/userInteraction/utilities
./user/userInteraction/utilities/generateAndEmitAcceptedUserFollowRequestNotification.ts
./user/userInteraction/utilities/deleteAndEmitCanceledAcceptedUserFollowRequestNotification.ts
./user/userInteraction/handleFollowUserProfile
./user/userInteraction/handleFollowUserProfile/generateAndEmitNewFollowerRequestNotification.ts
./user/userInteraction/handleFollowUserProfile/generateAndEmitNewFollowerNotification.ts
./user/userInteraction/handleFollowUserProfile/index.ts
./user/userInteraction/handleRevokeFollower.ts
./user/userInteraction/models.ts
./user/userInteraction/handleResolveFollowRequest.ts
./user/handleGetUsersByIds.ts
./user/handleUpdateUserBackgroundImage.ts
./user/utilities
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
