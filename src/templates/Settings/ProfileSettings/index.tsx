import { ChangeEvent, MouseEvent, useState } from "react";
import { Api, Color } from "#/api";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";

const defaultProfilePictureUrl =
  "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-1024.png";
const defaultBackgroundImageUrl = "https://i.redd.it/1lrfl5fk5j951.png";

const colorOption1 = {
  red: 94,
  green: 95,
  blue: 239,
};

const colorOption2 = {
  red: 255,
  green: 77,
  blue: 0,
};

const colorOption3 = {
  red: 128,
  green: 255,
  blue: 0,
};

const colorOption4 = {
  red: 51,
  green: 0,
  blue: 255,
};

const colorOption5 = {
  red: 196,
  green: 196,
  blue: 196,
};

const colorOptions = [
  colorOption1,
  colorOption2,
  colorOption3,
  colorOption4,
  colorOption5,
];

const defaultPreferredPagePrimaryColor = colorOption1;

export const ProfileSettings = () => {
  const [loadedProfilePictureUrl, setLoadedProfilePictureUrl] = useState<string>(
    defaultProfilePictureUrl,
  );
  const [loadedBackgroundImageUrl, setLoadedBackgroundImageUrl] = useState<string>(
    defaultBackgroundImageUrl,
  );
  const [updatedUsername, setUpdatedUsername] = useState<string>("");
  const [updatedShortBio, setUpdatedShortBio] = useState<string>("");
  const [updatedUserWebsite, setUpdatedUserWebsite] = useState<string>("");
  const [updatedUserHashtags, setUpdatedUserHashtags] = useState<string[]>([]);
  const [updatedUserPreferredPagePrimaryColor, setUpdatedUserPreferredPagePrimaryColor] =
    useState<Color>(defaultPreferredPagePrimaryColor);

  const [hasLoaded, updatedHasLoaded] = useState<boolean>(false);

  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });

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
      hashtags,
      preferredPagePrimaryColor,
    } = data.success!;

    if (!hasLoaded) {
      updatedHasLoaded(true);

      setUpdatedUsername(username);
      setUpdatedShortBio(shortBio || "");
      setUpdatedUserWebsite(userWebsite || "");
      setUpdatedUserHashtags(hashtags);
      setUpdatedUserPreferredPagePrimaryColor(
        preferredPagePrimaryColor || defaultPreferredPagePrimaryColor,
      );

      setLoadedProfilePictureUrl(profilePictureTemporaryUrl || defaultProfilePictureUrl);
      setLoadedBackgroundImageUrl(
        backgroundImageTemporaryUrl || defaultBackgroundImageUrl,
      );
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

    function onChangeUsername(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedUsername(newValue);
    }

    function onChangeShortBio(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedShortBio(newValue);
    }

    function onChangUserWebsite(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedUserWebsite(newValue);
    }

    function generateOnChangUserHashtag(hashtagIndex: number) {
      function onChangUserHashtag(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const newValue = event.currentTarget.value;
        const updatedHashtags = [...Array(5).keys()].map((index) => {
          if (index === hashtagIndex) {
            return newValue;
          }
          return updatedUserHashtags[index];
        });

        setUpdatedUserHashtags(updatedHashtags);
      }
  
      return onChangUserHashtag;
    }

    function onSubmitSettings(event: MouseEvent<HTMLButtonElement>) {
      event.preventDefault();

      console.log(
        "updateUserProfile",
        updatedUsername,
        updatedShortBio,
        updatedUserWebsite,
        updatedUserPreferredPagePrimaryColor,
      )

      Api.updateUserProfile({
        username: updatedUsername,
        shortBio: updatedShortBio,
        userWebsite: updatedUserWebsite,
        preferredPagePrimaryColor: updatedUserPreferredPagePrimaryColor,
      });

      Api.setUserHashtags({
        hashtags: updatedUserHashtags.filter((hashtag) => !!hashtag),
      });
    }

    const colorPallete = colorOptions.map((colorOption, index) => {
      function onClick(event: MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        setUpdatedUserPreferredPagePrimaryColor(colorOption);
      }
      const border =
        colorOption.red === updatedUserPreferredPagePrimaryColor.red &&
        colorOption.green === updatedUserPreferredPagePrimaryColor.green &&
        colorOption.blue === updatedUserPreferredPagePrimaryColor.blue
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

        {colorPallete}

        <br />

        <div>
          Username:
          <input type="text" value={updatedUsername} onChange={onChangeUsername} />
        </div>

        <div>
          Profile Bio:
          <input type="text" value={updatedShortBio} onChange={onChangeShortBio} />
        </div>

        <div>
          Website:
          <input type="text" value={updatedUserWebsite} onChange={onChangUserWebsite} />
        </div>

        <div>Discover</div>

        <div>Profile Hashtags</div>

        <div>
          <input value={updatedUserHashtags[0] || ""} onChange={generateOnChangUserHashtag(0)} />
          <input value={updatedUserHashtags[1] || ""} onChange={generateOnChangUserHashtag(1)} />
          <input value={updatedUserHashtags[2] || ""} onChange={generateOnChangUserHashtag(2)} />
          <input value={updatedUserHashtags[3] || ""} onChange={generateOnChangUserHashtag(3)} />
          <input value={updatedUserHashtags[4] || ""} onChange={generateOnChangUserHashtag(4)} />
        </div>

        <br />
        <button onClick={onSubmitSettings}>Save Settings</button>
      </div>
    );
  }

  return <div>Missing</div>;
};
