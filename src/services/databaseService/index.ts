import { Pool, PoolConfig } from "pg";
import { getEnvironmentVariable } from "../../utilities";
import { singleton } from "tsyringe";
import { DATABASE_NAME } from "./config";
import { setupDatabaseService } from "./setup";
import { ChatMessagesTableService } from "./tableServices/chatMessagesTableService";
import { ChatRoomsTableService } from "./tableServices/chatRoomsTableService";
import { HashtagsTableService } from "./tableServices/hashtagsTableService";
import { PostCommentsTableService } from "./tableServices/postCommentsTableService";
import { PostContentElementsTableService } from "./tableServices/postContentElementsTableService";
import { PostLikesTableService } from "./tableServices/postLikesTableService";
import { PostsTableService } from "./tableServices/postsTableService";
import { ShopItemMediaElementsTableService } from "./tableServices/shopItemMediaElementsTableService";
import { ShopItemsTableService } from "./tableServices/shopItemsTableService";
import { UserContentFeedFiltersTableService } from "./tableServices/userContentFeedFiltersTableService";
import { UserFollowsTableService } from "./tableServices/userFollowsTableService";
import { UserHashtagsTableService } from "./tableServices/userHashtagsTableService";
import { UsersTableService } from "./tableServices/usersTableService";
import { teardownDatabaseService } from "./teardown";
import { DatabaseServiceType } from "./models";
import { UserNotificationsTableService } from "./tableServices/userNotificationsTableService";
import { SavedItemsTableService } from "./tableServices/savedItemsTableService";

@singleton()
export class DatabaseService {
  static datastorePool: Pool;
  static IMPLEMENTED_DATABASE_SERVICE_TYPE = getEnvironmentVariable(
    "IMPLEMENTED_DATABASE_SERVICE_TYPE",
  );

  public tableNameToServicesMap = {
    usersTableService: new UsersTableService(DatabaseService.datastorePool),
    postsTableService: new PostsTableService(DatabaseService.datastorePool),
    postContentElementsTableService: new PostContentElementsTableService(
      DatabaseService.datastorePool,
    ),
    userFollowsTableService: new UserFollowsTableService(DatabaseService.datastorePool),
    shopItemTableService: new ShopItemsTableService(DatabaseService.datastorePool),
    shopItemMediaElementTableService: new ShopItemMediaElementsTableService(
      DatabaseService.datastorePool,
    ),
    hashtagTableService: new HashtagsTableService(DatabaseService.datastorePool),
    chatMessagesTableService: new ChatMessagesTableService(DatabaseService.datastorePool),
    chatRoomsTableService: new ChatRoomsTableService(DatabaseService.datastorePool),
    userHashtagsTableService: new UserHashtagsTableService(DatabaseService.datastorePool),
    postLikesTableService: new PostLikesTableService(DatabaseService.datastorePool),
    postCommentsTableService: new PostCommentsTableService(DatabaseService.datastorePool),
    userContentFeedFiltersTableService: new UserContentFeedFiltersTableService(
      DatabaseService.datastorePool,
    ),
    userNotificationsTableService: new UserNotificationsTableService(
      DatabaseService.datastorePool,
    ),
    savedItemsTableService: new SavedItemsTableService(DatabaseService.datastorePool),
  };

  static async start(): Promise<void> {
    DatabaseService.get();
  }

  public async setupDatabaseService(): Promise<void> {
    await setupDatabaseService({
      tableNameToServicesMap: this.tableNameToServicesMap,
    });
  }

  public async teardownDatabaseService(): Promise<void> {
    // Only works for local
    await teardownDatabaseService();
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
