import { ChangeEvent, useState, MouseEvent } from "react";
import { Api } from "#/api";

export const PasswordSettings = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [newConfirmedPassword, setNewConfirmedPassword] = useState<string>("");

  function onChangeNewPassword(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setNewPassword(event.currentTarget.value);
  }

  function onChangeConfirmedNewPassword(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setNewConfirmedPassword(event.currentTarget.value);
  }

  function onClickSubmitUpdatedPassword(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    Api.updatePassword({ updatedPassword: newPassword });
  }

  return (
    <div>
      Password
      <div>
        <label>New Password</label>
        <input onChange={onChangeNewPassword} value={newPassword} />
      </div>
      <div>
        <label>Confirm Password</label>
        <input onChange={onChangeConfirmedNewPassword} value={newConfirmedPassword} />
      </div>
      <button onClick={onClickSubmitUpdatedPassword}>Save Settings</button>
    </div>
  );
};
