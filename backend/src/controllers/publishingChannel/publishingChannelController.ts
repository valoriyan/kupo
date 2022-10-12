import express from "express";
import {
  Body,
  Controller,
  FormField,
  Post,
  Request,
  Route,
  UploadedFile,
  UploadedFiles,
} from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { WebSocketService } from "../../services/webSocketService";

import { BlobStorageService } from "../../services/blobStorageService";
import {
  CreatePublishingChannelFailedReason,
  CreatePublishingChannelSuccess,
  handleCreatePublishingChannel,
} from "./creation/handleCreatePublishingChannel";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import {
  handleUpdatePublishingChannel,
  UpdatePublishingChannelFailedReason,
  UpdatePublishingChannelRequestBody,
  UpdatePublishingChannelSuccess,
} from "./handleUpdatePublishingChannel";
import {
  handleSubmitPublishedItemToPublishingChannel,
  SubmitPublishedItemToPublishingChannelFailedReason,
  SubmitPublishedItemToPublishingChannelRequestBody,
  SubmitPublishedItemToPublishingChannelSuccess,
} from "./moderation/handleSubmitPublishedItemToPublishingChannel";
import {
  GetPublishingChannelByNameFailedReason,
  GetPublishingChannelByNameRequestBody,
  GetPublishingChannelByNameSuccess,
  handleGetPublishingChannelByName,
} from "./handleGetPublishingChannelByName";
import {
  handleResolvePublishingChannelSubmission,
  ResolvePublishingChannelSubmissionFailedReason,
  ResolvePublishingChannelSubmissionRequestBody,
  ResolvePublishingChannelSubmissionSuccess,
} from "./moderation/handleResolvePublishingChannelSubmission";
import {
  GetPublishedItemsInPublishingChannelFailedReason,
  GetPublishedItemsInPublishingChannelRequestBody,
  GetPublishedItemsInPublishingChannelSuccess,
  handleGetPublishedItemsInPublishingChannel,
} from "./handleGetPublishedItemsInPublishingChannel";
import {
  GetPublishingChannelSubmissionsFailedReason,
  GetPublishingChannelSubmissionsRequestBody,
  GetPublishingChannelSubmissionsSuccess,
  handleGetPublishingChannelSubmissions,
} from "./handleGetPublishingChannelSubmissions";
import {
  BanUserFromPublishingChannelFailedReason,
  BanUserFromPublishingChannelRequestBody,
  BanUserFromPublishingChannelSuccess,
  handleBanUserFromPublishingChannel,
} from "./moderation/handleBanUserFromPublishingChannel";
import {
  handleUndoBanUserFromPublishingChannel,
  UndoBanUserFromPublishingChannelFailedReason,
  UndoBanUserFromPublishingChannelRequestBody,
  UndoBanUserFromPublishingChannelSuccess,
} from "./moderation/handleUndoBanUserFromPublishingChannel";
import {
  AddModeratorToPublishingChannelFailedReason,
  AddModeratorToPublishingChannelRequestBody,
  AddModeratorToPublishingChannelSuccess,
  handleAddModeratorToPublishingChannel,
} from "./moderation/handleAddModeratorToPublishingChannel";
import {
  handleRemoveModeratorFromPublishingChannel,
  RemoveModeratorFromPublishingChannelFailedReason,
  RemoveModeratorFromPublishingChannelRequestBody,
  RemoveModeratorFromPublishingChannelSuccess,
} from "./moderation/handleRemoveModeratorFromPublishingChannel";
import {
  FollowPublishingChannelFailedReason,
  FollowPublishingChannelRequestBody,
  FollowPublishingChannelSuccess,
  handleFollowPublishingChannel,
} from "./userInteraction/handleFollowPublishingChannel";
import {
  handleUnfollowPublishingChannel,
  UnfollowPublishingChannelFailedReason,
  UnfollowPublishingChannelRequestBody,
  UnfollowPublishingChannelSuccess,
} from "./userInteraction/handleUnfollowPublishingChannel";
import {
  handleUpdatePublishingChannelBackgroundImage,
  UpdatePublishingChannelBackgroundImageFailedReason,
  UpdatePublishingChannelBackgroundImageSuccess,
} from "./handleUpdatePublishingChannelBackgroundImage";
import {
  handleUpdatePublishingChannelProfilePicture,
  UpdatePublishingChannelProfilePictureFailedReason,
  UpdatePublishingChannelProfilePictureSuccess,
} from "./handleUpdatePublishingChannelProfilePicture";
import {
  GetPublishingChannelsFollowedByUserIdFailedReason,
  GetPublishingChannelsFollowedByUserIdRequestBody,
  GetPublishingChannelsFollowedByUserIdSuccess,
  handleGetPublishingChannelsFollowedByUserId,
} from "./userInteraction/handleGetPublishingChannelsFollowedByUserId";
import {
  handleGetPublishingChannelNameValidity,
  IsPublishingChannelNameValidFailedReason,
  IsPublishingChannelNameValidRequestBody,
  IsPublishingChannelNameValidSuccess,
} from "./creation/handleGetPublishingChannelNameValidity";

@injectable()
@Route("publishing_channel")
export class PublishingChannelController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public webSocketService: WebSocketService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("createPublishingChannel")
  public async createPublishingChannel(
    @Request() request: express.Request,
    @FormField() publishingChannelName: string,
    @FormField() publishingChannelDescription: string,
    @UploadedFiles("backgroundImageAndProfilePicture")
    backgroundImageAndProfilePicture: Express.Multer.File[],
    @FormField() externalUrl1?: string,
    @FormField() externalUrl2?: string,
    @FormField() externalUrl3?: string,
    @FormField() externalUrl4?: string,
    @FormField() externalUrl5?: string,
    @FormField() publishingChannelRule1?: string,
    @FormField() publishingChannelRule2?: string,
    @FormField() publishingChannelRule3?: string,
    @FormField() publishingChannelRule4?: string,
    @FormField() publishingChannelRule5?: string,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreatePublishingChannelFailedReason>,
      CreatePublishingChannelSuccess
    >
  > {
    const externalUrls: string[] = [];
    [externalUrl1, externalUrl2, externalUrl3, externalUrl4, externalUrl5].forEach(
      (externalUrl) => {
        if (!!externalUrl) {
          externalUrls.push(externalUrl);
        }
      },
    );
    const publishingChannelRules: string[] = [];
    [
      publishingChannelRule1,
      publishingChannelRule2,
      publishingChannelRule3,
      publishingChannelRule4,
      publishingChannelRule5,
    ].forEach((publishingChannelRule) => {
      if (!!publishingChannelRule) {
        publishingChannelRules.push(publishingChannelRule);
      }
    });

    return await handleCreatePublishingChannel({
      controller: this,
      request,
      requestBody: {
        backgroundImageAndProfilePicture,
        publishingChannelName,
        publishingChannelDescription,
        externalUrls,
        publishingChannelRules,
      },
    });
  }

  @Post("followPublishingChannel")
  public async followPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: FollowPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | FollowPublishingChannelFailedReason>,
      FollowPublishingChannelSuccess
    >
  > {
    return await handleFollowPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("submitPublishedItemToPublishingChannel")
  public async submitPublishedItemToPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: SubmitPublishedItemToPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SubmitPublishedItemToPublishingChannelFailedReason>,
      SubmitPublishedItemToPublishingChannelSuccess
    >
  > {
    return await handleSubmitPublishedItemToPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("banUserFromPublishingChannel")
  public async banUserFromPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: BanUserFromPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | BanUserFromPublishingChannelFailedReason>,
      BanUserFromPublishingChannelSuccess
    >
  > {
    return await handleBanUserFromPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("addModeratorToPublishingChannel")
  public async addModeratorToPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: AddModeratorToPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | AddModeratorToPublishingChannelFailedReason>,
      AddModeratorToPublishingChannelSuccess
    >
  > {
    return await handleAddModeratorToPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////
  @Post("getPublishingChannelByName")
  public async getPublishingChannelByName(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishingChannelByNameRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishingChannelByNameFailedReason>,
      GetPublishingChannelByNameSuccess
    >
  > {
    return await handleGetPublishingChannelByName({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishedItemsInPublishingChannel")
  public async getPublishedItemsInPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemsInPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemsInPublishingChannelFailedReason>,
      GetPublishedItemsInPublishingChannelSuccess
    >
  > {
    return await handleGetPublishedItemsInPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishingChannelSubmissions")
  public async getPublishingChannelSubmissions(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishingChannelSubmissionsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishingChannelSubmissionsFailedReason>,
      GetPublishingChannelSubmissionsSuccess
    >
  > {
    return await handleGetPublishingChannelSubmissions({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishingChannelsFollowedByUserId")
  public async getPublishingChannelsFollowedByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishingChannelsFollowedByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishingChannelsFollowedByUserIdFailedReason>,
      GetPublishingChannelsFollowedByUserIdSuccess
    >
  > {
    return await handleGetPublishingChannelsFollowedByUserId({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishingChannelNameValidity")
  public async getPublishingChannelNameValidity(
    @Request() request: express.Request,
    @Body() requestBody: IsPublishingChannelNameValidRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | IsPublishingChannelNameValidFailedReason>,
      IsPublishingChannelNameValidSuccess
    >
  > {
    return await handleGetPublishingChannelNameValidity({
      controller: this,
      request,
      requestBody,
    });
  }
  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("updatePublishingChannel")
  public async updatePublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: UpdatePublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdatePublishingChannelFailedReason>,
      UpdatePublishingChannelSuccess
    >
  > {
    return await handleUpdatePublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("updatePublishingChannelProfilePicture")
  public async updatePublishingChannelProfilePicture(
    @Request() request: express.Request,
    @UploadedFile("profilePicture") profilePicture: Express.Multer.File,
    @FormField() publishingChannelId: string,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdatePublishingChannelProfilePictureFailedReason>,
      UpdatePublishingChannelProfilePictureSuccess
    >
  > {
    return await handleUpdatePublishingChannelProfilePicture({
      controller: this,
      request,
      requestBody: {
        profilePicture,
        publishingChannelId,
      },
    });
  }

  @Post("updatePublishingChannelBackgroundImage")
  public async updatePublishingChannelBackgroundImage(
    @Request() request: express.Request,
    @UploadedFile("backgroundImage") backgroundImage: Express.Multer.File,
    @FormField() publishingChannelId: string,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdatePublishingChannelBackgroundImageFailedReason>,
      UpdatePublishingChannelBackgroundImageSuccess
    >
  > {
    return await handleUpdatePublishingChannelBackgroundImage({
      controller: this,
      request,
      requestBody: {
        backgroundImage,
        publishingChannelId,
      },
    });
  }

  @Post("resolvePublishingChannelSubmission")
  public async resolvePublishingChannelSubmission(
    @Request() request: express.Request,
    @Body() requestBody: ResolvePublishingChannelSubmissionRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | ResolvePublishingChannelSubmissionFailedReason>,
      ResolvePublishingChannelSubmissionSuccess
    >
  > {
    return await handleResolvePublishingChannelSubmission({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("undoBanUserFromPublishingChannel")
  public async undoBanUserFromPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: UndoBanUserFromPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UndoBanUserFromPublishingChannelFailedReason>,
      UndoBanUserFromPublishingChannelSuccess
    >
  > {
    return await handleUndoBanUserFromPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("removeModeratorFromPublishingChannel")
  public async removeModeratorFromPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: RemoveModeratorFromPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | RemoveModeratorFromPublishingChannelFailedReason>,
      RemoveModeratorFromPublishingChannelSuccess
    >
  > {
    return await handleRemoveModeratorFromPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("unfollowPublishingChannel")
  public async unfollowPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: UnfollowPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UnfollowPublishingChannelFailedReason>,
      UnfollowPublishingChannelSuccess
    >
  > {
    return await handleUnfollowPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }
}
