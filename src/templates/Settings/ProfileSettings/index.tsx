import { ChangeEvent, MouseEvent, useState} from "react";
import { Api } from "#/api";
import { useGetUserProfile } from "#/api/queries/useGetUserProfile";

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
  const [updatedUsername, setUpdatedUsername] = useState<string>("");
  const [updatedShortBio, setUpdatedShortBio] = useState<string>("");
  const [updatedUserWebsite, setUpdatedUserWebsite] = useState<string>("");
  const [updatedUserHashtags, setUpdatedUserHashtags] = useState<string[]>([]);

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
    } = data.success!;

    if (!hasLoaded) {
      updatedHasLoaded(true);

      setUpdatedUsername(username);
      setUpdatedShortBio(shortBio || "");
      setUpdatedUserWebsite(userWebsite || "");
      setUpdatedUserHashtags(hashtags);

      setLoadedProfilePictureUrl(profilePictureTemporaryUrl || defaultProfilePictureUrl);
      setLoadedBackgroundImageUrl(backgroundImageTemporaryUrl || defaultBackgroundImageUrl);

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

    function onChangUserHashtag1(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedUserHashtags([
        newValue,
        updatedUserHashtags[1],
        updatedUserHashtags[2],
      ]);
    }

    function onChangUserHashtag2(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedUserHashtags([
        updatedUserHashtags[0],
        newValue,
        updatedUserHashtags[2],
      ]);
    }
    function onChangUserHashtag3(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedUserHashtags([
        updatedUserHashtags[0],
        updatedUserHashtags[1],
        newValue,
      ]);
    }


    function onSubmitSettings (event: MouseEvent<HTMLButtonElement>) {
      event.preventDefault();

      Api.updateUserProfile(
        {
          username: updatedUsername,
          shortBio: updatedShortBio,
          userWebsite: updatedUserWebsite,
        },
      )

      console.log(updatedUserHashtags.filter(hashtag => !!hashtag));
      Api.setUserHashtags({
        hashtags: updatedUserHashtags.filter(hashtag => !!hashtag),
      });
    }


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

        <div>
          Username: 
          <input type="text" value={updatedUsername} onChange={onChangeUsername}/>
        </div>

        <div>
          Profile Bio: 
          <input type="text" value={updatedShortBio} onChange={onChangeShortBio}/>
        </div>

        <div>
          Website: 
          <input type="text" value={updatedUserWebsite} onChange={onChangUserWebsite}/>
        </div>

        <div>Discover</div>

        <div>Profile Hashtags</div>

        <div>
          <input value={updatedUserHashtags[0] || ""} onChange={onChangUserHashtag1} />
          <input value={updatedUserHashtags[1] || ""} onChange={onChangUserHashtag2} />
          <input value={updatedUserHashtags[2] || ""} onChange={onChangUserHashtag3} />
        </div>

        <br/>
        <button onClick={onSubmitSettings}>
          Save Settings
        </button>
      </div>
    );

  }

  return (
    <div>
      Missing
    </div>
  );

};
