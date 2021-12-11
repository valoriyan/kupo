import { Pool } from "pg";
import { singleton } from "tsyringe";
import { DATABASE_NAME } from "./config";
import { setupDatabaseService } from "./setup";
import { ChatMessagesTableService } from "./tableServices/chatMessagesService";
import { ChatRoomsTableService } from "./tableServices/chatRoomsTableService";
import { HashtagsTableService } from "./tableServices/hashtagsTableService";
import { PostContentElementsTableService } from "./tableServices/postContentElementsTableService";
import { PostLikesTableService } from "./tableServices/postLikesTableService";
import { PostsTableService } from "./tableServices/postsTableService";
import { ShopItemMediaElementsTableService } from "./tableServices/shopItemMediaElementsTableService";
import { ShopItemsTableService } from "./tableServices/shopItemsTableService";
import { UserFollowsTableService } from "./tableServices/userFollowsTableService";
import { UserHashtagsTableService } from "./tableServices/userHashtagsTableService";
import { UsersTableService } from "./tableServices/usersTableService";
import { teardownDatabaseServive } from "./teardown";

@singleton()
export class DatabaseService {
  static datastorePool: Pool;

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
  };

  static async start(): Promise<void> {
    const connectionString = process.env.DATABASE_URL || undefined;
    const ssl = !!connectionString;
    const database = !!connectionString ? undefined : DATABASE_NAME;
    console.log(`STARTING DATABASE SERVICE @ '${connectionString}'`);

    DatabaseService.datastorePool = new Pool({
      database,
      connectionString,
      ssl,
    });
  }

  public async setupDatabaseService(): Promise<void> {
    await setupDatabaseService({
      tableNameToServicesMap: this.tableNameToServicesMap,
    });
  }

  public async teardownDatabaseService(): Promise<void> {
    await teardownDatabaseServive();
  }

  static async get(): Promise<Pool> {
    if (!DatabaseService.datastorePool) {
      DatabaseService.datastorePool = new Pool({
        database: DATABASE_NAME,
      });
    }

    return this.datastorePool;
  }
}

DatabaseService.get();
