/* eslint-disable @typescript-eslint/ban-types */
import { RedisClientType, createClient } from "redis";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { singleton } from "tsyringe";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../controllers/models";

const THIRTY_MINUTES_IN_SECONDS = 30 * 60;

function generateIdempotencyKeyName({
  idempotentcyToken,
}: {
  idempotentcyToken: string;
}) {
  return `idem_${idempotentcyToken}`;
}

@singleton()
export class FastCacheService {
  static client: RedisClientType;

  async addIdempotentcyToken({
    controller,
    idempotentcyToken,
  }: {
    controller: Controller;
    idempotentcyToken: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const keyName = generateIdempotencyKeyName({ idempotentcyToken });
      await FastCacheService.client.set(keyName, "true", {
        // EXPIRE AFTER TIME
        EX: THIRTY_MINUTES_IN_SECONDS,
      });
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.FAST_CACHE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at FastCacheService.addIdempotentcyToken",
      });
    }
  }

  async assertThatIdempotentcyTokenDoesNotExist({
    controller,
    idempotentcyToken,
  }: {
    controller: Controller;
    idempotentcyToken: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const keyName = generateIdempotencyKeyName({ idempotentcyToken });

      const number_of_existing_keys = await FastCacheService.client.exists(keyName);

      if (number_of_existing_keys == 0) {
        return Success({});
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.IDEMPOTENTYCY_TOKEN_ALREADY_ENCOUNTERED,
        additionalErrorInformation:
          "Transaction already attempted at FastCacheService.assertThatIdempotentcyTokenDoesNotExist",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.FAST_CACHE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at FastCacheService.assertThatIdempotentcyTokenDoesNotExist",
      });
    }
  }

  static async start() {
    console.log("STARTING REDIS SERVICE");
    const client: RedisClientType = createClient();
    await client.connect();
    client.on("error", (err) => console.log("Redis Client Error", err));
    FastCacheService.client = client;
  }
}

FastCacheService.start();
