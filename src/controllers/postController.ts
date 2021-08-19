// import { SecuredHTTPRequest } from "../../types/SecuredHTTPRequest";
import { Controller, FormField, Post, Route, UploadedFile } from "tsoa";
import { HTTPResponse } from "../types/httpResponse";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "../services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";

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
  constructor(private blobStorageService: LocalBlobStorageService) {
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

    const {fileKey: imageBlobFilekey} = await this.blobStorageService.saveImage({ image: imageBuffer });

    const datastorePool: Pool = await DatabaseService.get();

    const queryString = `
      INSERT INTO ${DatabaseService.postsTableName}(
        image_id,
        caption,
        image_blob_filekey,
        title,
        price,
        scheduled_publication_timestamp
      )
      VALUES (
        '${imageId}',
        '${caption}',
        '${imageBlobFilekey}',
        '${title}',
        '${price}',
        '${scheduledPublicationTimestamp}'
      )
      ;
    `;

    try {
      await datastorePool.query(queryString);
      return {};
    } catch (error) {
      console.log("error", error);
      this.setStatus(401);
      return { error: { reason: CreatePostFailureReasons.UnknownCause } };
    }


  }
}
