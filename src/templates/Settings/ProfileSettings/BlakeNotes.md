import { ChangeEvent, MouseEvent, useState } from "react";
import { useQuery } from "react-query";
import { Api } from "#/api";

// Ideally we should move this to our Avatar component
const defaultProfilePictureUrl =
  "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-1024.png";
// We should make a BackgroundImage component similar to our Avatar component
const defaultBackgroundImageUrl = "https://i.redd.it/1lrfl5fk5j951.png";

export const ProfileSettings = () => {
  // We shouldn't be loading the profile picture or background image into a state hook.
  // We should just be reading these from react-query. We want to have only one source
  // of truth for this data
  const [loadedProfilePictureUrl, setLoadedProfilePictureUrl] =
    useState<string>(defaultProfilePictureUrl);
  const [loadedBackgroundImageUrl, setLoadedBackgroundImageUrl] =
    useState<string>(defaultBackgroundImageUrl);

  // We should keep all of our useQuery calls in src/api/queries.
  // Queries can become non-trivial as we start to leverage more of the options
  // that useQuery provides. Also it's not uncommon for queries to be reused by other pages
  const { isLoading, data } = useQuery("userData123", async () => {
    const res = await Api.getUserProfile({ username: "trajanson" });
    return res.data;
  });

  // Since isLoading is already a boolean, we don't need to cast it with !!
  if (!!isLoading) {
    return <div>Loading</div>; // We have a LoadingArea component for this type of situation
  }

  // Instead of wrapping all of this in an if statement, we should be using if statements
  // for loading and error states and having the default case be the loaded state
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
      // Never set state in a component's function body. Also set state in useEffect
      // or some callback you define. This type of code can easily lead to issues
      setLoadedProfilePictureUrl(profilePictureTemporaryUrl);
    }
    if (
      loadedBackgroundImageUrl === defaultBackgroundImageUrl &&
      !!backgroundImageTemporaryUrl
    ) {
      // Same thing here, but the bigger take away is that we should be copying data
      // from react-query into local state. We want one source of truth
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

        // This should be wrapped with useMutation and put in a new file in src/api/mutations
        Api.updateUserProfilePicture(file).then((response) => {
          if (
            response.data.success &&
            !!response.data.success.profilePictureTemporaryUrl
          ) {
            setLoadedProfilePictureUrl(
              response.data.success.profilePictureTemporaryUrl
            );
          }
        });
      }
    };

    const onChangeBackgroundImage = (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.currentTarget;
      if (!files?.length) return;

      for (const file of files) {
        // const src = URL.createObjectURL(file);

        // Same here, all API calls should generally be wrapped with useQuery or useMutation
        Api.updateUserBackgroundImage(file).then((response) => {
          if (
            response.data.success &&
            !!response.data.success.backgroundImageTemporaryUrl
          ) {
            setLoadedBackgroundImageUrl(
              response.data.success.backgroundImageTemporaryUrl
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

    return <div></div>; // This line is unreachable
  }
};
