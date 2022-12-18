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
  NameAlreadyTaken = "NameAlreadyTaken",
  IllegalCharacters = "All Username Characters Must Be Lowercase English Letters, Digits, periods, dashes, or underscores",
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
  const validatePublishingChannelUniqueNameResponse =
    await validatePublishingChannelUniqueName({
      controller,
      databaseService,
      publishingChannelName,
    });

  if (validatePublishingChannelUniqueNameResponse.type === EitherType.failure) {
    return validatePublishingChannelUniqueNameResponse;
  }

  if (!/^[0-9a-z._-]+$/.test(publishingChannelName)) {
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: ValidatePublishingChannelNameFailedReason.IllegalCharacters,
    });
  }

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
  const maybeGetPublishingChannelByNameResponse =
    await databaseService.tableNameToServicesMap.publishingChannelsTableService.getPublishingChannelByName(
      {
        controller,
        name: publishingChannelName,
      },
    );

  if (maybeGetPublishingChannelByNameResponse.type === EitherType.failure) {
    return maybeGetPublishingChannelByNameResponse;
  }

  const { success: maybePublishingChannel } = maybeGetPublishingChannelByNameResponse;

  if (maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: ValidatePublishingChannelNameFailedReason.NameAlreadyTaken,
    });
  }

  return Success({});
}
