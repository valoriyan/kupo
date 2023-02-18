# DefaultAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addModeratorToPublishingChannel**](DefaultAPI.md#addmoderatortopublishingchannel) | **POST** /publishing_channel/addModeratorToPublishingChannel | 
[**banUserFromPublishingChannel**](DefaultAPI.md#banuserfrompublishingchannel) | **POST** /publishing_channel/banUserFromPublishingChannel | 
[**blockUser**](DefaultAPI.md#blockuser) | **POST** /userInteractions/blockUser | 
[**checkResetPasswordTokenValidity**](DefaultAPI.md#checkresetpasswordtokenvalidity) | **POST** /auth/checkResetPasswordTokenValidity | 
[**createChatMessage**](DefaultAPI.md#createchatmessage) | **POST** /chat/create | 
[**createChatMessageInNewChatRoom**](DefaultAPI.md#createchatmessageinnewchatroom) | **POST** /chat/createChatMessageInNewChatRoom | 
[**createPost**](DefaultAPI.md#createpost) | **POST** /post/createPost | 
[**createPublishedItemComment**](DefaultAPI.md#createpublisheditemcomment) | **POST** /PublishedItemComment/createPublishedItemComment | 
[**createPublishingChannel**](DefaultAPI.md#createpublishingchannel) | **POST** /publishing_channel/createPublishingChannel | 
[**createShopItem**](DefaultAPI.md#createshopitem) | **POST** /shopitem/create | 
[**deleteChatMessage**](DefaultAPI.md#deletechatmessage) | **POST** /chat/deleteChatMessage | 
[**deletePost**](DefaultAPI.md#deletepost) | **DELETE** /post/deletePost | 
[**deletePublishedItemComment**](DefaultAPI.md#deletepublisheditemcomment) | **DELETE** /PublishedItemComment/deletePublishedItemComment | 
[**deletePublishingChannel**](DefaultAPI.md#deletepublishingchannel) | **POST** /publishing_channel/deletePublishingChannel | 
[**deleteShopItem**](DefaultAPI.md#deleteshopitem) | **DELETE** /shopitem/delete | 
[**doesChatRoomExistWithUserIds**](DefaultAPI.md#doeschatroomexistwithuserids) | **POST** /chat/doesChatRoomExistWithUserIds | 
[**elevateUserToAdmin**](DefaultAPI.md#elevateusertoadmin) | **POST** /auth/elevateUserToAdmin | 
[**followPublishingChannel**](DefaultAPI.md#followpublishingchannel) | **POST** /publishing_channel/followPublishingChannel | 
[**followUser**](DefaultAPI.md#followuser) | **POST** /userInteractions/followUser | 
[**getChatRoomById**](DefaultAPI.md#getchatroombyid) | **POST** /chat/getChatRoomById | 
[**getClientUserProfile**](DefaultAPI.md#getclientuserprofile) | **POST** /user/GetClientUserProfile | 
[**getCountOfUnreadChatRooms**](DefaultAPI.md#getcountofunreadchatrooms) | **POST** /chat/getCountOfUnreadChatRooms | 
[**getCountOfUnreadNotifications**](DefaultAPI.md#getcountofunreadnotifications) | **POST** /notification/getCountOfUnreadNotifications | 
[**getCreditCardsStoredByUserId**](DefaultAPI.md#getcreditcardsstoredbyuserid) | **POST** /shopitem/getCreditCardsStoredByUserId | 
[**getFollowerRequests**](DefaultAPI.md#getfollowerrequests) | **POST** /userInteractions/getFollowerRequests | 
[**getPageOfALLPUBLISHEDITEMS**](DefaultAPI.md#getpageofallpublisheditems) | **POST** /feed/getPageOf_ALL_PUBLISHED_ITEMS | 
[**getPageOfChatMessages**](DefaultAPI.md#getpageofchatmessages) | **POST** /chat/getPageOfChatMessages | 
[**getPageOfChatRooms**](DefaultAPI.md#getpageofchatrooms) | **POST** /chat/getPageOfChatRooms | 
[**getPageOfNotifications**](DefaultAPI.md#getpageofnotifications) | **POST** /notification/getPageOfNotifications | 
[**getPageOfUsersFollowedByUserId**](DefaultAPI.md#getpageofusersfollowedbyuserid) | **POST** /user/getPageOfUsersFollowedByUserId | 
[**getPageOfUsersFollowingUserId**](DefaultAPI.md#getpageofusersfollowinguserid) | **POST** /user/getPageOfUsersFollowingUserId | 
[**getPasswordResetEmail**](DefaultAPI.md#getpasswordresetemail) | **POST** /auth/getPasswordResetEmail | 
[**getPostsScheduledByUser**](DefaultAPI.md#getpostsscheduledbyuser) | **POST** /post/getPostsScheduledByUser | 
[**getPublishedItemById**](DefaultAPI.md#getpublisheditembyid) | **POST** /post/getPublishedItemById | 
[**getPublishedItemsByUserId**](DefaultAPI.md#getpublisheditemsbyuserid) | **POST** /post/getPublishedItemsByUserId | 
[**getPublishedItemsByUsername**](DefaultAPI.md#getpublisheditemsbyusername) | **POST** /post/getPublishedItemsByUsername | 
[**getPublishedItemsFromAllFollowings**](DefaultAPI.md#getpublisheditemsfromallfollowings) | **POST** /feed/getPublishedItemsFromAllFollowings | 
[**getPublishedItemsFromFollowedHashtag**](DefaultAPI.md#getpublisheditemsfromfollowedhashtag) | **POST** /feed/getPublishedItemsFromFollowedHashtag | 
[**getPublishedItemsFromFollowedUsers**](DefaultAPI.md#getpublisheditemsfromfollowedusers) | **POST** /feed/getPublishedItemsFromFollowedUsers | 
[**getPublishedItemsInPublishingChannel**](DefaultAPI.md#getpublisheditemsinpublishingchannel) | **POST** /publishing_channel/getPublishedItemsInPublishingChannel | 
[**getPublishingChannelByName**](DefaultAPI.md#getpublishingchannelbyname) | **POST** /publishing_channel/getPublishingChannelByName | 
[**getPublishingChannelNameValidity**](DefaultAPI.md#getpublishingchannelnamevalidity) | **POST** /publishing_channel/getPublishingChannelNameValidity | 
[**getPublishingChannelSubmissions**](DefaultAPI.md#getpublishingchannelsubmissions) | **POST** /publishing_channel/getPublishingChannelSubmissions | 
[**getPublishingChannelsFollowedByUserId**](DefaultAPI.md#getpublishingchannelsfollowedbyuserid) | **POST** /publishing_channel/getPublishingChannelsFollowedByUserId | 
[**getRecommendedPublishedItems**](DefaultAPI.md#getrecommendedpublisheditems) | **POST** /discover/getRecommendedPublishedItems | 
[**getRecommendedPublishingChannels**](DefaultAPI.md#getrecommendedpublishingchannels) | **POST** /discover/getRecommendedPublishingChannels | 
[**getRecommendedUsersToFollow**](DefaultAPI.md#getrecommendeduserstofollow) | **POST** /discover/getRecommendedUsersToFollow | 
[**getSavedPublishedItems**](DefaultAPI.md#getsavedpublisheditems) | **POST** /post/getSavedPublishedItems | 
[**getUserContentFeedFilters**](DefaultAPI.md#getusercontentfeedfilters) | **POST** /feed/getUserContentFeedFilters | 
[**getUserProfile**](DefaultAPI.md#getuserprofile) | **POST** /user/GetUserProfile | 
[**getUsersByIds**](DefaultAPI.md#getusersbyids) | **POST** /user/getUsersByIds | 
[**getUsersByUsernames**](DefaultAPI.md#getusersbyusernames) | **POST** /user/getUsersByUsernames | 
[**getVerifyUserEmail**](DefaultAPI.md#getverifyuseremail) | **POST** /auth/getVerifyUserEmail | 
[**inviteUserToFollowPublishingChannel**](DefaultAPI.md#inviteusertofollowpublishingchannel) | **POST** /publishing_channel/inviteUserToFollowPublishingChannel | 
[**loginUser**](DefaultAPI.md#loginuser) | **POST** /auth/login | 
[**logout**](DefaultAPI.md#logout) | **GET** /auth/logout | 
[**makeCardPrimary**](DefaultAPI.md#makecardprimary) | **DELETE** /shopitem/makeCardPrimary | 
[**markChatRoomAsRead**](DefaultAPI.md#markchatroomasread) | **POST** /chat/markChatRoomAsRead | 
[**purchaseShopItem**](DefaultAPI.md#purchaseshopitem) | **POST** /shopitem/purchaseShopItem | 
[**readPageOfCommentsByPublishedItemId**](DefaultAPI.md#readpageofcommentsbypublisheditemid) | **POST** /PublishedItemComment/readPageOfCommentsByPublishedItemId | 
[**refreshAccessToken**](DefaultAPI.md#refreshaccesstoken) | **GET** /auth/refresh-access-token | 
[**registerUser**](DefaultAPI.md#registeruser) | **POST** /auth/register | 
[**removeCreditCard**](DefaultAPI.md#removecreditcard) | **DELETE** /shopitem/removeCreditCard | 
[**removeModeratorFromPublishingChannel**](DefaultAPI.md#removemoderatorfrompublishingchannel) | **POST** /publishing_channel/removeModeratorFromPublishingChannel | 
[**removeUserLikeFromPublishedItem**](DefaultAPI.md#removeuserlikefrompublisheditem) | **DELETE** /publishedItemInteractions/removeUserLikeFromPublishedItem | 
[**resetPassword**](DefaultAPI.md#resetpassword) | **POST** /auth/resetPassword | 
[**resolveAllFollowRequests**](DefaultAPI.md#resolveallfollowrequests) | **POST** /userInteractions/resolveAllFollowRequests | 
[**resolveFollowRequest**](DefaultAPI.md#resolvefollowrequest) | **POST** /userInteractions/resolveFollowRequest | 
[**resolvePublishingChannelSubmission**](DefaultAPI.md#resolvepublishingchannelsubmission) | **POST** /publishing_channel/resolvePublishingChannelSubmission | 
[**revokeFollower**](DefaultAPI.md#revokefollower) | **DELETE** /userInteractions/revokeFollower | 
[**searchForHashtags**](DefaultAPI.md#searchforhashtags) | **POST** /discover/searchForHashtags | 
[**searchForPosts**](DefaultAPI.md#searchforposts) | **POST** /discover/searchForPosts | 
[**searchForPublishingChannels**](DefaultAPI.md#searchforpublishingchannels) | **POST** /discover/searchForPublishingChannels | 
[**searchForUsers**](DefaultAPI.md#searchforusers) | **POST** /discover/searchForUsers | 
[**searchUserProfilesByUsername**](DefaultAPI.md#searchuserprofilesbyusername) | **POST** /user/SearchUserProfilesByUsername | 
[**sendDataTypesToFrontend1**](DefaultAPI.md#senddatatypestofrontend1) | **POST** /utilities/sendDataTypesToFrontend1 | 
[**setUserContentFeedFilters**](DefaultAPI.md#setusercontentfeedfilters) | **POST** /feed/setUserContentFeedFilters | 
[**setUserHashtags**](DefaultAPI.md#setuserhashtags) | **POST** /user/SetUserHashtags | 
[**sharePost**](DefaultAPI.md#sharepost) | **POST** /post/sharePost | 
[**storeCreditCard**](DefaultAPI.md#storecreditcard) | **POST** /shopitem/storeCreditCard | 
[**submitPublishedItemToPublishingChannel**](DefaultAPI.md#submitpublisheditemtopublishingchannel) | **POST** /publishing_channel/submitPublishedItemToPublishingChannel | 
[**unblockUser**](DefaultAPI.md#unblockuser) | **POST** /userInteractions/unblockUser | 
[**undoBanUserFromPublishingChannel**](DefaultAPI.md#undobanuserfrompublishingchannel) | **POST** /publishing_channel/undoBanUserFromPublishingChannel | 
[**unfollowPublishingChannel**](DefaultAPI.md#unfollowpublishingchannel) | **POST** /publishing_channel/unfollowPublishingChannel | 
[**unfollowUser**](DefaultAPI.md#unfollowuser) | **DELETE** /userInteractions/unfollowUser | 
[**updatePassword**](DefaultAPI.md#updatepassword) | **POST** /auth/updatePassword | 
[**updatePost**](DefaultAPI.md#updatepost) | **POST** /post/updatePost | 
[**updatePublishingChannel**](DefaultAPI.md#updatepublishingchannel) | **POST** /publishing_channel/updatePublishingChannel | 
[**updatePublishingChannelBackgroundImage**](DefaultAPI.md#updatepublishingchannelbackgroundimage) | **POST** /publishing_channel/updatePublishingChannelBackgroundImage | 
[**updatePublishingChannelProfilePicture**](DefaultAPI.md#updatepublishingchannelprofilepicture) | **POST** /publishing_channel/updatePublishingChannelProfilePicture | 
[**updateShopItem**](DefaultAPI.md#updateshopitem) | **POST** /shopitem/update | 
[**updateUserBackgroundImage**](DefaultAPI.md#updateuserbackgroundimage) | **POST** /user/UpdateUserBackgroundImage | 
[**updateUserProfile**](DefaultAPI.md#updateuserprofile) | **POST** /user/UpdateUserProfile | 
[**updateUserProfilePicture**](DefaultAPI.md#updateuserprofilepicture) | **POST** /user/UpdateUserProfilePicture | 
[**uploadFile**](DefaultAPI.md#uploadfile) | **POST** /file_upload/uploadFile | 
[**userLikesPublishedItem**](DefaultAPI.md#userlikespublisheditem) | **POST** /publishedItemInteractions/userLikesPublishedItem | 
[**userSavesPublishedItem**](DefaultAPI.md#usersavespublisheditem) | **POST** /publishedItemInteractions/userSavesPublishedItem | 
[**userUnsavesPublishedItem**](DefaultAPI.md#userunsavespublisheditem) | **DELETE** /publishedItemInteractions/userUnsavesPublishedItem | 
[**verifyUserEmail**](DefaultAPI.md#verifyuseremail) | **POST** /auth/verifyUserEmail | 


# **addModeratorToPublishingChannel**
```swift
    open class func addModeratorToPublishingChannel(addModeratorToPublishingChannelRequestBody: AddModeratorToPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrAddModeratorToPublishingChannelFailedReasonAddModeratorToPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let addModeratorToPublishingChannelRequestBody = AddModeratorToPublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example", moderatorUserId: "moderatorUserId_example") // AddModeratorToPublishingChannelRequestBody | 

DefaultAPI.addModeratorToPublishingChannel(addModeratorToPublishingChannelRequestBody: addModeratorToPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addModeratorToPublishingChannelRequestBody** | [**AddModeratorToPublishingChannelRequestBody**](AddModeratorToPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrAddModeratorToPublishingChannelFailedReasonAddModeratorToPublishingChannelSuccess**](EitherErrorReasonTypesStringOrAddModeratorToPublishingChannelFailedReasonAddModeratorToPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **banUserFromPublishingChannel**
```swift
    open class func banUserFromPublishingChannel(banUserFromPublishingChannelRequestBody: BanUserFromPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrBanUserFromPublishingChannelFailedReasonBanUserFromPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let banUserFromPublishingChannelRequestBody = BanUserFromPublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example", bannedUserId: "bannedUserId_example") // BanUserFromPublishingChannelRequestBody | 

DefaultAPI.banUserFromPublishingChannel(banUserFromPublishingChannelRequestBody: banUserFromPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **banUserFromPublishingChannelRequestBody** | [**BanUserFromPublishingChannelRequestBody**](BanUserFromPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrBanUserFromPublishingChannelFailedReasonBanUserFromPublishingChannelSuccess**](EitherErrorReasonTypesStringOrBanUserFromPublishingChannelFailedReasonBanUserFromPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blockUser**
```swift
    open class func blockUser(blockUserRequestBody: BlockUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrBlockUserFailedReasonBlockUserSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let blockUserRequestBody = BlockUserRequestBody(blockedUserId: "blockedUserId_example") // BlockUserRequestBody | 

DefaultAPI.blockUser(blockUserRequestBody: blockUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blockUserRequestBody** | [**BlockUserRequestBody**](BlockUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrBlockUserFailedReasonBlockUserSuccess**](EitherErrorReasonTypesStringOrBlockUserFailedReasonBlockUserSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **checkResetPasswordTokenValidity**
```swift
    open class func checkResetPasswordTokenValidity(checkResetPasswordTokenValidityRequestBody: CheckResetPasswordTokenValidityRequestBody, completion: @escaping (_ data: EitherCheckResetPasswordTokenValidityFailedReasonCheckResetPasswordTokenValiditySuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let checkResetPasswordTokenValidityRequestBody = CheckResetPasswordTokenValidityRequestBody(token: "token_example") // CheckResetPasswordTokenValidityRequestBody | 

DefaultAPI.checkResetPasswordTokenValidity(checkResetPasswordTokenValidityRequestBody: checkResetPasswordTokenValidityRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checkResetPasswordTokenValidityRequestBody** | [**CheckResetPasswordTokenValidityRequestBody**](CheckResetPasswordTokenValidityRequestBody.md) |  | 

### Return type

[**EitherCheckResetPasswordTokenValidityFailedReasonCheckResetPasswordTokenValiditySuccess**](EitherCheckResetPasswordTokenValidityFailedReasonCheckResetPasswordTokenValiditySuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createChatMessage**
```swift
    open class func createChatMessage(createChatMessageRequestBody: CreateChatMessageRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createChatMessageRequestBody = CreateChatMessageRequestBody(chatMessageText: "chatMessageText_example", chatRoomId: "chatRoomId_example") // CreateChatMessageRequestBody | 

DefaultAPI.createChatMessage(createChatMessageRequestBody: createChatMessageRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createChatMessageRequestBody** | [**CreateChatMessageRequestBody**](CreateChatMessageRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess**](EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createChatMessageInNewChatRoom**
```swift
    open class func createChatMessageInNewChatRoom(createChatMessageInNewRoomRequestBody: CreateChatMessageInNewRoomRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createChatMessageInNewRoomRequestBody = CreateChatMessageInNewRoomRequestBody(chatMessageText: "chatMessageText_example", userIds: ["userIds_example"]) // CreateChatMessageInNewRoomRequestBody | 

DefaultAPI.createChatMessageInNewChatRoom(createChatMessageInNewRoomRequestBody: createChatMessageInNewRoomRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createChatMessageInNewRoomRequestBody** | [**CreateChatMessageInNewRoomRequestBody**](CreateChatMessageInNewRoomRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess**](EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPost**
```swift
    open class func createPost(createPostRequestBody: CreatePostRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrCreatePostFailedReasonCreatePostSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createPostRequestBody = CreatePostRequestBody(contentElementFiles: [FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example")], caption: "caption_example", hashtags: ["hashtags_example"], scheduledPublicationTimestamp: 123, expirationTimestamp: 123) // CreatePostRequestBody | 

DefaultAPI.createPost(createPostRequestBody: createPostRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPostRequestBody** | [**CreatePostRequestBody**](CreatePostRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrCreatePostFailedReasonCreatePostSuccess**](EitherErrorReasonTypesStringOrCreatePostFailedReasonCreatePostSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPublishedItemComment**
```swift
    open class func createPublishedItemComment(createPublishedItemCommentRequestBody: CreatePublishedItemCommentRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonCreatePublishedItemCommentSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createPublishedItemCommentRequestBody = CreatePublishedItemCommentRequestBody(publishedItemId: "publishedItemId_example", text: "text_example") // CreatePublishedItemCommentRequestBody | 

DefaultAPI.createPublishedItemComment(createPublishedItemCommentRequestBody: createPublishedItemCommentRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPublishedItemCommentRequestBody** | [**CreatePublishedItemCommentRequestBody**](CreatePublishedItemCommentRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonCreatePublishedItemCommentSuccess**](EitherErrorReasonTypesStringOrCreatePublishedItemCommentFailedReasonCreatePublishedItemCommentSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPublishingChannel**
```swift
    open class func createPublishingChannel(createPublishingChannelRequestBody: CreatePublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createPublishingChannelRequestBody = CreatePublishingChannelRequestBody(backgroundImage: FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example"), profilePicture: nil, publishingChannelName: "publishingChannelName_example", publishingChannelDescription: "publishingChannelDescription_example", externalUrls: ["externalUrls_example"], publishingChannelRules: ["publishingChannelRules_example"], bannedWords: ["bannedWords_example"], moderatorUserIds: ["moderatorUserIds_example"]) // CreatePublishingChannelRequestBody | 

DefaultAPI.createPublishingChannel(createPublishingChannelRequestBody: createPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPublishingChannelRequestBody** | [**CreatePublishingChannelRequestBody**](CreatePublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess**](EitherErrorReasonTypesStringOrCreatePublishingChannelFailedReasonCreatePublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createShopItem**
```swift
    open class func createShopItem(createShopItemRequestBody: CreateShopItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrCreateShopItemFailedReasonCreateShopItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createShopItemRequestBody = CreateShopItemRequestBody(idempotentcyToken: "idempotentcyToken_example", caption: "caption_example", hashtags: ["hashtags_example"], title: "title_example", price: 123, collaboratorUserIds: ["collaboratorUserIds_example"], scheduledPublicationTimestamp: 123, expirationTimestamp: 123, mediaFiles: [FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example")], purchasedMediaFiles: [nil]) // CreateShopItemRequestBody | 

DefaultAPI.createShopItem(createShopItemRequestBody: createShopItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createShopItemRequestBody** | [**CreateShopItemRequestBody**](CreateShopItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrCreateShopItemFailedReasonCreateShopItemSuccess**](EitherErrorReasonTypesStringOrCreateShopItemFailedReasonCreateShopItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteChatMessage**
```swift
    open class func deleteChatMessage(deleteChatMessageRequestBody: DeleteChatMessageRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrDeleteChatMessageFailedReasonDeleteChatMessageSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let deleteChatMessageRequestBody = DeleteChatMessageRequestBody(chatMessageId: "chatMessageId_example") // DeleteChatMessageRequestBody | 

DefaultAPI.deleteChatMessage(deleteChatMessageRequestBody: deleteChatMessageRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteChatMessageRequestBody** | [**DeleteChatMessageRequestBody**](DeleteChatMessageRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrDeleteChatMessageFailedReasonDeleteChatMessageSuccess**](EitherErrorReasonTypesStringOrDeleteChatMessageFailedReasonDeleteChatMessageSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePost**
```swift
    open class func deletePost(deletePostRequestBody: DeletePostRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let deletePostRequestBody = DeletePostRequestBody(publishedItemId: "publishedItemId_example") // DeletePostRequestBody | 

DefaultAPI.deletePost(deletePostRequestBody: deletePostRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deletePostRequestBody** | [**DeletePostRequestBody**](DeletePostRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess**](EitherErrorReasonTypesStringOrDeletePostFailedReasonDeletePostSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePublishedItemComment**
```swift
    open class func deletePublishedItemComment(deletePublishedItemCommentRequestBody: DeletePublishedItemCommentRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrDeletePublishedItemCommentFailedReasonDeletePublishedItemCommentSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let deletePublishedItemCommentRequestBody = DeletePublishedItemCommentRequestBody(publishedItemCommentId: "publishedItemCommentId_example") // DeletePublishedItemCommentRequestBody | 

DefaultAPI.deletePublishedItemComment(deletePublishedItemCommentRequestBody: deletePublishedItemCommentRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deletePublishedItemCommentRequestBody** | [**DeletePublishedItemCommentRequestBody**](DeletePublishedItemCommentRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrDeletePublishedItemCommentFailedReasonDeletePublishedItemCommentSuccess**](EitherErrorReasonTypesStringOrDeletePublishedItemCommentFailedReasonDeletePublishedItemCommentSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePublishingChannel**
```swift
    open class func deletePublishingChannel(deletePublishingChannelRequestBody: DeletePublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrDeletePublishingChannelFailedReasonDeletePublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let deletePublishingChannelRequestBody = DeletePublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example") // DeletePublishingChannelRequestBody | 

DefaultAPI.deletePublishingChannel(deletePublishingChannelRequestBody: deletePublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deletePublishingChannelRequestBody** | [**DeletePublishingChannelRequestBody**](DeletePublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrDeletePublishingChannelFailedReasonDeletePublishingChannelSuccess**](EitherErrorReasonTypesStringOrDeletePublishingChannelFailedReasonDeletePublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteShopItem**
```swift
    open class func deleteShopItem(deleteShopItemRequestBody: DeleteShopItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrDeleteShopItemFailedReasonDeleteShopItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let deleteShopItemRequestBody = DeleteShopItemRequestBody(publishedItemId: "publishedItemId_example") // DeleteShopItemRequestBody | 

DefaultAPI.deleteShopItem(deleteShopItemRequestBody: deleteShopItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteShopItemRequestBody** | [**DeleteShopItemRequestBody**](DeleteShopItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrDeleteShopItemFailedReasonDeleteShopItemSuccess**](EitherErrorReasonTypesStringOrDeleteShopItemFailedReasonDeleteShopItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **doesChatRoomExistWithUserIds**
```swift
    open class func doesChatRoomExistWithUserIds(doesChatRoomExistWithUserIdsRequestBody: DoesChatRoomExistWithUserIdsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let doesChatRoomExistWithUserIdsRequestBody = DoesChatRoomExistWithUserIdsRequestBody(userIds: ["userIds_example"]) // DoesChatRoomExistWithUserIdsRequestBody | 

DefaultAPI.doesChatRoomExistWithUserIds(doesChatRoomExistWithUserIdsRequestBody: doesChatRoomExistWithUserIdsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **doesChatRoomExistWithUserIdsRequestBody** | [**DoesChatRoomExistWithUserIdsRequestBody**](DoesChatRoomExistWithUserIdsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess**](EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **elevateUserToAdmin**
```swift
    open class func elevateUserToAdmin(elevateUserToAdminRequestBody: ElevateUserToAdminRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let elevateUserToAdminRequestBody = ElevateUserToAdminRequestBody(userIdElevatedToAdmin: "userIdElevatedToAdmin_example") // ElevateUserToAdminRequestBody | 

DefaultAPI.elevateUserToAdmin(elevateUserToAdminRequestBody: elevateUserToAdminRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **elevateUserToAdminRequestBody** | [**ElevateUserToAdminRequestBody**](ElevateUserToAdminRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess**](EitherErrorReasonTypesStringOrElevateUserToAdminFailedReasonElevateUserToAdminSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **followPublishingChannel**
```swift
    open class func followPublishingChannel(followPublishingChannelRequestBody: FollowPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrFollowPublishingChannelFailedReasonFollowPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let followPublishingChannelRequestBody = FollowPublishingChannelRequestBody(publishingChannelIdBeingFollowed: "publishingChannelIdBeingFollowed_example") // FollowPublishingChannelRequestBody | 

DefaultAPI.followPublishingChannel(followPublishingChannelRequestBody: followPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **followPublishingChannelRequestBody** | [**FollowPublishingChannelRequestBody**](FollowPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrFollowPublishingChannelFailedReasonFollowPublishingChannelSuccess**](EitherErrorReasonTypesStringOrFollowPublishingChannelFailedReasonFollowPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **followUser**
```swift
    open class func followUser(followUserRequestBody: FollowUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrFollowUserFailedReasonFollowUserSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let followUserRequestBody = FollowUserRequestBody(userIdBeingFollowed: "userIdBeingFollowed_example") // FollowUserRequestBody | 

DefaultAPI.followUser(followUserRequestBody: followUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **followUserRequestBody** | [**FollowUserRequestBody**](FollowUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrFollowUserFailedReasonFollowUserSuccess**](EitherErrorReasonTypesStringOrFollowUserFailedReasonFollowUserSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getChatRoomById**
```swift
    open class func getChatRoomById(getChatRoomByIdRequestBody: GetChatRoomByIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetChatRoomByIdFailedReasonGetChatRoomByIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getChatRoomByIdRequestBody = GetChatRoomByIdRequestBody(chatRoomId: "chatRoomId_example") // GetChatRoomByIdRequestBody | 

DefaultAPI.getChatRoomById(getChatRoomByIdRequestBody: getChatRoomByIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getChatRoomByIdRequestBody** | [**GetChatRoomByIdRequestBody**](GetChatRoomByIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetChatRoomByIdFailedReasonGetChatRoomByIdSuccess**](EitherErrorReasonTypesStringOrGetChatRoomByIdFailedReasonGetChatRoomByIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getClientUserProfile**
```swift
    open class func getClientUserProfile(completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetClientUserProfileFailedReasonGetClientUserProfileSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


DefaultAPI.getClientUserProfile() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**EitherErrorReasonTypesStringOrGetClientUserProfileFailedReasonGetClientUserProfileSuccess**](EitherErrorReasonTypesStringOrGetClientUserProfileFailedReasonGetClientUserProfileSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCountOfUnreadChatRooms**
```swift
    open class func getCountOfUnreadChatRooms(body: AnyCodable, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetCountOfUnreadChatRoomsFailedReasonGetCountOfUnreadChatRoomsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let body = "TODO" // AnyCodable | 

DefaultAPI.getCountOfUnreadChatRooms(body: body) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **AnyCodable** |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetCountOfUnreadChatRoomsFailedReasonGetCountOfUnreadChatRoomsSuccess**](EitherErrorReasonTypesStringOrGetCountOfUnreadChatRoomsFailedReasonGetCountOfUnreadChatRoomsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCountOfUnreadNotifications**
```swift
    open class func getCountOfUnreadNotifications(completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


DefaultAPI.getCountOfUnreadNotifications() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess**](EitherErrorReasonTypesStringOrGetCountOfUnreadNotificationsFailedReasonGetCountOfUnreadNotificationsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCreditCardsStoredByUserId**
```swift
    open class func getCreditCardsStoredByUserId(completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetCreditCardsStoredByUserIdFailedReasonGetCreditCardsStoredByUserIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


DefaultAPI.getCreditCardsStoredByUserId() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**EitherErrorReasonTypesStringOrGetCreditCardsStoredByUserIdFailedReasonGetCreditCardsStoredByUserIdSuccess**](EitherErrorReasonTypesStringOrGetCreditCardsStoredByUserIdFailedReasonGetCreditCardsStoredByUserIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFollowerRequests**
```swift
    open class func getFollowerRequests(getFollowerRequestsRequestBody: GetFollowerRequestsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetFollowerRequestsFailedReasonGetFollowerRequestsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getFollowerRequestsRequestBody = GetFollowerRequestsRequestBody(cursor: "cursor_example", pageSize: 123) // GetFollowerRequestsRequestBody | 

DefaultAPI.getFollowerRequests(getFollowerRequestsRequestBody: getFollowerRequestsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getFollowerRequestsRequestBody** | [**GetFollowerRequestsRequestBody**](GetFollowerRequestsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetFollowerRequestsFailedReasonGetFollowerRequestsSuccess**](EitherErrorReasonTypesStringOrGetFollowerRequestsFailedReasonGetFollowerRequestsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPageOfALLPUBLISHEDITEMS**
```swift
    open class func getPageOfALLPUBLISHEDITEMS(getPageOfAllPublishedItemsRequestBody: GetPageOfAllPublishedItemsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonGetPageOfAllPublishedItemsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPageOfAllPublishedItemsRequestBody = GetPageOfAllPublishedItemsRequestBody(cursor: "cursor_example", pageSize: 123) // GetPageOfAllPublishedItemsRequestBody | 

DefaultAPI.getPageOfALLPUBLISHEDITEMS(getPageOfAllPublishedItemsRequestBody: getPageOfAllPublishedItemsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPageOfAllPublishedItemsRequestBody** | [**GetPageOfAllPublishedItemsRequestBody**](GetPageOfAllPublishedItemsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonGetPageOfAllPublishedItemsSuccess**](EitherErrorReasonTypesStringOrGetPageOfAllPublishedItemsFailedReasonGetPageOfAllPublishedItemsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPageOfChatMessages**
```swift
    open class func getPageOfChatMessages(getPageOfChatMessagesRequestBody: GetPageOfChatMessagesRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPageOfChatMessagesRequestBody = GetPageOfChatMessagesRequestBody(chatRoomId: "chatRoomId_example", cursor: "cursor_example", pageSize: 123) // GetPageOfChatMessagesRequestBody | 

DefaultAPI.getPageOfChatMessages(getPageOfChatMessagesRequestBody: getPageOfChatMessagesRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPageOfChatMessagesRequestBody** | [**GetPageOfChatMessagesRequestBody**](GetPageOfChatMessagesRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess**](EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPageOfChatRooms**
```swift
    open class func getPageOfChatRooms(getPageOfChatRoomsRequestBody: GetPageOfChatRoomsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPageOfChatRoomsRequestBody = GetPageOfChatRoomsRequestBody(cursor: "cursor_example", pageSize: 123, query: "query_example") // GetPageOfChatRoomsRequestBody | 

DefaultAPI.getPageOfChatRooms(getPageOfChatRoomsRequestBody: getPageOfChatRoomsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPageOfChatRoomsRequestBody** | [**GetPageOfChatRoomsRequestBody**](GetPageOfChatRoomsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess**](EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPageOfNotifications**
```swift
    open class func getPageOfNotifications(getPageOfNotificationsRequestBody: GetPageOfNotificationsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPageOfNotificationsRequestBody = GetPageOfNotificationsRequestBody(cursor: "cursor_example", pageSize: 123, isUserReadingNotifications: false) // GetPageOfNotificationsRequestBody | 

DefaultAPI.getPageOfNotifications(getPageOfNotificationsRequestBody: getPageOfNotificationsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPageOfNotificationsRequestBody** | [**GetPageOfNotificationsRequestBody**](GetPageOfNotificationsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess**](EitherErrorReasonTypesStringOrGetPageOfNotificationsFailedReasonGetPageOfNotificationsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPageOfUsersFollowedByUserId**
```swift
    open class func getPageOfUsersFollowedByUserId(getPageOfUsersFollowedByUserIdRequestBody: GetPageOfUsersFollowedByUserIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonGetPageOfUsersFollowedByUserIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPageOfUsersFollowedByUserIdRequestBody = GetPageOfUsersFollowedByUserIdRequestBody(userIdDoingFollowing: "userIdDoingFollowing_example", cursor: "cursor_example", pageSize: 123) // GetPageOfUsersFollowedByUserIdRequestBody | 

DefaultAPI.getPageOfUsersFollowedByUserId(getPageOfUsersFollowedByUserIdRequestBody: getPageOfUsersFollowedByUserIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPageOfUsersFollowedByUserIdRequestBody** | [**GetPageOfUsersFollowedByUserIdRequestBody**](GetPageOfUsersFollowedByUserIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonGetPageOfUsersFollowedByUserIdSuccess**](EitherErrorReasonTypesStringOrGetPageOfUsersFollowedByUserIdFailedReasonGetPageOfUsersFollowedByUserIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPageOfUsersFollowingUserId**
```swift
    open class func getPageOfUsersFollowingUserId(getPageOfUsersFollowingUserIdRequestBody: GetPageOfUsersFollowingUserIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonGetPageOfUsersFollowingUserIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPageOfUsersFollowingUserIdRequestBody = GetPageOfUsersFollowingUserIdRequestBody(userIdBeingFollowed: "userIdBeingFollowed_example", cursor: "cursor_example", pageSize: 123) // GetPageOfUsersFollowingUserIdRequestBody | 

DefaultAPI.getPageOfUsersFollowingUserId(getPageOfUsersFollowingUserIdRequestBody: getPageOfUsersFollowingUserIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPageOfUsersFollowingUserIdRequestBody** | [**GetPageOfUsersFollowingUserIdRequestBody**](GetPageOfUsersFollowingUserIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonGetPageOfUsersFollowingUserIdSuccess**](EitherErrorReasonTypesStringOrGetPageOfUsersFollowingUserIdFailedReasonGetPageOfUsersFollowingUserIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPasswordResetEmail**
```swift
    open class func getPasswordResetEmail(getPasswordResetEmailRequestBody: GetPasswordResetEmailRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedReasonGetPasswordResetEmailSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPasswordResetEmailRequestBody = GetPasswordResetEmailRequestBody(email: "email_example") // GetPasswordResetEmailRequestBody | 

DefaultAPI.getPasswordResetEmail(getPasswordResetEmailRequestBody: getPasswordResetEmailRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPasswordResetEmailRequestBody** | [**GetPasswordResetEmailRequestBody**](GetPasswordResetEmailRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedReasonGetPasswordResetEmailSuccess**](EitherErrorReasonTypesStringOrGetPasswordResetEmailFailedReasonGetPasswordResetEmailSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPostsScheduledByUser**
```swift
    open class func getPostsScheduledByUser(getPublishedItemsScheduledByUserRequestBody: GetPublishedItemsScheduledByUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsScheduledByUserFailedReasonGetPublishedItemsScheduledByUserSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsScheduledByUserRequestBody = GetPublishedItemsScheduledByUserRequestBody(rangeStartTimestamp: 123, rangeEndTimestamp: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsScheduledByUserRequestBody | 

DefaultAPI.getPostsScheduledByUser(getPublishedItemsScheduledByUserRequestBody: getPublishedItemsScheduledByUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsScheduledByUserRequestBody** | [**GetPublishedItemsScheduledByUserRequestBody**](GetPublishedItemsScheduledByUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsScheduledByUserFailedReasonGetPublishedItemsScheduledByUserSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsScheduledByUserFailedReasonGetPublishedItemsScheduledByUserSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemById**
```swift
    open class func getPublishedItemById(getPublishedItemByIdRequestBody: GetPublishedItemByIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemByIdRequestBody = GetPublishedItemByIdRequestBody(publishedItemId: "publishedItemId_example") // GetPublishedItemByIdRequestBody | 

DefaultAPI.getPublishedItemById(getPublishedItemByIdRequestBody: getPublishedItemByIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemByIdRequestBody** | [**GetPublishedItemByIdRequestBody**](GetPublishedItemByIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemByIdFailedReasonGetPublishedItemByIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemsByUserId**
```swift
    open class func getPublishedItemsByUserId(getPublishedItemsByUserIdRequestBody: GetPublishedItemsByUserIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsByUsernameFailedReasonGetPublishedItemsByUsernameSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsByUserIdRequestBody = GetPublishedItemsByUserIdRequestBody(userId: "userId_example", cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsByUserIdRequestBody | 

DefaultAPI.getPublishedItemsByUserId(getPublishedItemsByUserIdRequestBody: getPublishedItemsByUserIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsByUserIdRequestBody** | [**GetPublishedItemsByUserIdRequestBody**](GetPublishedItemsByUserIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsByUsernameFailedReasonGetPublishedItemsByUsernameSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsByUsernameFailedReasonGetPublishedItemsByUsernameSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemsByUsername**
```swift
    open class func getPublishedItemsByUsername(getPublishedItemsByUsernameRequestBody: GetPublishedItemsByUsernameRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsByUsernameFailedReasonGetPublishedItemsByUsernameSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsByUsernameRequestBody = GetPublishedItemsByUsernameRequestBody(username: "username_example", cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsByUsernameRequestBody | 

DefaultAPI.getPublishedItemsByUsername(getPublishedItemsByUsernameRequestBody: getPublishedItemsByUsernameRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsByUsernameRequestBody** | [**GetPublishedItemsByUsernameRequestBody**](GetPublishedItemsByUsernameRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsByUsernameFailedReasonGetPublishedItemsByUsernameSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsByUsernameFailedReasonGetPublishedItemsByUsernameSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemsFromAllFollowings**
```swift
    open class func getPublishedItemsFromAllFollowings(getPublishedItemsFromAllFollowingsRequestBody: GetPublishedItemsFromAllFollowingsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonGetPublishedItemsFromAllFollowingsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsFromAllFollowingsRequestBody = GetPublishedItemsFromAllFollowingsRequestBody(cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsFromAllFollowingsRequestBody | 

DefaultAPI.getPublishedItemsFromAllFollowings(getPublishedItemsFromAllFollowingsRequestBody: getPublishedItemsFromAllFollowingsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsFromAllFollowingsRequestBody** | [**GetPublishedItemsFromAllFollowingsRequestBody**](GetPublishedItemsFromAllFollowingsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonGetPublishedItemsFromAllFollowingsSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsFromAllFollowingsFailedReasonGetPublishedItemsFromAllFollowingsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemsFromFollowedHashtag**
```swift
    open class func getPublishedItemsFromFollowedHashtag(getPublishedItemsFromFollowedHashtagRequestBody: GetPublishedItemsFromFollowedHashtagRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonGetPublishedItemsFromFollowedHashtagSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsFromFollowedHashtagRequestBody = GetPublishedItemsFromFollowedHashtagRequestBody(hashtag: "hashtag_example", cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsFromFollowedHashtagRequestBody | 

DefaultAPI.getPublishedItemsFromFollowedHashtag(getPublishedItemsFromFollowedHashtagRequestBody: getPublishedItemsFromFollowedHashtagRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsFromFollowedHashtagRequestBody** | [**GetPublishedItemsFromFollowedHashtagRequestBody**](GetPublishedItemsFromFollowedHashtagRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonGetPublishedItemsFromFollowedHashtagSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsFromFollowedHashtagFailedReasonGetPublishedItemsFromFollowedHashtagSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemsFromFollowedUsers**
```swift
    open class func getPublishedItemsFromFollowedUsers(getPublishedItemsFromFollowedUsersRequestBody: GetPublishedItemsFromFollowedUsersRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonGetPublishedItemsFromFollowedUsersSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsFromFollowedUsersRequestBody = GetPublishedItemsFromFollowedUsersRequestBody(cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsFromFollowedUsersRequestBody | 

DefaultAPI.getPublishedItemsFromFollowedUsers(getPublishedItemsFromFollowedUsersRequestBody: getPublishedItemsFromFollowedUsersRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsFromFollowedUsersRequestBody** | [**GetPublishedItemsFromFollowedUsersRequestBody**](GetPublishedItemsFromFollowedUsersRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonGetPublishedItemsFromFollowedUsersSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsFromFollowedUsersFailedReasonGetPublishedItemsFromFollowedUsersSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishedItemsInPublishingChannel**
```swift
    open class func getPublishedItemsInPublishingChannel(getPublishedItemsInPublishingChannelRequestBody: GetPublishedItemsInPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishedItemsInPublishingChannelFailedReasonGetPublishedItemsInPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishedItemsInPublishingChannelRequestBody = GetPublishedItemsInPublishingChannelRequestBody(publishingChannelName: "publishingChannelName_example", cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetPublishedItemsInPublishingChannelRequestBody | 

DefaultAPI.getPublishedItemsInPublishingChannel(getPublishedItemsInPublishingChannelRequestBody: getPublishedItemsInPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishedItemsInPublishingChannelRequestBody** | [**GetPublishedItemsInPublishingChannelRequestBody**](GetPublishedItemsInPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishedItemsInPublishingChannelFailedReasonGetPublishedItemsInPublishingChannelSuccess**](EitherErrorReasonTypesStringOrGetPublishedItemsInPublishingChannelFailedReasonGetPublishedItemsInPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishingChannelByName**
```swift
    open class func getPublishingChannelByName(getPublishingChannelByNameRequestBody: GetPublishingChannelByNameRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishingChannelByNameRequestBody = GetPublishingChannelByNameRequestBody(publishingChannelName: "publishingChannelName_example") // GetPublishingChannelByNameRequestBody | 

DefaultAPI.getPublishingChannelByName(getPublishingChannelByNameRequestBody: getPublishingChannelByNameRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishingChannelByNameRequestBody** | [**GetPublishingChannelByNameRequestBody**](GetPublishingChannelByNameRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess**](EitherErrorReasonTypesStringOrGetPublishingChannelByNameFailedReasonGetPublishingChannelByNameSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishingChannelNameValidity**
```swift
    open class func getPublishingChannelNameValidity(isPublishingChannelNameValidRequestBody: IsPublishingChannelNameValidRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonIsPublishingChannelNameValidSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let isPublishingChannelNameValidRequestBody = IsPublishingChannelNameValidRequestBody(publishingChannelName: "publishingChannelName_example") // IsPublishingChannelNameValidRequestBody | 

DefaultAPI.getPublishingChannelNameValidity(isPublishingChannelNameValidRequestBody: isPublishingChannelNameValidRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **isPublishingChannelNameValidRequestBody** | [**IsPublishingChannelNameValidRequestBody**](IsPublishingChannelNameValidRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonIsPublishingChannelNameValidSuccess**](EitherErrorReasonTypesStringOrIsPublishingChannelNameValidFailedReasonIsPublishingChannelNameValidSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishingChannelSubmissions**
```swift
    open class func getPublishingChannelSubmissions(getPublishingChannelSubmissionsRequestBody: GetPublishingChannelSubmissionsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishingChannelSubmissionsFailedReasonGetPublishingChannelSubmissionsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishingChannelSubmissionsRequestBody = GetPublishingChannelSubmissionsRequestBody(cursor: "cursor_example", pageSize: 123, publishingChannelId: "publishingChannelId_example") // GetPublishingChannelSubmissionsRequestBody | 

DefaultAPI.getPublishingChannelSubmissions(getPublishingChannelSubmissionsRequestBody: getPublishingChannelSubmissionsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishingChannelSubmissionsRequestBody** | [**GetPublishingChannelSubmissionsRequestBody**](GetPublishingChannelSubmissionsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishingChannelSubmissionsFailedReasonGetPublishingChannelSubmissionsSuccess**](EitherErrorReasonTypesStringOrGetPublishingChannelSubmissionsFailedReasonGetPublishingChannelSubmissionsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPublishingChannelsFollowedByUserId**
```swift
    open class func getPublishingChannelsFollowedByUserId(getPublishingChannelsFollowedByUserIdRequestBody: GetPublishingChannelsFollowedByUserIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getPublishingChannelsFollowedByUserIdRequestBody = GetPublishingChannelsFollowedByUserIdRequestBody(cursor: "cursor_example", pageSize: 123, areFollowsPending: false) // GetPublishingChannelsFollowedByUserIdRequestBody | 

DefaultAPI.getPublishingChannelsFollowedByUserId(getPublishingChannelsFollowedByUserIdRequestBody: getPublishingChannelsFollowedByUserIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPublishingChannelsFollowedByUserIdRequestBody** | [**GetPublishingChannelsFollowedByUserIdRequestBody**](GetPublishingChannelsFollowedByUserIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess**](EitherErrorReasonTypesStringOrGetPublishingChannelsFollowedByUserIdFailedReasonGetPublishingChannelsFollowedByUserIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecommendedPublishedItems**
```swift
    open class func getRecommendedPublishedItems(body: AnyCodable, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonGetRecommendedPublishedItemsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let body = "TODO" // AnyCodable | 

DefaultAPI.getRecommendedPublishedItems(body: body) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **AnyCodable** |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonGetRecommendedPublishedItemsSuccess**](EitherErrorReasonTypesStringOrGetRecommendedPublishedItemsFailedReasonGetRecommendedPublishedItemsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecommendedPublishingChannels**
```swift
    open class func getRecommendedPublishingChannels(body: AnyCodable, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReasonGetRecommendedPublishingChannelsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let body = "TODO" // AnyCodable | 

DefaultAPI.getRecommendedPublishingChannels(body: body) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **AnyCodable** |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReasonGetRecommendedPublishingChannelsSuccess**](EitherErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReasonGetRecommendedPublishingChannelsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecommendedUsersToFollow**
```swift
    open class func getRecommendedUsersToFollow(body: AnyCodable, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let body = "TODO" // AnyCodable | 

DefaultAPI.getRecommendedUsersToFollow(body: body) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **AnyCodable** |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess**](EitherErrorReasonTypesStringOrGetRecommendedUsersToFollowFailedReasonGetRecommendedUsersToFollowSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSavedPublishedItems**
```swift
    open class func getSavedPublishedItems(getSavedPublishedItemsRequestBody: GetSavedPublishedItemsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetSavedPublishedItemsFailedReasonGetSavedPublishedItemsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getSavedPublishedItemsRequestBody = GetSavedPublishedItemsRequestBody(cursor: "cursor_example", pageSize: 123, publishedItemType: PublishedItemType()) // GetSavedPublishedItemsRequestBody | 

DefaultAPI.getSavedPublishedItems(getSavedPublishedItemsRequestBody: getSavedPublishedItemsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getSavedPublishedItemsRequestBody** | [**GetSavedPublishedItemsRequestBody**](GetSavedPublishedItemsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetSavedPublishedItemsFailedReasonGetSavedPublishedItemsSuccess**](EitherErrorReasonTypesStringOrGetSavedPublishedItemsFailedReasonGetSavedPublishedItemsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserContentFeedFilters**
```swift
    open class func getUserContentFeedFilters(body: AnyCodable, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let body = "TODO" // AnyCodable | 

DefaultAPI.getUserContentFeedFilters(body: body) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **AnyCodable** |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess**](EitherErrorReasonTypesStringOrGetUserContentFeedFiltersFailedReasonGetUserContentFeedFiltersSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserProfile**
```swift
    open class func getUserProfile(getUserProfileRequestBody: GetUserProfileRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetUserProfileFailedReasonGetUserProfileSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getUserProfileRequestBody = GetUserProfileRequestBody(username: "username_example") // GetUserProfileRequestBody | 

DefaultAPI.getUserProfile(getUserProfileRequestBody: getUserProfileRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getUserProfileRequestBody** | [**GetUserProfileRequestBody**](GetUserProfileRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetUserProfileFailedReasonGetUserProfileSuccess**](EitherErrorReasonTypesStringOrGetUserProfileFailedReasonGetUserProfileSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUsersByIds**
```swift
    open class func getUsersByIds(getUsersByIdsRequestBody: GetUsersByIdsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getUsersByIdsRequestBody = GetUsersByIdsRequestBody(userIds: ["userIds_example"]) // GetUsersByIdsRequestBody | 

DefaultAPI.getUsersByIds(getUsersByIdsRequestBody: getUsersByIdsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getUsersByIdsRequestBody** | [**GetUsersByIdsRequestBody**](GetUsersByIdsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess**](EitherErrorReasonTypesStringOrGetUsersByIdsFailedReasonGetUsersByIdsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUsersByUsernames**
```swift
    open class func getUsersByUsernames(getUsersByUsernamesRequestBody: GetUsersByUsernamesRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let getUsersByUsernamesRequestBody = GetUsersByUsernamesRequestBody(usernames: ["usernames_example"]) // GetUsersByUsernamesRequestBody | 

DefaultAPI.getUsersByUsernames(getUsersByUsernamesRequestBody: getUsersByUsernamesRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getUsersByUsernamesRequestBody** | [**GetUsersByUsernamesRequestBody**](GetUsersByUsernamesRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess**](EitherErrorReasonTypesStringOrGetUsersByUsernamesFailedReasonGetUsersByUsernamesSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getVerifyUserEmail**
```swift
    open class func getVerifyUserEmail(completion: @escaping (_ data: EitherErrorReasonTypesStringOrGetVerifyUserEmailFailedReasonGetVerifyUserEmailSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


DefaultAPI.getVerifyUserEmail() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**EitherErrorReasonTypesStringOrGetVerifyUserEmailFailedReasonGetVerifyUserEmailSuccess**](EitherErrorReasonTypesStringOrGetVerifyUserEmailFailedReasonGetVerifyUserEmailSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteUserToFollowPublishingChannel**
```swift
    open class func inviteUserToFollowPublishingChannel(inviteUserToFollowPublishingChannelRequestBody: InviteUserToFollowPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let inviteUserToFollowPublishingChannelRequestBody = InviteUserToFollowPublishingChannelRequestBody(invitedUserId: "invitedUserId_example", publishingChannelId: "publishingChannelId_example") // InviteUserToFollowPublishingChannelRequestBody | 

DefaultAPI.inviteUserToFollowPublishingChannel(inviteUserToFollowPublishingChannelRequestBody: inviteUserToFollowPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteUserToFollowPublishingChannelRequestBody** | [**InviteUserToFollowPublishingChannelRequestBody**](InviteUserToFollowPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess**](EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginUser**
```swift
    open class func loginUser(loginUserRequestBody: LoginUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let loginUserRequestBody = LoginUserRequestBody(email: "email_example", password: "password_example") // LoginUserRequestBody | 

DefaultAPI.loginUser(loginUserRequestBody: loginUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginUserRequestBody** | [**LoginUserRequestBody**](LoginUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess**](EitherErrorReasonTypesStringOrAuthFailedReasonAuthSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
```swift
    open class func logout(completion: @escaping (_ data: Void?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


DefaultAPI.logout() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

Void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **makeCardPrimary**
```swift
    open class func makeCardPrimary(makeCreditCardPrimaryRequestBody: MakeCreditCardPrimaryRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonMakeCreditCardPrimarySuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let makeCreditCardPrimaryRequestBody = MakeCreditCardPrimaryRequestBody(localCreditCardId: "localCreditCardId_example") // MakeCreditCardPrimaryRequestBody | 

DefaultAPI.makeCardPrimary(makeCreditCardPrimaryRequestBody: makeCreditCardPrimaryRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **makeCreditCardPrimaryRequestBody** | [**MakeCreditCardPrimaryRequestBody**](MakeCreditCardPrimaryRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonMakeCreditCardPrimarySuccess**](EitherErrorReasonTypesStringOrMakeCreditCardPrimaryFailedReasonMakeCreditCardPrimarySuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **markChatRoomAsRead**
```swift
    open class func markChatRoomAsRead(markChatRoomAsReadRequestBody: MarkChatRoomAsReadRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let markChatRoomAsReadRequestBody = MarkChatRoomAsReadRequestBody(chatRoomId: "chatRoomId_example") // MarkChatRoomAsReadRequestBody | 

DefaultAPI.markChatRoomAsRead(markChatRoomAsReadRequestBody: markChatRoomAsReadRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **markChatRoomAsReadRequestBody** | [**MarkChatRoomAsReadRequestBody**](MarkChatRoomAsReadRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess**](EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **purchaseShopItem**
```swift
    open class func purchaseShopItem(purchaseShopItemRequestBody: PurchaseShopItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrPurchaseShopItemFailedReasonPurchaseShopItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let purchaseShopItemRequestBody = PurchaseShopItemRequestBody(publishedItemId: "publishedItemId_example", localCreditCardId: "localCreditCardId_example") // PurchaseShopItemRequestBody | 

DefaultAPI.purchaseShopItem(purchaseShopItemRequestBody: purchaseShopItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **purchaseShopItemRequestBody** | [**PurchaseShopItemRequestBody**](PurchaseShopItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrPurchaseShopItemFailedReasonPurchaseShopItemSuccess**](EitherErrorReasonTypesStringOrPurchaseShopItemFailedReasonPurchaseShopItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readPageOfCommentsByPublishedItemId**
```swift
    open class func readPageOfCommentsByPublishedItemId(readPageOfCommentsByPublishedItemIdRequestBody: ReadPageOfCommentsByPublishedItemIdRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let readPageOfCommentsByPublishedItemIdRequestBody = ReadPageOfCommentsByPublishedItemIdRequestBody(publishedItemId: "publishedItemId_example", cursor: "cursor_example", pageSize: 123) // ReadPageOfCommentsByPublishedItemIdRequestBody | 

DefaultAPI.readPageOfCommentsByPublishedItemId(readPageOfCommentsByPublishedItemIdRequestBody: readPageOfCommentsByPublishedItemIdRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **readPageOfCommentsByPublishedItemIdRequestBody** | [**ReadPageOfCommentsByPublishedItemIdRequestBody**](ReadPageOfCommentsByPublishedItemIdRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccess**](EitherErrorReasonTypesStringOrReadPageOfCommentsByPublishedItemIdFailedReasonReadPageOfCommentsByPublishedItemIdSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshAccessToken**
```swift
    open class func refreshAccessToken(completion: @escaping (_ data: EitherAuthFailedReasonAuthSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


DefaultAPI.refreshAccessToken() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**EitherAuthFailedReasonAuthSuccess**](EitherAuthFailedReasonAuthSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerUser**
```swift
    open class func registerUser(registerUserRequestBody: RegisterUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrRegisterUserFailedReasonAuthSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let registerUserRequestBody = RegisterUserRequestBody(email: "email_example", password: "password_example", username: "username_example") // RegisterUserRequestBody | 

DefaultAPI.registerUser(registerUserRequestBody: registerUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerUserRequestBody** | [**RegisterUserRequestBody**](RegisterUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrRegisterUserFailedReasonAuthSuccess**](EitherErrorReasonTypesStringOrRegisterUserFailedReasonAuthSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeCreditCard**
```swift
    open class func removeCreditCard(removeCreditCardRequestBody: RemoveCreditCardRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let removeCreditCardRequestBody = RemoveCreditCardRequestBody(localCreditCardId: "localCreditCardId_example") // RemoveCreditCardRequestBody | 

DefaultAPI.removeCreditCard(removeCreditCardRequestBody: removeCreditCardRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **removeCreditCardRequestBody** | [**RemoveCreditCardRequestBody**](RemoveCreditCardRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess**](EitherErrorReasonTypesStringOrRemoveCreditCardFailedReasonRemoveCreditCardSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeModeratorFromPublishingChannel**
```swift
    open class func removeModeratorFromPublishingChannel(removeModeratorFromPublishingChannelRequestBody: RemoveModeratorFromPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let removeModeratorFromPublishingChannelRequestBody = RemoveModeratorFromPublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example", moderatorUserId: "moderatorUserId_example") // RemoveModeratorFromPublishingChannelRequestBody | 

DefaultAPI.removeModeratorFromPublishingChannel(removeModeratorFromPublishingChannelRequestBody: removeModeratorFromPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **removeModeratorFromPublishingChannelRequestBody** | [**RemoveModeratorFromPublishingChannelRequestBody**](RemoveModeratorFromPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess**](EitherErrorReasonTypesStringOrRemoveModeratorFromPublishingChannelFailedReasonRemoveModeratorFromPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeUserLikeFromPublishedItem**
```swift
    open class func removeUserLikeFromPublishedItem(removeUserLikeFromPublishedItemRequestBody: RemoveUserLikeFromPublishedItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let removeUserLikeFromPublishedItemRequestBody = RemoveUserLikeFromPublishedItemRequestBody(publishedItemId: "publishedItemId_example") // RemoveUserLikeFromPublishedItemRequestBody | 

DefaultAPI.removeUserLikeFromPublishedItem(removeUserLikeFromPublishedItemRequestBody: removeUserLikeFromPublishedItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **removeUserLikeFromPublishedItemRequestBody** | [**RemoveUserLikeFromPublishedItemRequestBody**](RemoveUserLikeFromPublishedItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess**](EitherErrorReasonTypesStringOrRemoveUserLikeFromPublishedItemFailedReasonRemoveUserLikeFromPublishedItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resetPassword**
```swift
    open class func resetPassword(resetPasswordRequestBody: ResetPasswordRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let resetPasswordRequestBody = ResetPasswordRequestBody(token: "token_example", password: "password_example") // ResetPasswordRequestBody | 

DefaultAPI.resetPassword(resetPasswordRequestBody: resetPasswordRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resetPasswordRequestBody** | [**ResetPasswordRequestBody**](ResetPasswordRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess**](EitherErrorReasonTypesStringOrResetPasswordFailedReasonResetPasswordSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resolveAllFollowRequests**
```swift
    open class func resolveAllFollowRequests(resolveAllFollowRequestsRequestBody: ResolveAllFollowRequestsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrResolveAllFollowRequestsFailedReasonResolveAllFollowRequestsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let resolveAllFollowRequestsRequestBody = ResolveAllFollowRequestsRequestBody(decision: FollowAllRequestsDecision()) // ResolveAllFollowRequestsRequestBody | 

DefaultAPI.resolveAllFollowRequests(resolveAllFollowRequestsRequestBody: resolveAllFollowRequestsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resolveAllFollowRequestsRequestBody** | [**ResolveAllFollowRequestsRequestBody**](ResolveAllFollowRequestsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrResolveAllFollowRequestsFailedReasonResolveAllFollowRequestsSuccess**](EitherErrorReasonTypesStringOrResolveAllFollowRequestsFailedReasonResolveAllFollowRequestsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resolveFollowRequest**
```swift
    open class func resolveFollowRequest(resolveFollowRequestRequestBody: ResolveFollowRequestRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrResolveFollowRequestFailedReasonResolveFollowRequestSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let resolveFollowRequestRequestBody = ResolveFollowRequestRequestBody(decision: FollowRequestDecision(), userIdDoingFollowing: "userIdDoingFollowing_example") // ResolveFollowRequestRequestBody | 

DefaultAPI.resolveFollowRequest(resolveFollowRequestRequestBody: resolveFollowRequestRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resolveFollowRequestRequestBody** | [**ResolveFollowRequestRequestBody**](ResolveFollowRequestRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrResolveFollowRequestFailedReasonResolveFollowRequestSuccess**](EitherErrorReasonTypesStringOrResolveFollowRequestFailedReasonResolveFollowRequestSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resolvePublishingChannelSubmission**
```swift
    open class func resolvePublishingChannelSubmission(resolvePublishingChannelSubmissionRequestBody: ResolvePublishingChannelSubmissionRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrResolvePublishingChannelSubmissionFailedReasonResolvePublishingChannelSubmissionSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let resolvePublishingChannelSubmissionRequestBody = ResolvePublishingChannelSubmissionRequestBody(decision: PublishingChannelSubmissionDecision(), publishingChannelSubmissionId: "publishingChannelSubmissionId_example", reasonString: "reasonString_example") // ResolvePublishingChannelSubmissionRequestBody | 

DefaultAPI.resolvePublishingChannelSubmission(resolvePublishingChannelSubmissionRequestBody: resolvePublishingChannelSubmissionRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resolvePublishingChannelSubmissionRequestBody** | [**ResolvePublishingChannelSubmissionRequestBody**](ResolvePublishingChannelSubmissionRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrResolvePublishingChannelSubmissionFailedReasonResolvePublishingChannelSubmissionSuccess**](EitherErrorReasonTypesStringOrResolvePublishingChannelSubmissionFailedReasonResolvePublishingChannelSubmissionSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **revokeFollower**
```swift
    open class func revokeFollower(revokeFollowerRequestBody: RevokeFollowerRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let revokeFollowerRequestBody = RevokeFollowerRequestBody(revokedUserId: "revokedUserId_example") // RevokeFollowerRequestBody | 

DefaultAPI.revokeFollower(revokeFollowerRequestBody: revokeFollowerRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **revokeFollowerRequestBody** | [**RevokeFollowerRequestBody**](RevokeFollowerRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess**](EitherErrorReasonTypesStringOrRevokeFollowerFailedReasonRevokeFollowerSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchForHashtags**
```swift
    open class func searchForHashtags(searchForHashtagsRequestBody: SearchForHashtagsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSearchForHashtagsFailedReasonSearchForHashtagsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let searchForHashtagsRequestBody = SearchForHashtagsRequestBody(query: "query_example", pageNumber: 123, pageSize: 123) // SearchForHashtagsRequestBody | 

DefaultAPI.searchForHashtags(searchForHashtagsRequestBody: searchForHashtagsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchForHashtagsRequestBody** | [**SearchForHashtagsRequestBody**](SearchForHashtagsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSearchForHashtagsFailedReasonSearchForHashtagsSuccess**](EitherErrorReasonTypesStringOrSearchForHashtagsFailedReasonSearchForHashtagsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchForPosts**
```swift
    open class func searchForPosts(searchForPostsRequestBody: SearchForPostsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let searchForPostsRequestBody = SearchForPostsRequestBody(query: "query_example", pageNumber: 123, pageSize: 123) // SearchForPostsRequestBody | 

DefaultAPI.searchForPosts(searchForPostsRequestBody: searchForPostsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchForPostsRequestBody** | [**SearchForPostsRequestBody**](SearchForPostsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess**](EitherErrorReasonTypesStringOrSearchForPostsFailedReasonSearchForPostsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchForPublishingChannels**
```swift
    open class func searchForPublishingChannels(searchForPublishingChannelsRequestBody: SearchForPublishingChannelsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSearchForPublishingChannelsFailedReasonSearchForPublishingChannelsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let searchForPublishingChannelsRequestBody = SearchForPublishingChannelsRequestBody(query: "query_example", pageNumber: 123, pageSize: 123) // SearchForPublishingChannelsRequestBody | 

DefaultAPI.searchForPublishingChannels(searchForPublishingChannelsRequestBody: searchForPublishingChannelsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchForPublishingChannelsRequestBody** | [**SearchForPublishingChannelsRequestBody**](SearchForPublishingChannelsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSearchForPublishingChannelsFailedReasonSearchForPublishingChannelsSuccess**](EitherErrorReasonTypesStringOrSearchForPublishingChannelsFailedReasonSearchForPublishingChannelsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchForUsers**
```swift
    open class func searchForUsers(searchForUsersRequestBody: SearchForUsersRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSearchForUsersFailedReasonSearchForUsersSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let searchForUsersRequestBody = SearchForUsersRequestBody(query: "query_example", pageNumber: 123, pageSize: 123) // SearchForUsersRequestBody | 

DefaultAPI.searchForUsers(searchForUsersRequestBody: searchForUsersRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchForUsersRequestBody** | [**SearchForUsersRequestBody**](SearchForUsersRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSearchForUsersFailedReasonSearchForUsersSuccess**](EitherErrorReasonTypesStringOrSearchForUsersFailedReasonSearchForUsersSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchUserProfilesByUsername**
```swift
    open class func searchUserProfilesByUsername(searchUserProfilesByUsernameRequestBody: SearchUserProfilesByUsernameRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonSearchUserProfilesByUsernameSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let searchUserProfilesByUsernameRequestBody = SearchUserProfilesByUsernameRequestBody(searchString: "searchString_example") // SearchUserProfilesByUsernameRequestBody | 

DefaultAPI.searchUserProfilesByUsername(searchUserProfilesByUsernameRequestBody: searchUserProfilesByUsernameRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchUserProfilesByUsernameRequestBody** | [**SearchUserProfilesByUsernameRequestBody**](SearchUserProfilesByUsernameRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonSearchUserProfilesByUsernameSuccess**](EitherErrorReasonTypesStringOrSearchUserProfilesByUsernameFailedReasonSearchUserProfilesByUsernameSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendDataTypesToFrontend1**
```swift
    open class func sendDataTypesToFrontend1(sendDataTypesToFrontend1Request: SendDataTypesToFrontend1Request, completion: @escaping (_ data: SendDataTypesToFrontend1200Response?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let sendDataTypesToFrontend1Request = SendDataTypesToFrontend1_request(newChatMessageNotification: NewChatMessageNotification(countOfUnreadChatRooms: 123, chatMessage: RenderableChatMessage(chatMessageId: "chatMessageId_example", text: "text_example", authorUserId: "authorUserId_example", chatRoomId: "chatRoomId_example", creationTimestamp: 123)), unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification(type: NOTIFICATION_EVENTS(), countOfUnreadNotifications: 123, userIdUnlikingPublishedItem: "userIdUnlikingPublishedItem_example", publishedItemId: "publishedItemId_example"), unrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification(type: nil, countOfUnreadNotifications: 123, userIdDoingUnfollowing: "userIdDoingUnfollowing_example"), unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledNewCommentOnPublishedItemNotification(type: nil, countOfUnreadNotifications: 123, publishedItemCommentId: "publishedItemCommentId_example")) // SendDataTypesToFrontend1Request | 

DefaultAPI.sendDataTypesToFrontend1(sendDataTypesToFrontend1Request: sendDataTypesToFrontend1Request) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sendDataTypesToFrontend1Request** | [**SendDataTypesToFrontend1Request**](SendDataTypesToFrontend1Request.md) |  | 

### Return type

[**SendDataTypesToFrontend1200Response**](SendDataTypesToFrontend1200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setUserContentFeedFilters**
```swift
    open class func setUserContentFeedFilters(setUserContentFeedFiltersRequestBody: SetUserContentFeedFiltersRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReasonSetUserContentFeedFiltersSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let setUserContentFeedFiltersRequestBody = SetUserContentFeedFiltersRequestBody(requestedContentFeedFilters: [UserContentFeedFilter(contentFeedFilterId: "contentFeedFilterId_example", userId: "userId_example", type: UserContentFeedFilterType(), value: "value_example", creationTimestamp: 123)]) // SetUserContentFeedFiltersRequestBody | 

DefaultAPI.setUserContentFeedFilters(setUserContentFeedFiltersRequestBody: setUserContentFeedFiltersRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **setUserContentFeedFiltersRequestBody** | [**SetUserContentFeedFiltersRequestBody**](SetUserContentFeedFiltersRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReasonSetUserContentFeedFiltersSuccess**](EitherErrorReasonTypesStringOrSetUserContentFeedFiltersFailedReasonSetUserContentFeedFiltersSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setUserHashtags**
```swift
    open class func setUserHashtags(setUserHashtagsRequestBody: SetUserHashtagsRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let setUserHashtagsRequestBody = SetUserHashtagsRequestBody(hashtags: ["hashtags_example"]) // SetUserHashtagsRequestBody | 

DefaultAPI.setUserHashtags(setUserHashtagsRequestBody: setUserHashtagsRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **setUserHashtagsRequestBody** | [**SetUserHashtagsRequestBody**](SetUserHashtagsRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess**](EitherErrorReasonTypesStringOrSetUserHashtagsFailedReasonSetUserHashtagsSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sharePost**
```swift
    open class func sharePost(sharePostRequestBody: SharePostRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSharePostFailedReasonSharePostSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let sharePostRequestBody = SharePostRequestBody(sharedPublishedItemId: "sharedPublishedItemId_example", caption: "caption_example", hashtags: ["hashtags_example"], scheduledPublicationTimestamp: 123, expirationTimestamp: 123) // SharePostRequestBody | 

DefaultAPI.sharePost(sharePostRequestBody: sharePostRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sharePostRequestBody** | [**SharePostRequestBody**](SharePostRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSharePostFailedReasonSharePostSuccess**](EitherErrorReasonTypesStringOrSharePostFailedReasonSharePostSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storeCreditCard**
```swift
    open class func storeCreditCard(storeCreditCardRequestBody: StoreCreditCardRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrStoreCreditCardFailedReasonStoreCreditCardSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let storeCreditCardRequestBody = StoreCreditCardRequestBody(paymentProcessorCardToken: "paymentProcessorCardToken_example") // StoreCreditCardRequestBody | 

DefaultAPI.storeCreditCard(storeCreditCardRequestBody: storeCreditCardRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **storeCreditCardRequestBody** | [**StoreCreditCardRequestBody**](StoreCreditCardRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrStoreCreditCardFailedReasonStoreCreditCardSuccess**](EitherErrorReasonTypesStringOrStoreCreditCardFailedReasonStoreCreditCardSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **submitPublishedItemToPublishingChannel**
```swift
    open class func submitPublishedItemToPublishingChannel(submitPublishedItemToPublishingChannelRequestBody: SubmitPublishedItemToPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let submitPublishedItemToPublishingChannelRequestBody = SubmitPublishedItemToPublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example", publishedItemId: "publishedItemId_example") // SubmitPublishedItemToPublishingChannelRequestBody | 

DefaultAPI.submitPublishedItemToPublishingChannel(submitPublishedItemToPublishingChannelRequestBody: submitPublishedItemToPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **submitPublishedItemToPublishingChannelRequestBody** | [**SubmitPublishedItemToPublishingChannelRequestBody**](SubmitPublishedItemToPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess**](EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unblockUser**
```swift
    open class func unblockUser(unblockUserRequestBody: UnblockUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUnblockUserFailedReasonUnblockUserSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let unblockUserRequestBody = UnblockUserRequestBody(blockedUserId: "blockedUserId_example") // UnblockUserRequestBody | 

DefaultAPI.unblockUser(unblockUserRequestBody: unblockUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unblockUserRequestBody** | [**UnblockUserRequestBody**](UnblockUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUnblockUserFailedReasonUnblockUserSuccess**](EitherErrorReasonTypesStringOrUnblockUserFailedReasonUnblockUserSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **undoBanUserFromPublishingChannel**
```swift
    open class func undoBanUserFromPublishingChannel(undoBanUserFromPublishingChannelRequestBody: UndoBanUserFromPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let undoBanUserFromPublishingChannelRequestBody = UndoBanUserFromPublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example", bannedUserId: "bannedUserId_example") // UndoBanUserFromPublishingChannelRequestBody | 

DefaultAPI.undoBanUserFromPublishingChannel(undoBanUserFromPublishingChannelRequestBody: undoBanUserFromPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **undoBanUserFromPublishingChannelRequestBody** | [**UndoBanUserFromPublishingChannelRequestBody**](UndoBanUserFromPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess**](EitherErrorReasonTypesStringOrUndoBanUserFromPublishingChannelFailedReasonUndoBanUserFromPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unfollowPublishingChannel**
```swift
    open class func unfollowPublishingChannel(unfollowPublishingChannelRequestBody: UnfollowPublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUnfollowPublishingChannelFailedReasonUnfollowPublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let unfollowPublishingChannelRequestBody = UnfollowPublishingChannelRequestBody(publishingChannelIdBeingUnfollowed: "publishingChannelIdBeingUnfollowed_example") // UnfollowPublishingChannelRequestBody | 

DefaultAPI.unfollowPublishingChannel(unfollowPublishingChannelRequestBody: unfollowPublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unfollowPublishingChannelRequestBody** | [**UnfollowPublishingChannelRequestBody**](UnfollowPublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUnfollowPublishingChannelFailedReasonUnfollowPublishingChannelSuccess**](EitherErrorReasonTypesStringOrUnfollowPublishingChannelFailedReasonUnfollowPublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unfollowUser**
```swift
    open class func unfollowUser(unfollowUserRequestBody: UnfollowUserRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUnfollowUserFailedReasonUnfollowUserSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let unfollowUserRequestBody = UnfollowUserRequestBody(userIdBeingUnfollowed: "userIdBeingUnfollowed_example") // UnfollowUserRequestBody | 

DefaultAPI.unfollowUser(unfollowUserRequestBody: unfollowUserRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unfollowUserRequestBody** | [**UnfollowUserRequestBody**](UnfollowUserRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUnfollowUserFailedReasonUnfollowUserSuccess**](EitherErrorReasonTypesStringOrUnfollowUserFailedReasonUnfollowUserSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePassword**
```swift
    open class func updatePassword(updatePasswordRequestBody: UpdatePasswordRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updatePasswordRequestBody = UpdatePasswordRequestBody(updatedPassword: "updatedPassword_example") // UpdatePasswordRequestBody | 

DefaultAPI.updatePassword(updatePasswordRequestBody: updatePasswordRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updatePasswordRequestBody** | [**UpdatePasswordRequestBody**](UpdatePasswordRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess**](EitherErrorReasonTypesStringOrUpdatePasswordFailedReasonUpdatePasswordSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePost**
```swift
    open class func updatePost(updatePostRequestBody: UpdatePostRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdatePostFailedReasonUpdatePostSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updatePostRequestBody = UpdatePostRequestBody(publishedItemId: "publishedItemId_example", caption: "caption_example", scheduledPublicationTimestamp: 123, expirationTimestamp: 123) // UpdatePostRequestBody | 

DefaultAPI.updatePost(updatePostRequestBody: updatePostRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updatePostRequestBody** | [**UpdatePostRequestBody**](UpdatePostRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdatePostFailedReasonUpdatePostSuccess**](EitherErrorReasonTypesStringOrUpdatePostFailedReasonUpdatePostSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePublishingChannel**
```swift
    open class func updatePublishingChannel(updatePublishingChannelRequestBody: UpdatePublishingChannelRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdatePublishingChannelFailedReasonUpdatePublishingChannelSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updatePublishingChannelRequestBody = UpdatePublishingChannelRequestBody(publishingChannelId: "publishingChannelId_example", publishingChannelName: "publishingChannelName_example", publishingChannelDescription: "publishingChannelDescription_example", updatedExternalUrls: ["updatedExternalUrls_example"], updatedPublishingChannelRules: ["updatedPublishingChannelRules_example"], moderatorUserIds: ["moderatorUserIds_example"]) // UpdatePublishingChannelRequestBody | 

DefaultAPI.updatePublishingChannel(updatePublishingChannelRequestBody: updatePublishingChannelRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updatePublishingChannelRequestBody** | [**UpdatePublishingChannelRequestBody**](UpdatePublishingChannelRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdatePublishingChannelFailedReasonUpdatePublishingChannelSuccess**](EitherErrorReasonTypesStringOrUpdatePublishingChannelFailedReasonUpdatePublishingChannelSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePublishingChannelBackgroundImage**
```swift
    open class func updatePublishingChannelBackgroundImage(updatePublishingChannelBackgroundImageRequestBody: UpdatePublishingChannelBackgroundImageRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updatePublishingChannelBackgroundImageRequestBody = UpdatePublishingChannelBackgroundImageRequestBody(backgroundImage: FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example"), publishingChannelId: "publishingChannelId_example") // UpdatePublishingChannelBackgroundImageRequestBody | 

DefaultAPI.updatePublishingChannelBackgroundImage(updatePublishingChannelBackgroundImageRequestBody: updatePublishingChannelBackgroundImageRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updatePublishingChannelBackgroundImageRequestBody** | [**UpdatePublishingChannelBackgroundImageRequestBody**](UpdatePublishingChannelBackgroundImageRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess**](EitherErrorReasonTypesStringOrUpdatePublishingChannelBackgroundImageFailedReasonUpdatePublishingChannelBackgroundImageSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePublishingChannelProfilePicture**
```swift
    open class func updatePublishingChannelProfilePicture(updatePublishingChannelProfilePictureRequestBody: UpdatePublishingChannelProfilePictureRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdatePublishingChannelProfilePictureFailedReasonUpdatePublishingChannelProfilePictureSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updatePublishingChannelProfilePictureRequestBody = UpdatePublishingChannelProfilePictureRequestBody(profilePicture: FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example"), publishingChannelId: "publishingChannelId_example") // UpdatePublishingChannelProfilePictureRequestBody | 

DefaultAPI.updatePublishingChannelProfilePicture(updatePublishingChannelProfilePictureRequestBody: updatePublishingChannelProfilePictureRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updatePublishingChannelProfilePictureRequestBody** | [**UpdatePublishingChannelProfilePictureRequestBody**](UpdatePublishingChannelProfilePictureRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdatePublishingChannelProfilePictureFailedReasonUpdatePublishingChannelProfilePictureSuccess**](EitherErrorReasonTypesStringOrUpdatePublishingChannelProfilePictureFailedReasonUpdatePublishingChannelProfilePictureSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateShopItem**
```swift
    open class func updateShopItem(updateShopItemRequestBody: UpdateShopItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdateShopItemFailedReasonUpdateShopItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updateShopItemRequestBody = UpdateShopItemRequestBody(publishedItemId: "publishedItemId_example", description: "description_example", title: "title_example", price: 123, scheduledPublicationTimestamp: 123, expirationTimestamp: 123, collaboratorUserIds: ["collaboratorUserIds_example"], hashtags: ["hashtags_example"]) // UpdateShopItemRequestBody | 

DefaultAPI.updateShopItem(updateShopItemRequestBody: updateShopItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateShopItemRequestBody** | [**UpdateShopItemRequestBody**](UpdateShopItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdateShopItemFailedReasonUpdateShopItemSuccess**](EitherErrorReasonTypesStringOrUpdateShopItemFailedReasonUpdateShopItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserBackgroundImage**
```swift
    open class func updateUserBackgroundImage(updateUserBackgroundImageRequestBody: UpdateUserBackgroundImageRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updateUserBackgroundImageRequestBody = UpdateUserBackgroundImageRequestBody(backgroundImage: FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example")) // UpdateUserBackgroundImageRequestBody | 

DefaultAPI.updateUserBackgroundImage(updateUserBackgroundImageRequestBody: updateUserBackgroundImageRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUserBackgroundImageRequestBody** | [**UpdateUserBackgroundImageRequestBody**](UpdateUserBackgroundImageRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess**](EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserProfile**
```swift
    open class func updateUserProfile(updateUserProfileRequestBody: UpdateUserProfileRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdateUserProfileFailedReasonUpdateUserProfileSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updateUserProfileRequestBody = UpdateUserProfileRequestBody(username: "username_example", shortBio: "shortBio_example", userWebsite: "userWebsite_example", userEmail: "userEmail_example", phoneNumber: "phoneNumber_example", preferredPagePrimaryColor: Color(red: 123, green: 123, blue: 123), profileVisibility: ProfilePrivacySetting()) // UpdateUserProfileRequestBody | 

DefaultAPI.updateUserProfile(updateUserProfileRequestBody: updateUserProfileRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUserProfileRequestBody** | [**UpdateUserProfileRequestBody**](UpdateUserProfileRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdateUserProfileFailedReasonUpdateUserProfileSuccess**](EitherErrorReasonTypesStringOrUpdateUserProfileFailedReasonUpdateUserProfileSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserProfilePicture**
```swift
    open class func updateUserProfilePicture(updateUserProfilePictureRequestBody: UpdateUserProfilePictureRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let updateUserProfilePictureRequestBody = UpdateUserProfilePictureRequestBody(profilePicture: FileDescriptor(blobFileKey: "blobFileKey_example", mimeType: "mimeType_example")) // UpdateUserProfilePictureRequestBody | 

DefaultAPI.updateUserProfilePicture(updateUserProfilePictureRequestBody: updateUserProfilePictureRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUserProfilePictureRequestBody** | [**UpdateUserProfilePictureRequestBody**](UpdateUserProfilePictureRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccess**](EitherErrorReasonTypesStringOrUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadFile**
```swift
    open class func uploadFile(mediaFile: URL, mimeType: String, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUploadFileFailedReasonUploadFileSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let mediaFile = URL(string: "https://example.com")! // URL | 
let mimeType = "mimeType_example" // String | 

DefaultAPI.uploadFile(mediaFile: mediaFile, mimeType: mimeType) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaFile** | **URL** |  | 
 **mimeType** | **String** |  | 

### Return type

[**EitherErrorReasonTypesStringOrUploadFileFailedReasonUploadFileSuccess**](EitherErrorReasonTypesStringOrUploadFileFailedReasonUploadFileSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userLikesPublishedItem**
```swift
    open class func userLikesPublishedItem(userLikesPublishedItemRequestBody: UserLikesPublishedItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonUserLikesPublishedItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let userLikesPublishedItemRequestBody = UserLikesPublishedItemRequestBody(publishedItemId: "publishedItemId_example") // UserLikesPublishedItemRequestBody | 

DefaultAPI.userLikesPublishedItem(userLikesPublishedItemRequestBody: userLikesPublishedItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userLikesPublishedItemRequestBody** | [**UserLikesPublishedItemRequestBody**](UserLikesPublishedItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonUserLikesPublishedItemSuccess**](EitherErrorReasonTypesStringOrUserLikesPublishedItemFailedReasonUserLikesPublishedItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userSavesPublishedItem**
```swift
    open class func userSavesPublishedItem(userSavesPublishedItemRequestBody: UserSavesPublishedItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUserSavesPublishedItemFailedReasonUserSavesPublishedItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let userSavesPublishedItemRequestBody = UserSavesPublishedItemRequestBody(publishedItemId: "publishedItemId_example") // UserSavesPublishedItemRequestBody | 

DefaultAPI.userSavesPublishedItem(userSavesPublishedItemRequestBody: userSavesPublishedItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userSavesPublishedItemRequestBody** | [**UserSavesPublishedItemRequestBody**](UserSavesPublishedItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUserSavesPublishedItemFailedReasonUserSavesPublishedItemSuccess**](EitherErrorReasonTypesStringOrUserSavesPublishedItemFailedReasonUserSavesPublishedItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userUnsavesPublishedItem**
```swift
    open class func userUnsavesPublishedItem(removeUserLikeFromPublishedItemRequestBody: RemoveUserLikeFromPublishedItemRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let removeUserLikeFromPublishedItemRequestBody = RemoveUserLikeFromPublishedItemRequestBody(publishedItemId: "publishedItemId_example") // RemoveUserLikeFromPublishedItemRequestBody | 

DefaultAPI.userUnsavesPublishedItem(removeUserLikeFromPublishedItemRequestBody: removeUserLikeFromPublishedItemRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **removeUserLikeFromPublishedItemRequestBody** | [**RemoveUserLikeFromPublishedItemRequestBody**](RemoveUserLikeFromPublishedItemRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess**](EitherErrorReasonTypesStringOrUserUnsavesPublishedItemFailedReasonUserUnsavesPublishedItemSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyUserEmail**
```swift
    open class func verifyUserEmail(verifyUserEmailRequestBody: VerifyUserEmailRequestBody, completion: @escaping (_ data: EitherErrorReasonTypesStringOrVerifyUserEmailFailedReasonVerifyUserEmailSuccess?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let verifyUserEmailRequestBody = VerifyUserEmailRequestBody(token: "token_example") // VerifyUserEmailRequestBody | 

DefaultAPI.verifyUserEmail(verifyUserEmailRequestBody: verifyUserEmailRequestBody) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifyUserEmailRequestBody** | [**VerifyUserEmailRequestBody**](VerifyUserEmailRequestBody.md) |  | 

### Return type

[**EitherErrorReasonTypesStringOrVerifyUserEmailFailedReasonVerifyUserEmailSuccess**](EitherErrorReasonTypesStringOrVerifyUserEmailFailedReasonVerifyUserEmailSuccess.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

