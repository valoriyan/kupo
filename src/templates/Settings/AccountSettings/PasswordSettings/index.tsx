import { ChangeEvent, MouseEvent } from "react";
import { Api } from "#/api";
import { FormStateProvider, useFormState } from "./FormContext";

export const PasswordSettingsInner = () => {

  const {
    newPassword,
    setNewPassword,
    confirmedNewPassword,
    setConfirmedNewPassword,
  } = useFormState();


  function onChangeNewPassword(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setNewPassword(event.currentTarget.value);
  }

  function onChangeConfirmedNewPassword(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setConfirmedNewPassword(event.currentTarget.value);
  }

  function onClickSubmitUpdatedPassword(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    Api.updatePassword({ updatedPassword: newPassword });
  }

  return (
    <FormStateProvider>
      Password
      <div>
        <label>New Password</label>
        <input onChange={onChangeNewPassword} value={newPassword} />
      </div>
      <div>
        <label>Confirm Password</label>
        <input onChange={onChangeConfirmedNewPassword} value={confirmedNewPassword} />
      </div>
      <button onClick={onClickSubmitUpdatedPassword}>Save Settings</button>
    </FormStateProvider>
  );
};

export const PasswordSettings = () => {
  return (
    <FormStateProvider>
      <PasswordSettingsInner />
    </FormStateProvider>
  );
};
