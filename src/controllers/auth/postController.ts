import { SecuredHTTPRequest } from "../../types/SecuredHTTPRequest";
import { Body, Controller, Post, Route, UploadedFile } from "tsoa";
import { HTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "src/services/blobStorageService";

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

@injectable()
@Route("post")
export class PostController extends Controller {
  constructor(private blobStorageService: LocalBlobStorageService) {
    super();
  }

  @Post("create")
  public async createPost(
    // @UploadedFiles() files: Express.Multer.File[],
    @UploadedFile() file: Express.Multer.File,
    @Body() requestBody: SecuredHTTPRequest<CreatePostParams>,
  ): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
    console.log(requestBody);

    const imageBuffer: Buffer = file.buffer;
    this.blobStorageService.saveImage({ image: imageBuffer });
    return {};
  }
}
