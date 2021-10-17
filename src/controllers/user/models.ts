export enum ProfilePrivacySetting {
  Public = "Public",
  Private = "Private",
}

export interface UserProfileSearchResponseItem {
  userId: string;
  username: string;
  profilePictureTemporaryUrl?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  short_bio?: string;
  user_website?: string;
  encrypted_password?: string;

  profile_privacy_setting: ProfilePrivacySetting;

  background_image_blob_file_key?: string;
  profile_picture_blob_file_key?: string;
}
