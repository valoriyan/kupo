import { HTTPResponse } from "../types/httpResponse";
import { SecuredHTTPRequest } from "../types/SecuredHTTPRequest";
import { Body, Controller, Post, Route } from "tsoa";

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

interface GetUserPageParams {
  username: string;
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

interface SuccessfulGetUserPageResponse {
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

enum DeniedGetUserPageResponseReason {
  Blocked = "Blocked",
}

interface DeniedGetUserPageResponse {
  reason: DeniedGetUserPageResponseReason;
}

@Route("user")
export class UserPageController extends Controller {
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

  @Post("GetPosts")
  public async getPostsPage(
    @Body() requestBody: SecuredHTTPRequest<GetUserPageParams>,
  ): Promise<HTTPResponse<DeniedGetUserPageResponse, SuccessfulGetUserPageResponse>> {
    return {
      success: {
        username: requestBody.data.username,
        followers: {
          count: 3000,
        },
        subscribers: {
          count: 83,
        },
        follows: {
          count: 5,
        },
        bio: "I really like cats, if you couldn't tell already.",

        posts: [],
        shopItems: [],
      },
    };
  }
}
