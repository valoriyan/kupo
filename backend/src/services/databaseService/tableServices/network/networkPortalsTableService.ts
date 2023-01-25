/* eslint-disable @typescript-eslint/ban-types */
import { Pool } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { Controller } from "tsoa";

import { TableService } from "../models";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../controllers/models";

export class NetworkPortalsTableService extends TableService {
  public static readonly tableName = `network_portals`;
  public readonly tableName = NetworkPortalsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${NetworkPortalsTableService.tableName} (
        network_portal_id VARCHAR(64) UNIQUE NOT NULL,
        network_portal_name VARCHAR(64) UNIQUE NOT NULL,
        creation_timestamp BIGINT NOT NULL,

        CONSTRAINT ${NetworkPortalsTableService.tableName}_pkey
          PRIMARY KEY (network_portal_id)        
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async registerNetworkPortal({
    controller,
    networkPortalId,
    networkPortalName,
  }: {
    controller: Controller;
    networkPortalId: string;
    networkPortalName: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const now = Date.now();

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "network_portal_id", value: networkPortalId },
            { field: "network_portal_name", value: networkPortalName },
            { field: "creation_timestamp", value: now },
          ],
        ],
        tableName: this.tableName,
      });

      await this.datastorePool.query(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at NetworkPortalsTableService.registerNetworkPortal",
      });
    }
  }
  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
