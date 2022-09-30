import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import "reflect-metadata";
import { getEnvironmentVariable } from "../utilities";
import { DatabaseService } from "../services/databaseService";

async function customScript(): Promise<void> {
  await customPostgresScript();
}

async function customPostgresScript() {
  const productionEnvironment: string = getEnvironmentVariable("PRODUCTION_ENVIRONMENT");

  if (["dev"].includes(productionEnvironment)) {
    const query = {
      // text: `
      //   SELECT
      //     *
      //   FROM
      //     published_items
      //   ORDER BY
      //     creation_timestamp
      //   ;
      // `,
      text: `
     `,
      values: [],
    };

    const response = await DatabaseService.datastorePool.query(query);
    // const tableFields = response.fields;
    console.log(response.rows);
  }
}

// async function customPaymentProcessingScript() {
//   const paymentProcessingService = new PaymentProcessingService();

//   const customerId = await paymentProcessingService.registerCustomer({
//     controller: fakeController,
//     customerEmail: "_______",
//   });

//   console.log(`customerId: ${customerId}`);

// }

customScript();
