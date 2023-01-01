import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";
import { WasabiBlobStorageService } from "../services/blobStorageService/WasabiBlobStorageService";
import { fakeController } from "../scripts/fakeData";
import { EitherType } from "../utilities/monads";

async function removeOrphanedBlobs(): Promise<void> {
  const databaseService = new DatabaseService();

  const blobStorageService = new WasabiBlobStorageService();

  await WasabiBlobStorageService.get();
  const blobFileKeys = await blobStorageService.listAllBlobsKeys();

  //////////////////////////////////////////////////
  // List All Blob File Keys
  //////////////////////////////////////////////////

  const unclaimedBlobFileKeys = new Set(blobFileKeys);

  //////////////////////////////////////////////////
  // Which Ones Exist in Posts
  //////////////////////////////////////////////////

  const determineWhichBlobFileKeysExistPostResponse =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.determineWhichBlobFileKeysExist(
      {
        controller: fakeController,
        blobFileKeys,
      },
    );
  if (determineWhichBlobFileKeysExistPostResponse.type === EitherType.failure) {
    throw new Error(determineWhichBlobFileKeysExistPostResponse.error.errorMessage);
  }
  const { success: blobFileKeysUsedForPosts } =
    determineWhichBlobFileKeysExistPostResponse;

  //////////////////////////////////////////////////
  // Which Ones Exist in Shop Items
  //////////////////////////////////////////////////

  const determineWhichBlobFileKeysExistShopItemResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.determineWhichBlobFileKeysExist(
      {
        controller: fakeController,
        blobFileKeys,
      },
    );
  if (determineWhichBlobFileKeysExistShopItemResponse.type === EitherType.failure) {
    throw new Error(determineWhichBlobFileKeysExistShopItemResponse.error.errorMessage);
  }
  const { success: blobFileKeysUsedForShopItems } =
    determineWhichBlobFileKeysExistShopItemResponse;

  //////////////////////////////////////////////////
  // Which Ones Exist in Publishing Channels
  //////////////////////////////////////////////////

  const determineWhichBlobFileKeysExistPublishingChannelsResponse =
    await databaseService.tableNameToServicesMap.publishingChannelsTableService.determineWhichBlobFileKeysExist(
      {
        controller: fakeController,
        blobFileKeys,
      },
    );
  if (
    determineWhichBlobFileKeysExistPublishingChannelsResponse.type === EitherType.failure
  ) {
    throw new Error(
      determineWhichBlobFileKeysExistPublishingChannelsResponse.error.errorMessage,
    );
  }
  const { success: blobFileKeysUsedForPublishingChannels } =
    determineWhichBlobFileKeysExistPublishingChannelsResponse;

  //////////////////////////////////////////////////
  // Which Ones Exist in Users
  //////////////////////////////////////////////////

  const determineWhichBlobFileKeysExistUsersResponse =
    await databaseService.tableNameToServicesMap.usersTableService.determineWhichBlobFileKeysExist(
      {
        controller: fakeController,
        blobFileKeys,
      },
    );
  if (determineWhichBlobFileKeysExistUsersResponse.type === EitherType.failure) {
    throw new Error(determineWhichBlobFileKeysExistUsersResponse.error.errorMessage);
  }
  const { success: blobFileKeysUsedForUsersChannels } =
    determineWhichBlobFileKeysExistUsersResponse;

  //////////////////////////////////////////////////
  // Find Orphans
  //////////////////////////////////////////////////

  blobFileKeysUsedForPosts.forEach((blobFileKey) => {
    unclaimedBlobFileKeys.delete(blobFileKey);
  });

  blobFileKeysUsedForShopItems.forEach((blobFileKey) => {
    unclaimedBlobFileKeys.delete(blobFileKey);
  });

  blobFileKeysUsedForPublishingChannels.forEach((blobFileKey) => {
    unclaimedBlobFileKeys.delete(blobFileKey);
  });

  blobFileKeysUsedForUsersChannels.forEach((blobFileKey) => {
    unclaimedBlobFileKeys.delete(blobFileKey);
  });

  console.log(`COUNT OF KEYS: ${blobFileKeys.length}`);
  console.log(`COUNT OF UNCLAIMED KEYS: ${unclaimedBlobFileKeys.size}`);

  //////////////////////////////////////////////////
  // Delete Orphaned Keys
  //////////////////////////////////////////////////

  await blobStorageService.deleteImages({
    controller: fakeController,
    blobPointers: Array.from(unclaimedBlobFileKeys).map((fileKey) => ({ fileKey })),
  });
}

removeOrphanedBlobs();
