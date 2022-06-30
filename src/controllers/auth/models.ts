export enum AuthFailedReason {
  WrongPassword = "Wrong Password",
  UnknownCause = "Unknown Cause",
  NoRefreshToken = "No Refresh Token Found",
  InvalidToken = "Failed To Validate Token",
  TokenGenerationFailed = "Failed To Generate Access Token",
  AuthorizationError = "You Must Be Logged In",
}

export interface AuthSuccess {
  accessToken: string;
}

export interface AuthFailed {
  reason: AuthFailedReason;
}
