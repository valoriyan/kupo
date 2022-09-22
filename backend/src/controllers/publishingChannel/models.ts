import { RenderableUser } from "../user/models";

export interface UnrenderablePublishingChannel {
  publishingChannelId: string;
  ownerUserId: string;
  name: string;
  description?: string;
  backgroundImageBlobFileKey?: string;
  profilePictureBlobFileKey?: string;
}

export interface RenderablePublishingChannel extends UnrenderablePublishingChannel {
  owner: RenderableUser;

  backgroundImageTemporaryUrl?: string;
  profilePictureTemporaryUrl?: string;

  followers: {
    count: number;
  };
}
