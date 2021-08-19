import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";

async function setupScript(): Promise<void> {
    await DatabaseService.setupTables();
}

setupScript();