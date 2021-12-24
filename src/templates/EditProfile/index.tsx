import { SetStateAction, useState } from "react";
import isEqual from "react-fast-compare";
import { RenderableUser } from "#/api";
import { useSetOwnHashtags } from "#/api/mutations/profile/setOwnHashtags";
import { useUpdateOwnBackgroundImage } from "#/api/mutations/profile/updateOwnBackgroundImage";
import { useUpdateOwnProfile } from "#/api/mutations/profile/updateOwnProfile";
import { useUpdateOwnProfilePicture } from "#/api/mutations/profile/updateOwnProfilePicture";
import { Button } from "#/components/Button";
import { Box, Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { DiscoverSettings } from "./DiscoverSettings";
import { PrivacySettings } from "./PrivacySettings";
import { ProfileSettings } from "./ProfileSettings";

export interface EditProfileProps {
  user: RenderableUser;
}

export const EditProfile = ({ user }: EditProfileProps) => {
  const [username, setUsername, isUsernameTouched, setIsUsernameTouched] = useFormField(
    user.username,
  );
  const [bio, setBio, isBioTouched, setIsBioTouched] = useFormField(user.shortBio);
  const [website, setWebsite, isWebsiteTouched, setIsWebsiteTouched] = useFormField(
    user.userWebsite,
  );
  const [hashtags, setHashtags, isHashtagsTouched, setIsHashtagsTouched] = useFormField(
    user.hashtags,
  );
  const [
    privacySetting,
    setPrivacySetting,
    isPrivacySettingTouched,
    setIsPrivacySettingTouched,
  ] = useFormField(user.profilePrivacySetting);
  const [
    profilePictureUrl,
    setProfilePictureUrl,
    isProfilePictureUrlTouched,
    setIsProfilePictureUrlTouched,
  ] = useFormField(user.profilePictureTemporaryUrl);
  const [
    backgroundImageUrl,
    setBackgroundImageUrl,
    isBackgroundImageUrlTouched,
    setIsBackgroundImageUrlTouched,
  ] = useFormField(user.backgroundImageTemporaryUrl);

  const [profilePictureFile, setProfilePictureFile] = useState<File>();
  const [backgroundImageFile, setBackgroundImageFile] = useState<File>();

  const isAnyTouched =
    isUsernameTouched ||
    isBioTouched ||
    isWebsiteTouched ||
    isHashtagsTouched ||
    isPrivacySettingTouched ||
    isProfilePictureUrlTouched ||
    isBackgroundImageUrlTouched;

  const { mutateAsync: updateOwnProfilePicture } = useUpdateOwnProfilePicture();
  const { mutateAsync: updateOwnBackgroundImage } = useUpdateOwnBackgroundImage();
  const { mutateAsync: updateOwnProfile } = useUpdateOwnProfile();
  const { mutateAsync: setOwnHashtags } = useSetOwnHashtags(user.username);

  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  const saveProfileSettings = async () => {
    setIsProfileUpdating(true);
    const promises: Array<Promise<unknown>> = [];

    if (isProfilePictureUrlTouched && profilePictureFile) {
      promises.push(updateOwnProfilePicture(profilePictureFile));
    }
    if (isBackgroundImageUrlTouched && backgroundImageFile) {
      promises.push(updateOwnBackgroundImage(backgroundImageFile));
    }
    if (isHashtagsTouched) {
      promises.push(setOwnHashtags(hashtags));
    }
    if (isUsernameTouched || isBioTouched || isWebsiteTouched) {
      promises.push(
        updateOwnProfile({
          username,
          shortBio: bio,
          userWebsite: website,
        }),
      );
    }

    try {
      await Promise.all(promises);
      setIsProfileUpdating(false);
      setIsUsernameTouched(false);
      setIsBioTouched(false);
      setIsWebsiteTouched(false);
      setIsHashtagsTouched(false);
      setIsPrivacySettingTouched(false);
      setIsProfilePictureUrlTouched(false);
      setIsBackgroundImageUrlTouched(false);
    } catch {
      setIsProfileUpdating(false);
    }
  };

  console.log({
    username,
    bio,
    website,
    hashtags,
    privacySetting,
    profilePictureUrl,
    backgroundImageUrl,
  });

  return (
    <Stack css={{ gap: "$3" }}>
      <ProfileSettings
        profilePictureUrl={profilePictureUrl}
        setProfilePictureUrl={setProfilePictureUrl}
        setProfilePictureFile={setProfilePictureFile}
        backgroundImageUrl={backgroundImageUrl}
        setBackgroundImageUrl={setBackgroundImageUrl}
        setBackgroundImageFile={setBackgroundImageFile}
        username={username}
        setUsername={setUsername}
        bio={bio}
        setBio={setBio}
        website={website}
        setWebsite={setWebsite}
      />
      <Box css={{ height: "1px", bg: "$border" }} />
      <PrivacySettings
        privacySetting={privacySetting}
        setPrivacySetting={setPrivacySetting}
      />
      <Box css={{ height: "1px", bg: "$border" }} />
      <DiscoverSettings hashtags={hashtags} setHashtags={setHashtags} />
      <Button
        css={{ mt: "$3", mb: "$6", mx: "$6" }}
        disabled={!isAnyTouched}
        onClick={saveProfileSettings}
      >
        <TextOrSpinner isLoading={isProfileUpdating}>Save Settings</TextOrSpinner>
      </Button>
    </Stack>
  );
};

const useFormField = <T extends unknown>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);

  const updateValue = (newValue: SetStateAction<T>) => {
    setIsTouched(!isEqual(initialValue, newValue));
    setValue(newValue);
  };

  return [value, updateValue, isTouched, setIsTouched] as const;
};
