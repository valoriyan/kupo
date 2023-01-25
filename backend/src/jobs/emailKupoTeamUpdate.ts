import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import { fakeController } from "../scripts/fakeData";

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";
import { DateTime } from "luxon";
import { EitherType } from "../utilities/monads";
import { EmailService } from "../services/emailService";

async function emailKupoTeamUpdate(): Promise<void> {
  const databaseService = new DatabaseService();
  const emailService = new EmailService();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nameEmailPairs = process.env
    .EMAIL_TARGETS!.split(",")
    .map((nameEmailPair) => nameEmailPair.split(" | "));

  //////////////////////////////////////////////////
  // Count New User Registrations in the Past Week
  //////////////////////////////////////////////////

  const countNewUsersInTimerangeResponse =
    await databaseService.tableNameToServicesMap.usersTableService.countNewUsersInTimerange(
      {
        controller: fakeController,
        startTimestamp: DateTime.now().minus({ weeks: 1 }).toMillis(),
        endTimestamp: DateTime.now().toMillis(),
      },
    );

  if (countNewUsersInTimerangeResponse.type === EitherType.failure) {
    throw new Error(countNewUsersInTimerangeResponse.error.errorMessage);
  }
  const { success: countOfNewUsersInPastWeek } = countNewUsersInTimerangeResponse;

  //////////////////////////////////////////////////
  // Count New User Registrations in the Past Week
  //////////////////////////////////////////////////

  const countOfNewUsersInPastDayResponse =
    await databaseService.tableNameToServicesMap.usersTableService.countNewUsersInTimerange(
      {
        controller: fakeController,
        startTimestamp: DateTime.now().minus({ days: 1 }).toMillis(),
        endTimestamp: DateTime.now().toMillis(),
      },
    );

  if (countOfNewUsersInPastDayResponse.type === EitherType.failure) {
    throw new Error(countOfNewUsersInPastDayResponse.error.errorMessage);
  }
  const { success: countOfNewUsersInPastDay } = countOfNewUsersInPastDayResponse;

  //////////////////////////////////////////////////
  // Send Emails
  //////////////////////////////////////////////////

  nameEmailPairs.forEach(([name, email]) => {
    emailService.sendKupoTeamUpdate({
      controller: fakeController,
      name,
      email,
      countOfNewUsersInPastDay,
      countOfNewUsersInPastWeek,
    });
  });
}

emailKupoTeamUpdate();
