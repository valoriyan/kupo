import { FailedToRegisterUserResponseReason } from ".";

export function validateUsername({
  username,
}: {
  username: string;
}): null | FailedToRegisterUserResponseReason {
  if (!/^[0-9a-z]+$/.test(username)) {
    return FailedToRegisterUserResponseReason.AllUsernameCharactersMustBeLowercaseEnglishLettersOrDigits;
  }

  return null;
}
