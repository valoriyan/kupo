import { singleton } from "tsyringe";
import { getEnvironmentVariable } from "../../utilities";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const securionPay = require("securionpay");

@singleton()
export class PaymentProcessingService {
  private static SECURION_PAY_PRIVATE_KEY: string = getEnvironmentVariable(
    "SECURION_PAY_PRIVATE_KEY",
  );
  public static securionPayApi = securionPay(
    PaymentProcessingService.SECURION_PAY_PRIVATE_KEY,
  );

  async chargeCustomer({
    userEmail,
    CREDIT_CARD_NUMBER,
    CREDIT_CARD_EXPIRATION_MONTH,
    CREDIT_CARD_EXPIRATION_YEAR,
    CREDIT_CARD_VERIFICATION_CODE,
    CREDIT_CARD_OWNER_NAME,
    chargeAmount,
  }: {
    userEmail: string;
    CREDIT_CARD_NUMBER: string;
    CREDIT_CARD_EXPIRATION_MONTH: string;
    CREDIT_CARD_EXPIRATION_YEAR: string;
    CREDIT_CARD_VERIFICATION_CODE: string;
    CREDIT_CARD_OWNER_NAME: string;
    chargeAmount: number;
  }): Promise<void> {
    const customer = await PaymentProcessingService.securionPayApi.customers.create({
      email: userEmail,
    });

    const card = await PaymentProcessingService.securionPayApi.cards.create(customer.id, {
      number: CREDIT_CARD_NUMBER,
      expMonth: CREDIT_CARD_EXPIRATION_MONTH,
      expYear: CREDIT_CARD_EXPIRATION_YEAR,
      cvc: CREDIT_CARD_VERIFICATION_CODE,
      cardholderName: CREDIT_CARD_OWNER_NAME,
    });

    const charge = await PaymentProcessingService.securionPayApi.charges.create({
      amount: chargeAmount,
      currency: "USD",
      card: card.id,
      customerId: customer.id,
    });
    console.log("ID of created charge object: ", charge.id);

    return;
  }
}
