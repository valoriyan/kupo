export enum NOTIFICATION_EVENTS {
  //////////////////////////////////////////////////
  // Chat
  //////////////////////////////////////////////////
  DELETED_CHAT_MESSAGE = "DELETED_CHAT_MESSAGE",
  NEW_CHAT_MESSAGE = "NEW_CHAT_MESSAGE",

  //////////////////////////////////////////////////
  // User Notifications
  //////////////////////////////////////////////////

  // Followers

  ACCEPTED_USER_FOLLOW_REQUEST = "ACCEPTED_USER_FOLLOW_REQUEST",
  CANCELED_ACCEPTED_USER_FOLLOW_REQUEST = "CANCELED_ACCEPTED_USER_FOLLOW_REQUEST",

  NEW_FOLLOWER = "NEW_FOLLOWER",
  CANCELED_NEW_FOLLOWER = "CANCELED_NEW_FOLLOWER",

  NEW_USER_FOLLOW_REQUEST = "NEW_USER_FOLLOW_REQUEST",
  CANCELED_NEW_USER_FOLLOW_REQUEST = "CANCELED_NEW_USER_FOLLOW_REQUEST",

  // Published Items

  NEW_COMMENT_ON_PUBLISHED_ITEM = "NEW_COMMENT_ON_PUBLISHED_ITEM",
  CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM = "CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM",

  NEW_LIKE_ON_PUBLISHED_ITEM = "NEW_LIKE_ON_PUBLISHED_ITEM",
  CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM = "CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM",

  NEW_SHARE_OF_PUBLISHED_ITEM = "NEW_SHARE_OF_PUBLISHED_ITEM",
  CANCELED_NEW_SHARE_OF_PUBLISHED_ITEM = "CANCELED_NEW_SHARE_OF_PUBLISHED_ITEM",

  NEW_TAG_IN_PUBLISHED_ITEM_CAPTION = "NEW_TAG_IN_PUBLISHED_ITEM_CAPTION",
  CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_CAPTION = "CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_CAPTION",

  NEW_TAG_IN_PUBLISHED_ITEM_COMMENT = "NEW_TAG_IN_PUBLISHED_ITEM_COMMENT",
  CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_COMMENT = "CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_COMMENT",

  // Publishing Channels

  ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION = "ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION",
  REJECTED_PUBLISHING_CHANNEL_SUBMISSION = "REJECTED_PUBLISHING_CHANNEL_SUBMISSION",

  INVITED_TO_FOLLOW_PUBLISHING_CHANNEL = "INVITED_TO_FOLLOW_PUBLISHING_CHANNEL",

  // Transactions

  SHOP_ITEM_SOLD = "SHOP_ITEM_SOLD",

  //////////////////////////////////////////////////
  // Other
  //////////////////////////////////////////////////

  NEW_PUBLISHED_ITEM = "NEW_PUBLISHED_ITEM",
}
