export enum ProfilePrivacySetting {
  Public = "Public",
  Private = "Private",
}

export interface UserProfileSearchResponseItem {
  userId: string;
  username: string;
  profilePictureTemporaryUrl?: string;
}
