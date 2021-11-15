import { ChangeEvent, MouseEvent, useState } from "react";

import { useGetUserProfile } from "#/api/queries/useGetUserProfile";
import { Api } from "#/api";

export const AccountSettings = () => {
  const [updatedEmail, setUpdatedEmail] = useState<string>("");

  const { data, isLoading } = useGetUserProfile({ isOwnProfile: true });

  const [hasLoaded, updatedHasLoaded] = useState<boolean>(false);

  if (!!isLoading) {
    return <div>Loading</div>;
  }

  if (data && data.success) {
    const { email } = data.success!;

    if (!hasLoaded) {
      updatedHasLoaded(true);
      setUpdatedEmail(email || "");
    }

    function onChangUserEmail(event: ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setUpdatedEmail(newValue);
    }

    function onSubmitSettings(event: MouseEvent<HTMLButtonElement>) {
      event.preventDefault();

      Api.updateUserProfile({
        userEmail: updatedEmail,
      });
    }

    return (
      <div>
        <div>
          Email:
          <input type="text" value={updatedEmail} onChange={onChangUserEmail} />
        </div>

        <br />
        <button onClick={onSubmitSettings}>Save Settings</button>
      </div>
    );
  }

  return <div>Missing</div>;
};
