import { RenderableUser } from "../user/models";
import { FollowingStatus } from "../user/userInteraction/models";

export interface UnrenderablePublishingChannel {
  publishingChannelId: string;
  ownerUserId: string;
  name: string;
  description?: string;
  backgroundImageBlobFileKey?: string;
  profilePictureBlobFileKey?: string;
  publishingChannelRules: string[];
  externalUrls: string[];
}

export interface RenderablePublishingChannel extends UnrenderablePublishingChannel {
  owner: RenderableUser;

  moderators: RenderableUser[];

  backgroundImageTemporaryUrl?: string;
  profilePictureTemporaryUrl?: string;

  followingStatusOfClientToPublishingChannel: FollowingStatus;

  followers: {
    count: number;
  };
}
