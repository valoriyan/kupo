import { SecuredHTTPRequest } from "../../types/SecuredHTTPRequest";
import { Body, Controller, Post, Route } from "tsoa";
import { HTTPResponse } from "../../types/httpResponse";

enum PostPrivacySetting {
  Tier2AndTier3 = "Tier2AndTier3",
}

enum PostDurationSetting {
  Forever = "Forever",
}

interface CreatePostParams {
  imageId: string;
  caption: string;
  visibility: PostPrivacySetting;
  duration: PostDurationSetting;
  title: string;
  price: number;
  collaboratorUsernames: string[];
  scheduledPublicationTimestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FailedToCreatePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SuccessfulPostCreationResponse {}

@Route("post")
export class PostController extends Controller {
  @Post("create")
  public async createPost(
    @Body() requestBody: SecuredHTTPRequest<CreatePostParams>,
  ): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
    console.log(requestBody);
    return {};
  }
}
