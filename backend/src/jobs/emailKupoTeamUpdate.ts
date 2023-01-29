import { config as injectEnvironmentVariables } from "dotenv";
injectEnvironmentVariables();

import { fakeController } from "../scripts/fakeData";

import "reflect-metadata";
import { DatabaseService } from "../services/databaseService";
import { DateTime } from "luxon";
import { EitherType } from "../utilities/monads";
import { EmailService } from "../services/emailService";

function calculateMetricsChange(startValue: number, endValue: number) {
  return (endValue - startValue) / startValue;
}

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

  const countNewUsersInTimerangeInPastWeekResponse =
    await databaseService.tableNameToServicesMap.usersTableService.countNewUsersInTimerange(
      {
        controller: fakeController,
        startTimestamp: DateTime.now().minus({ weeks: 1 }).toMillis(),
        endTimestamp: DateTime.now().toMillis(),
      },
    );

  if (countNewUsersInTimerangeInPastWeekResponse.type === EitherType.failure) {
    throw new Error(countNewUsersInTimerangeInPastWeekResponse.error.errorMessage);
  }
  const { success: countOfNewUsersInPastWeek } =
    countNewUsersInTimerangeInPastWeekResponse;

  //////////////////////////////////////////////////
  // Count New User Registrations in the Previous Week
  //////////////////////////////////////////////////

  const countNewUsersInTimerangeInPreviousWeekResponse =
    await databaseService.tableNameToServicesMap.usersTableService.countNewUsersInTimerange(
      {
        controller: fakeController,
        startTimestamp: DateTime.now().minus({ weeks: 2 }).toMillis(),
        endTimestamp: DateTime.now().minus({ weeks: 1 }).toMillis(),
      },
    );

  if (countNewUsersInTimerangeInPreviousWeekResponse.type === EitherType.failure) {
    throw new Error(countNewUsersInTimerangeInPreviousWeekResponse.error.errorMessage);
  }
  const { success: countOfNewUsersInPreviousWeek } =
    countNewUsersInTimerangeInPreviousWeekResponse;

  //////////////////////////////////////////////////
  // Count New User Registrations in the Past Day
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
  // Count New User Registrations in the Previous Day
  //////////////////////////////////////////////////

  const countOfNewUsersInPreviousDayResponse =
    await databaseService.tableNameToServicesMap.usersTableService.countNewUsersInTimerange(
      {
        controller: fakeController,
        startTimestamp: DateTime.now().minus({ days: 2 }).toMillis(),
        endTimestamp: DateTime.now().minus({ days: 1 }).toMillis(),
      },
    );

  if (countOfNewUsersInPreviousDayResponse.type === EitherType.failure) {
    throw new Error(countOfNewUsersInPreviousDayResponse.error.errorMessage);
  }
  const { success: countOfNewUsersInPreviousDay } = countOfNewUsersInPreviousDayResponse;

  //////////////////////////////////////////////////
  // Send Emails
  //////////////////////////////////////////////////

  nameEmailPairs.forEach(([name, email]) => {
    emailService.sendKupoTeamUpdate({
      controller: fakeController,
      name,
      email,
      kupoTeamUpdateMetrics: {
        countOfNewUsersInPastDay,
        countOfNewUsersInPastWeek,
        percentChangeInNewUserSignupsDayOverDay: calculateMetricsChange(
          countOfNewUsersInPreviousDay,
          countOfNewUsersInPastDay,
        ),
        percentChangeInNewUserSignupsWeekOverWeek: calculateMetricsChange(
          countOfNewUsersInPreviousWeek,
          countOfNewUsersInPastWeek,
        ),
      },
    });
  });
}

emailKupoTeamUpdate();
