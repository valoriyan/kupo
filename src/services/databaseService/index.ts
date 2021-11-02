import { Pool } from "pg";
import { singleton } from "tsyringe";
import { DATABASE_NAME } from "./config";
import { setupDatabaseService } from "./setup";
import { HashtagTableService } from "./tableServices/hashtagTableService";
import { PostContentElementsTableService } from "./tableServices/postContentElementsTableService";
import { PostTableService } from "./tableServices/postTableService";
import { ShopItemMediaElementTableService } from "./tableServices/shopItemMediaElementTableService";
import { ShopItemTableService } from "./tableServices/shopItemTableService";
import { UserFollowsTableService } from "./tableServices/userFollowsTableService";
import { UsersTableService } from "./tableServices/usersTableService";
import { teardownDatabaseServive } from "./teardown";

@singleton()
export class DatabaseService {
  static datastorePool: Pool;

  public tableNameToServicesMap = {
    usersTableService: new UsersTableService(DatabaseService.datastorePool),
    postsTableService: new PostTableService(DatabaseService.datastorePool),
    postContentElementsTableService: new PostContentElementsTableService(
      DatabaseService.datastorePool,
    ),
    userFollowsTableService: new UserFollowsTableService(DatabaseService.datastorePool),
    shopItemTableService: new ShopItemTableService(DatabaseService.datastorePool),
    shopItemMediaElementTableService: new ShopItemMediaElementTableService(
      DatabaseService.datastorePool,
    ),
    hashtagTableService: new HashtagTableService(DatabaseService.datastorePool),
  };

  static async start(): Promise<void> {
    console.log("STARTING DATABASE SERVICE");
    DatabaseService.datastorePool = new Pool({
      database: DATABASE_NAME,
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
