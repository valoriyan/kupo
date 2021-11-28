import { ChangeEvent, MouseEvent } from "react";
import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { Avatar } from "#/components/Avatar";
import { useUpdateOwnProfilePicture } from "#/api/mutations/profile/updateOwnProfilePicture";
import { useUpdateOwnBackgroundImage } from "#/api/mutations/profile/updateOwnBackgroundImage";
import { useUpdateOwnProfile } from "#/api/mutations/profile/updateOwnProfile";
import { useSetOwnHashtags } from "#/api/mutations/profile/setOwnHashtags";
import { FormStateProvider, useFormState } from "./FormContext";
import { colorOptions } from "./config";
import { RenderableUser } from "#/api";

export interface ProfileSettingsInnerProps {
  renderableUser: RenderableUser;
}

export const ProfileSettingsInner = (props: ProfileSettingsInnerProps) => {
  const {
    renderableUser: { profilePictureTemporaryUrl, backgroundImageTemporaryUrl },
  } = props;

  const {
    username: formUsername,
    setUsername: setFormUsername,

    shortBio: formShortBio,
    setShortBio: setFormShortBio,

    userWebsite: formUserWebsite,
    setUserWebsite: setFormUserWebsite,

    preferredPagePrimaryColor: formPreferredPagePrimaryColor,
    setPreferredPagePrimaryColor: setFormPreferredPagePrimaryColor,

    hashTags: formHashtags,
    setHashTags: setFormHashtags,
  } = useFormState();

  const { mutateAsync: updateOwnProfilePicture } = useUpdateOwnProfilePicture();
  const { mutateAsync: updateOwnBackgroundImage } = useUpdateOwnBackgroundImage();
  const { mutateAsync: updateOwnProfile } = useUpdateOwnProfile();
  const { mutateAsync: setOwnHashtags } = useSetOwnHashtags({
    hashtags: formHashtags,
    username: formUsername,
  });

  const onChangeProfilePicture = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      updateOwnProfilePicture({ file });
    }
  };

  const onChangeBackgroundImage = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      updateOwnBackgroundImage({ file });
    }
  };

  function generateOnChangUserHashtag(hashtagIndex: number) {
    function onChangUserHashtag(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      const updatedHashtags = [...Array(5).keys()].map((index) => {
        if (index === hashtagIndex) {
          return newValue;
        }
        return formHashtags[index];
      });

      setFormHashtags(updatedHashtags);
    }

    return onChangUserHashtag;
  }

  function onSubmitSettings(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    updateOwnProfile({
      username: formUsername,
      shortBio: formShortBio,
      userWebsite: formUserWebsite,
      preferredPagePrimaryColor: formPreferredPagePrimaryColor,
    });

    setOwnHashtags();
  }

  const colorPallete = colorOptions.map((colorOption, index) => {
    function onClick(event: MouseEvent<HTMLDivElement>) {
      event.preventDefault();
      setFormPreferredPagePrimaryColor(colorOption);
    }
    const border =
      colorOption.red === formPreferredPagePrimaryColor.red &&
      colorOption.green === formPreferredPagePrimaryColor.green &&
      colorOption.blue === formPreferredPagePrimaryColor.blue
        ? "1px solid red"
        : "";

    return (
      <div
        key={index}
        onClick={onClick}
        style={{
          width: "15px",
          height: "15px",
          backgroundColor: `rgb(${colorOption.red} ${colorOption.green} ${colorOption.blue})`,
          border,
        }}
      />
    );
  });

  /* eslint-disable @next/next/no-img-element */
  return (
    <div>
      <div>Your Profile</div>

      <div>
        <Avatar src={profilePictureTemporaryUrl} alt="User Avatar" size="$6" />
        Profile Picture
        <form>
          <label>
            <input
              type="file"
              accept="image/png, image/jpeg, video/mp4"
              onChange={onChangeProfilePicture}
            />
          </label>
        </form>
      </div>

      <div>
        <img
          src={backgroundImageTemporaryUrl}
          style={{ height: "60px", width: "120px" }}
        />
        Background Image
        <form>
          <label>
            <input
              type="file"
              accept="image/png, image/jpeg, video/mp4"
              onChange={onChangeBackgroundImage}
            />
          </label>
        </form>
      </div>

      <div>Page Color</div>

      {colorPallete}

      <br />

      <div>
        Username:
        <input
          type="text"
          value={formUsername}
          onChange={(e) => setFormUsername(e.currentTarget.value)}
        />
      </div>

      <div>
        Profile Bio:
        <input
          type="text"
          value={formShortBio}
          onChange={(e) => setFormShortBio(e.currentTarget.value)}
        />
      </div>

      <div>
        Website:
        <input
          type="text"
          value={formUserWebsite}
          onChange={(e) => setFormUserWebsite(e.currentTarget.value)}
        />
      </div>

      <div>Discover</div>

      <div>Profile Hashtags</div>

      <div>
        <input value={formHashtags[0] || ""} onChange={generateOnChangUserHashtag(0)} />
        <input value={formHashtags[1] || ""} onChange={generateOnChangUserHashtag(1)} />
        <input value={formHashtags[2] || ""} onChange={generateOnChangUserHashtag(2)} />
        <input value={formHashtags[3] || ""} onChange={generateOnChangUserHashtag(3)} />
        <input value={formHashtags[4] || ""} onChange={generateOnChangUserHashtag(4)} />
      </div>

      <br />
      <button onClick={onSubmitSettings}>Save Settings</button>
    </div>
  );
};

export const ProfileSettings = () => {
  const { data, error, isLoading } = useGetUserProfile({ isOwnProfile: true });

  if (error && !isLoading) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  return (
    <FormStateProvider renderableUser={data}>
      <ProfileSettingsInner renderableUser={data} />
    </FormStateProvider>
  );
};
