import { Color } from "../../types/color";

export enum ProfilePrivacySetting {
  Public = "Public",
  Private = "Private",
}

export interface BaseUnrenderableUser {
  userId: string;
  email: string;
  username: string;
  shortBio?: string;
  userWebsite?: string;
  phoneNumber?: string;
  profilePrivacySetting: ProfilePrivacySetting;

  preferredPagePrimaryColor?: Color;

  creationTimestamp: number;

  isWaitListed: boolean;
  isAdmin: boolean;
}
export interface UnrenderableUser extends BaseUnrenderableUser {
  backgroundImageBlobFileKey?: string;
  profilePictureBlobFileKey?: string;
}

export interface UnrenderableUser_WITH_PASSWORD extends UnrenderableUser {
  encryptedPassword?: string;
}

export interface RenderableUser extends BaseUnrenderableUser {
  backgroundImageTemporaryUrl?: string;
  profilePictureTemporaryUrl?: string;
  followers: {
    count: number;
  };
  follows: {
    count: number;
  };
  clientCanViewContent: boolean;
  hashtags: string[];
  isBeingFollowedByClient: boolean;
}
