import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../services/databaseService";
import { HTTPResponse, SecuredHTTPResponse } from "../types/httpResponse";
import { SecuredHTTPRequest } from "../types/SecuredHTTPRequest";
import { checkAuthorization } from "./auth/authUtilities";

enum DefaultPostPrivacySetting {
  PublicAndGuestCheckout = "PublicAndGuestCheckout",
}

interface SetUserSettingsParams {
  username: string;
  bio: string;
  website: string;
  profileVisibility: DefaultPostPrivacySetting;
  bannedUsernames: string[];
}

interface DisplayedPost {
  imageUrl: string;
  creatorUsername: string;
  creationTimestamp: number;
  caption: string;
  likes: {
    count: number;
  };
  comments: {
    count: number;
  };
  shares: {
    count: number;
  };
}

interface DisplayedShopItems {
  title: string;
  price: number;
  description: string;
  countSold: number;
}

interface SuccessfulGetUserProfileResponse {
  username: string;
  followers: {
    count: number;
  };
  subscribers: {
    count: number;
  };
  follows: {
    count: number;
  };
  bio: string;
  posts: DisplayedPost[];
  shopItems: DisplayedShopItems[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FailedToUpdateUserSettingsResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SuccessfulUpdateToUserSettingsResponse {}

enum DeniedGetUserProfileResponseReason {
  Blocked = "Blocked",
  NotFound = "User Not Found",
}

interface DeniedGetUserProfileResponse {
  reason: DeniedGetUserProfileResponseReason;
}

@injectable()
@Route("user")
export class UserPageController extends Controller {
  constructor(private databaseService: DatabaseService) {
    super();
  }

  @Post("SetSettings")
  public async setUserSettings(
    @Body() requestBody: SecuredHTTPRequest<SetUserSettingsParams>,
  ): Promise<
    HTTPResponse<
      FailedToUpdateUserSettingsResponse,
      SuccessfulUpdateToUserSettingsResponse
    >
  > {
    console.log(requestBody);
    return {};
  }

  @Post("GeUserProfile")
  public async getUserProfile(
    @Request() request: express.Request,
  ): Promise<
    SecuredHTTPResponse<DeniedGetUserProfileResponse, SuccessfulGetUserProfileResponse>
  > {
    const { userId, error } = await checkAuthorization(this, request);
    if (error) return error;

    const user = await this.databaseService.usersTableService.selectUserByUserId({
      userId,
    });

    if (!user) {
      this.setStatus(404);
      return { error: { reason: DeniedGetUserProfileResponseReason.NotFound } };
    }

    return {
      success: {
        username: user.username,
        followers: {
          count: 9001,
        },
        subscribers: {
          count: 69,
        },
        follows: {
          count: 420,
        },
        bio: "I really like cats, if you couldn't tell already.",

        posts: [],
        shopItems: [],
      },
    };
  }
}
