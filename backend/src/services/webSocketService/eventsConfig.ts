export enum NOTIFICATION_EVENTS {
  // CHAT
  DELETED_CHAT_MESSAGE = "DELETED_CHAT_MESSAGE",
  NEW_CHAT_MESSAGE = "NEW_CHAT_MESSAGE",

  // USER NOTIFICATION
  NEW_COMMENT_ON_PUBLISHED_ITEM = "NEW_COMMENT_ON_PUBLISHED_ITEM",
  CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM = "CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM",

  NEW_FOLLOWER = "NEW_FOLLOWER",
  CANCELED_NEW_FOLLOWER = "CANCELED_NEW_FOLLOWER",

  NEW_USER_FOLLOW_REQUEST = "NEW_USER_FOLLOW_REQUEST",
  CANCELED_NEW_USER_FOLLOW_REQUEST = "CANCELED_NEW_USER_FOLLOW_REQUEST",

  ACCEPTED_USER_FOLLOW_REQUEST = "ACCEPTED_USER_FOLLOW_REQUEST",
  CANCELED_ACCEPTED_USER_FOLLOW_REQUEST = "CANCELED_ACCEPTED_USER_FOLLOW_REQUEST",

  NEW_LIKE_ON_PUBLISHED_ITEM = "NEW_LIKE_ON_PUBLISHED_ITEM",
  CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM = "CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM",

  NEW_TAG_IN_PUBLISHED_ITEM_COMMENT = "NEW_TAG_IN_PUBLISHED_ITEM_COMMENT",
  CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_COMMENT = "CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_COMMENT",

  NEW_TAG_IN_PUBLISHED_ITEM_CAPTION = "NEW_TAG_IN_PUBLISHED_ITEM_CAPTION",
  CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_CAPTION = "CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_CAPTION",

  // OTHER
  NEW_PUBLISHED_ITEM = "NEW_PUBLISHED_ITEM",
}
