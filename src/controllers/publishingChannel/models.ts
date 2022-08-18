import { RenderableUser } from "../user/models";

export interface UnrenderablePublishingChannel {
  publishingChannelId: string;
  ownerUserId: string;
  name: string;
  description: string;
}

export interface RenderablePublishingChannel extends UnrenderablePublishingChannel {
  owner: RenderableUser;
}
