// import { SecuredHTTPRequest } from "../../types/SecuredHTTPRequest";
import { Controller, FormField, Post, Route, UploadedFile } from "tsoa";
import { HTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "src/services/blobStorageService";

enum PostPrivacySetting {
  Tier2AndTier3 = "Tier2AndTier3",
}

enum PostDurationSetting {
  Forever = "Forever",
}

// interface CreatePostParams {
//   imageId: string;
//   caption: string;
//   visibility: PostPrivacySetting;
//   duration: PostDurationSetting;
//   title: string;
//   price: number;
//   collaboratorUsernames: string[];
//   scheduledPublicationTimestamp: number;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FailedToCreatePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SuccessfulPostCreationResponse {}

@injectable()
@Route("post")
export class PostController extends Controller {
  constructor(private blobStorageService: LocalBlobStorageService) {
    super();
  }

  @Post("create")
  public async createPost(
    @FormField() imageId: string,
    @FormField() caption: string,
    @FormField() visibility: PostPrivacySetting,
    @FormField() duration: PostDurationSetting,
    @FormField() title: string,
    @FormField() price: number,
    @FormField() collaboratorUsernames: string[],
    @FormField() scheduledPublicationTimestamp: number,
    @UploadedFile() file: Express.Multer.File,
    // @Body() requestBody: SecuredHTTPRequest<CreatePostParams>,
  ): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
    const imageBuffer: Buffer = file.buffer;
    this.blobStorageService.saveImage({ image: imageBuffer });
    return {};
  }
}
