export const DATABASE_NAME = process.env.DATABASE_NAME;

export const TABLE_NAME_PREFIX = "playhouse";

export const DATABASE_TABLE_NAMES = {
  users: `${TABLE_NAME_PREFIX}_users`,
  posts: `${TABLE_NAME_PREFIX}_posts`,
  userFollows: `${TABLE_NAME_PREFIX}_user_follows`,
};
