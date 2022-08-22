import { RegisterUserFailedReason } from ".";

export function validateUsername({
  username,
}: {
  username: string;
}): null | RegisterUserFailedReason {
  if (!/^[0-9a-z]+$/.test(username)) {
    return RegisterUserFailedReason.ValidationError;
  }

  return null;
}
