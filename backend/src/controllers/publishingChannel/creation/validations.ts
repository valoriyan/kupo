import { DatabaseService } from "../../../services/databaseService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";

export enum ValidatePublishingChannelNameFailedReason {
  NameAlreadyTaken = "Name already taken",
  IllegalCharacters = "Name may only include lowercase English letters, digits, hyphens, and underscores",
}

export async function validatePublishingChannelName({
  publishingChannelName,
  controller,
  databaseService,
}: {
  publishingChannelName: string;
  controller: Controller;
  databaseService: DatabaseService;
}): Promise<
  // eslint-disable-next-line @typescript-eslint/ban-types
  InternalServiceResponse<ErrorReasonTypes<string>, {}>
> {
  //////////////////////////////////////////////////
  // Check that Name is Unique
  //////////////////////////////////////////////////

  const validatePublishingChannelUniqueNameResponse =
    await validatePublishingChannelUniqueName({
      controller,
      databaseService,
      publishingChannelName,
    });

  if (validatePublishingChannelUniqueNameResponse.type === EitherType.failure) {
    return validatePublishingChannelUniqueNameResponse;
  }

  //////////////////////////////////////////////////
  // Check that Characters are Valid
  //////////////////////////////////////////////////

  if (!/^[0-9a-zåäö_-]+$/.test(publishingChannelName)) {
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: ValidatePublishingChannelNameFailedReason.IllegalCharacters,
    });
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}

export async function validatePublishingChannelUniqueName({
  publishingChannelName,
  controller,
  databaseService,
}: {
  publishingChannelName: string;
  controller: Controller;
  databaseService: DatabaseService;
}): Promise<
  // eslint-disable-next-line @typescript-eslint/ban-types
  InternalServiceResponse<ErrorReasonTypes<string>, {}>
> {
  //////////////////////////////////////////////////
  // Read UnrenderablePublishingChannel from DB
  //////////////////////////////////////////////////

  const maybeGetPublishingChannelByNameResponse =
    await databaseService.tableNameToServicesMap.publishingChannelsTableService.getMaybePublishingChannelByName(
      {
        controller,
        name: publishingChannelName,
      },
    );

  if (maybeGetPublishingChannelByNameResponse.type === EitherType.failure) {
    return maybeGetPublishingChannelByNameResponse;
  }

  const { success: maybePublishingChannel } = maybeGetPublishingChannelByNameResponse;

  //////////////////////////////////////////////////
  // Return According to Result
  //////////////////////////////////////////////////

  if (maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: ValidatePublishingChannelNameFailedReason.NameAlreadyTaken,
    });
  }

  return Success({});
}
