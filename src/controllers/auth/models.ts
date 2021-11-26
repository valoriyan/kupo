export enum AuthFailureReason {
    WrongPassword = "Wrong Password",
    UnknownCause = "Unknown Cause",
    NoRefreshToken = "No Refresh Token Found",
    InvalidToken = "Failed To Validate Token",
    TokenGenerationFailed = "Failed To Generate Access Token",
    AuthorizationError = "You Must Be Logged In",
  }

export interface SuccessfulAuthResponse {
    accessToken: string;
}

export interface FailedAuthResponse {
    reason: AuthFailureReason;
  }  
