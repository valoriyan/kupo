import { Pool, PoolConfig } from "pg";
import { getEnvironmentVariable } from "../../utilities";
import { singleton } from "tsyringe";
import { DATABASE_NAME } from "./config";
import { setupDatabaseService } from "./setup";
import { ChatMessagesTableService } from "./tableServices/chat/chatMessagesTableService";
import { ChatRoomJoinsTableService } from "./tableServices/chat/chatRoomJoinsTableService";
import { PublishedItemHashtagsTableService } from "./tableServices/publishedItem/publishedItemHashtagsTableService";
import { PublishedItemCommentsTableService } from "./tableServices/publishedItem/publishedItemCommentsTableService";
import { PostContentElementsTableService } from "./tableServices/publishedItem/postContentElementsTableService";
import { PublishedItemLikesTableService } from "./tableServices/publishedItem/publishedItemLikesTableService";
import { PublishedItemsTableService } from "./tableServices/publishedItem/publishedItemsTableService";
import { ShopItemMediaElementsTableService } from "./tableServices/publishedItem/shopItemMediaElementsTableService";
import { ShopItemsTableService } from "./tableServices/publishedItem/shopItemsTableService";
import { UserContentFeedFiltersTableService } from "./tableServices/userContentFeedFiltersTableService";
import { UserFollowsTableService } from "./tableServices/users/userFollowsTableService";
import { UserHashtagsTableService } from "./tableServices/users/userHashtagsTableService";
import { UsersTableService } from "./tableServices/users/usersTableService";
import { teardownDatabaseService } from "./teardown";
import { DatabaseServiceType } from "./models";
import { UserNotificationsTableService } from "./tableServices/userNotificationsTableService";
import { SavedItemsTableService } from "./tableServices/savedItemsTableService";
import { StoredCreditCardDataTableService } from "./tableServices/users/storedCreditCardDataTableService";
import { PublishedItemTransactionsTableService } from "./tableServices/publishedItem/publishedItemTransactionsTableService";
import { UserLoginAttemptsTableService } from "./tableServices/users/userLoginAttemptsTableService";
import { ChatRoomReadRecordsTableService } from "./tableServices/chat/chatRoomReadRecordsTableService";
import { PublishingChannelsTableService } from "./tableServices/publishingChannel/publishingChannelsTableService";
import { PublishingChannelSubmissionsTableService } from "./tableServices/publishingChannel/publishingChannelSubmissionsTableService";
import { PublishingChannelUserBansTableService } from "./tableServices/publishingChannel/moderation/publishingChannelUserBansTableService";
import { PublishingChannelModeratorsTableService } from "./tableServices/publishingChannel/moderation/publishingChannelModeratorsTableService";
import { UserBlocksTableService } from "./tableServices/users/userBlocksTable";
import { PublishingChannelFollowsTableService } from "./tableServices/publishingChannel/publishingChannelFollowsTableService";
import { NetworkPortalsTableService } from "./tableServices/network/networkPortalsTableService";
import { PublishingChannelInvitationsTableService } from "./tableServices/publishingChannel/publishingChannelInvitationsTableService";

@singleton()
export class DatabaseService {
  static datastorePool: Pool;
  static IMPLEMENTED_DATABASE_SERVICE_TYPE = getEnvironmentVariable(
    "IMPLEMENTED_DATABASE_SERVICE_TYPE",
  );

  public tableNameToServicesMap = {
    usersTableService: new UsersTableService(DatabaseService.datastorePool),
    publishedItemsTableService: new PublishedItemsTableService(
      DatabaseService.datastorePool,
    ),
    postContentElementsTableService: new PostContentElementsTableService(
      DatabaseService.datastorePool,
    ),
    userFollowsTableService: new UserFollowsTableService(DatabaseService.datastorePool),
    shopItemsTableService: new ShopItemsTableService(DatabaseService.datastorePool),
    shopItemMediaElementsTableService: new ShopItemMediaElementsTableService(
      DatabaseService.datastorePool,
    ),
    publishedItemHashtagsTableService: new PublishedItemHashtagsTableService(
      DatabaseService.datastorePool,
    ),
    chatMessagesTableService: new ChatMessagesTableService(DatabaseService.datastorePool),
    chatRoomJoinsTableService: new ChatRoomJoinsTableService(
      DatabaseService.datastorePool,
    ),
    userHashtagsTableService: new UserHashtagsTableService(DatabaseService.datastorePool),
    publishedItemLikesTableService: new PublishedItemLikesTableService(
      DatabaseService.datastorePool,
    ),
    publishedItemCommentsTableService: new PublishedItemCommentsTableService(
      DatabaseService.datastorePool,
    ),
    userContentFeedFiltersTableService: new UserContentFeedFiltersTableService(
      DatabaseService.datastorePool,
    ),
    userNotificationsTableService: new UserNotificationsTableService(
      DatabaseService.datastorePool,
    ),
    savedItemsTableService: new SavedItemsTableService(DatabaseService.datastorePool),
    storedCreditCardDataTableService: new StoredCreditCardDataTableService(
      DatabaseService.datastorePool,
    ),
    publishedItemTransactionsTableService: new PublishedItemTransactionsTableService(
      DatabaseService.datastorePool,
    ),
    userLoginAttemptsTableService: new UserLoginAttemptsTableService(
      DatabaseService.datastorePool,
    ),
    chatRoomReadRecordsTableService: new ChatRoomReadRecordsTableService(
      DatabaseService.datastorePool,
    ),
    publishingChannelsTableService: new PublishingChannelsTableService(
      DatabaseService.datastorePool,
    ),
    publishingChannelSubmissionsTableService:
      new PublishingChannelSubmissionsTableService(DatabaseService.datastorePool),
    publishingChannelModeratorsTableService: new PublishingChannelModeratorsTableService(
      DatabaseService.datastorePool,
    ),
    publishingChannelUserBansTableService: new PublishingChannelUserBansTableService(
      DatabaseService.datastorePool,
    ),
    userBlocksTableService: new UserBlocksTableService(DatabaseService.datastorePool),
    publishingChannelFollowsTableService: new PublishingChannelFollowsTableService(
      DatabaseService.datastorePool,
    ),
    networkPortalsTableService: new NetworkPortalsTableService(
      DatabaseService.datastorePool,
    ),
    publishingChannelInvitationsTableService:
      new PublishingChannelInvitationsTableService(DatabaseService.datastorePool),
  };

  static async start(): Promise<void> {
    DatabaseService.get();
  }

  public async setupDatabaseService({
    databaseAlreadyExists,
  }: {
    databaseAlreadyExists?: boolean;
  }): Promise<void> {
    await setupDatabaseService({
      tableNameToServicesMap: this.tableNameToServicesMap,
      databaseAlreadyExists,
    });
  }

  public async teardownDatabaseService(): Promise<void> {
    await teardownDatabaseService({ tableServices: this.tableNameToServicesMap });
  }

  static async get(): Promise<Pool> {
    if (!DatabaseService.datastorePool) {
      const connectionString = process.env.DATABASE_URL || undefined;
      const ssl = !!connectionString ? { rejectUnauthorized: false } : undefined;
      const database = !!connectionString ? undefined : DATABASE_NAME;

      let poolConfig: PoolConfig;
      if (
        DatabaseService.IMPLEMENTED_DATABASE_SERVICE_TYPE ===
        DatabaseServiceType.REMOTE_POSTGRES
      ) {
        poolConfig = {
          connectionString,
          ssl,
        };
        console.log(
          `STARTING DATABASE SERVICE @ '${connectionString}' | ${JSON.stringify(ssl)}`,
        );
      } else if (
        DatabaseService.IMPLEMENTED_DATABASE_SERVICE_TYPE ===
        DatabaseServiceType.LOCAL_POSTGRES
      ) {
        poolConfig = {
          database,
        };
        console.log(`STARTING DATABASE SERVICE @ '${database}'`);
      } else {
        throw new Error(
          `Unrecognized IMPLEMENTED_DATABASE_SERVICE_TYPE: "${DatabaseService.IMPLEMENTED_DATABASE_SERVICE_TYPE}"`,
        );
      }

      DatabaseService.datastorePool = new Pool(poolConfig);
    }

    return this.datastorePool;
  }
}

DatabaseService.get();
