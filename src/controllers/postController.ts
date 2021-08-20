import { Controller, FormField, Post, Route, UploadedFile } from "tsoa";
import { HTTPResponse } from "../types/httpResponse";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "../services/blobStorageService";
import { DatabaseService } from "../services/databaseService";
import { v4 as uuidv4 } from "uuid";

enum PostPrivacySetting {
  Tier2AndTier3 = "Tier2AndTier3",
}

enum PostDurationSetting {
  Forever = "Forever",
}

enum CreatePostFailureReasons {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FailedToCreatePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SuccessfulPostCreationResponse {}

@injectable()
@Route("post")
export class PostController extends Controller {
  constructor(
    private blobStorageService: LocalBlobStorageService,
    private databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("create")
  public async createPost(
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
    const imageId = uuidv4();

    const imageBuffer: Buffer = file.buffer;

    const { fileKey: imageBlobFilekey } = await this.blobStorageService.saveImage({
      image: imageBuffer,
    });

    try {
      await this.databaseService.postsTableService.createPost({
        imageId,
        caption,
        imageBlobFilekey,
        title,
        price,
        scheduledPublicationTimestamp,
      });
      return {};
    } catch (error) {
      console.log("error", error);
      this.setStatus(401);
      return { error: { reason: CreatePostFailureReasons.UnknownCause } };
    }
  }
}
