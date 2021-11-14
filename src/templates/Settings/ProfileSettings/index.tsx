import { ChangeEvent, MouseEvent, useState } from "react";
import { useQuery } from "react-query";
import { Api } from "#/api";

const defaultProfilePictureUrl =
  "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-1024.png";
const defaultBackgroundImageUrl = "https://i.redd.it/1lrfl5fk5j951.png";

export const ProfileSettings = () => {
  const [loadedProfilePictureUrl, setLoadedProfilePictureUrl] = useState<string>(
    defaultProfilePictureUrl,
  );
  const [loadedBackgroundImageUrl, setLoadedBackgroundImageUrl] = useState<string>(
    defaultBackgroundImageUrl,
  );

  const { isLoading, data } = useQuery("userData123", async () => {
    const res = await Api.getUserProfile({ username: "trajanson" });
    return res.data;
  });

  if (!!isLoading) {
    return <div>Loading</div>;
  }

  if (data && data.success) {
    const {
      username,
      shortBio,
      userWebsite,
      profilePictureTemporaryUrl,
      backgroundImageTemporaryUrl,
    } = data.success!;

    if (
      loadedProfilePictureUrl === defaultProfilePictureUrl &&
      !!profilePictureTemporaryUrl
    ) {
      setLoadedProfilePictureUrl(profilePictureTemporaryUrl);
    }
    if (
      loadedBackgroundImageUrl === defaultBackgroundImageUrl &&
      !!backgroundImageTemporaryUrl
    ) {
      setLoadedBackgroundImageUrl(backgroundImageTemporaryUrl);
    }

    function onClickProfilePicture(event: MouseEvent<HTMLImageElement>) {
      event.preventDefault();
    }

    function onClickBackgroundImage(event: MouseEvent<HTMLImageElement>) {
      event.preventDefault();
    }

    const onChangeProfilePicture = (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.currentTarget;
      if (!files?.length) return;

      for (const file of files) {
        // const src = URL.createObjectURL(file);

        Api.updateUserProfilePicture(file).then((response) => {
          if (
            response.data.success &&
            !!response.data.success.profilePictureTemporaryUrl
          ) {
            setLoadedProfilePictureUrl(response.data.success.profilePictureTemporaryUrl);
          }
        });
      }
    };

    const onChangeBackgroundImage = (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.currentTarget;
      if (!files?.length) return;

      for (const file of files) {
        // const src = URL.createObjectURL(file);
        Api.updateUserBackgroundImage(file).then((response) => {
          if (
            response.data.success &&
            !!response.data.success.backgroundImageTemporaryUrl
          ) {
            setLoadedBackgroundImageUrl(
              response.data.success.backgroundImageTemporaryUrl,
            );
          }
        });
      }
    };

    /* eslint-disable @next/next/no-img-element */
    return (
      <div>
        <div>Your Profile</div>

        <div>
          <img
            onClick={onClickProfilePicture}
            src={loadedProfilePictureUrl}
            style={{ height: "30px", width: "30px" }}
          />
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
            onClick={onClickBackgroundImage}
            src={loadedBackgroundImageUrl}
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

        <div>Username: {username}</div>

        <div>Profile Bio: {shortBio}</div>

        <div>Website: {userWebsite}</div>

        <div>Discover</div>

        <div>Profile Hashtags</div>
      </div>
    );

    return <div></div>;
  }
};
