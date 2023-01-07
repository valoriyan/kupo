import { Color } from "../../types/color";
import { FollowingStatus } from "./userInteraction/models";

export enum ProfilePrivacySetting {
  Public = "Public",
  Private = "Private",
}

export interface UnrenderableUser {
  userId: string;
  email: string;
  username: string;
  shortBio?: string;
  userWebsite?: string;
  phoneNumber?: string;
  profilePrivacySetting: ProfilePrivacySetting;

  preferredPagePrimaryColor?: Color;

  creationTimestamp: number;

  isAdmin: boolean;
  hasVerifiedEmail: boolean;

  backgroundImageBlobFileKey?: string;
  profilePictureBlobFileKey?: string;
}

export interface UnrenderableUser_WITH_PASSWORD extends UnrenderableUser {
  encryptedPassword?: string;
}

export interface UnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID
  extends UnrenderableUser {
  paymentProcessorCustomerId: string;
}

export interface RenderableUser
  extends Omit<
    UnrenderableUser,
    "has_verified_email" | "backgroundImageBlobFileKey" | "profilePictureBlobFileKey"
  > {
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
  followingStatusOfClientToUser: FollowingStatus;
}
