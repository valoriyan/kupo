import { singleton } from "tsyringe";
import { CreditCardSummary } from "../../controllers/publishedItem/shopItem/payments/models";
import { getEnvironmentVariable } from "../../utilities";
import { DBStoredCreditCardDatum } from "../databaseService/tableServices/storedCreditCardDataTableService";

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

  //////////////////////////////////////////////////
  // CUSTOMERS /////////////////////////////////////
  //////////////////////////////////////////////////

  async registerCustomer({ customerEmail }: { customerEmail: string }): Promise<string> {
    const customer = await PaymentProcessingService.securionPayApi.customers.create({
      email: customerEmail,
    });

    return customer.id;
  }

  async removeCustomer({
    paymentProcessorCustomerId,
  }: {
    paymentProcessorCustomerId: string;
  }): Promise<string> {
    const removedPaymentProcessorCustomerId =
      await PaymentProcessingService.securionPayApi.customers.delete(
        paymentProcessorCustomerId,
      );

    return removedPaymentProcessorCustomerId;
  }

  async updateCustomerEmail({
    paymentProcessorCustomerId,
    updatedEmail,
  }: {
    paymentProcessorCustomerId: string;
    updatedEmail: string;
  }): Promise<void> {
    await PaymentProcessingService.securionPayApi.customers.update(
      paymentProcessorCustomerId,
      {
        email: updatedEmail,
      },
    );
  }

  //////////////////////////////////////////////////
  // CARDS /////////////////////////////////////////
  //////////////////////////////////////////////////

  async storeCustomerCreditCard({
    paymentProcessorCustomerId,
    paymentProcessorCardToken,
    ipAddressOfRequestor,
  }: {
    paymentProcessorCustomerId: string;
    paymentProcessorCardToken: string;
    ipAddressOfRequestor: string;
  }): Promise<string> {
    const card = await PaymentProcessingService.securionPayApi.cards.create(
      paymentProcessorCustomerId,
      {
        id: paymentProcessorCardToken,
        fraudCheckData: {
          ipAddress: ipAddressOfRequestor,
        },
      },
    );

    return card.id;
  }

  async getCustomerCreditCardSummary({
    paymentProcessorCustomerId,
    dbCreditCardDatum,
  }: {
    paymentProcessorCustomerId: string;
    dbCreditCardDatum: DBStoredCreditCardDatum;
  }): Promise<CreditCardSummary> {
    const cardDetails = await PaymentProcessingService.securionPayApi.cards.get(
      paymentProcessorCustomerId,
      dbCreditCardDatum.payment_processor_card_id,
    );
    return {
      localCreditCardId: dbCreditCardDatum.local_credit_card_id,
      userId: dbCreditCardDatum.user_id,
      isPrimaryCard: dbCreditCardDatum.is_primary_card,
      creationTimestamp: parseInt(dbCreditCardDatum.creation_timestamp),
      last4: cardDetails.last4,
      expMonth: cardDetails.expMonth,
      expYear: cardDetails.expYear,
      cardholderName: cardDetails.cardholderName,
      brand: cardDetails.brand,
    };
  }

  async removeCustomerCreditCard({
    paymentProcessorCustomerId,
    paymentProcessorCardId,
  }: {
    paymentProcessorCustomerId: string;
    paymentProcessorCardId: string;
  }): Promise<string> {
    const deletedPaymentProcessorCardId =
      await PaymentProcessingService.securionPayApi.cards.delete(
        paymentProcessorCustomerId,
        paymentProcessorCardId,
      );

    return deletedPaymentProcessorCardId;
  }

  //////////////////////////////////////////////////
  // TRANSACTIONS //////////////////////////////////
  //////////////////////////////////////////////////

  async chargeCustomerWithCachedCreditCard({
    paymentProcessingCustomerId,
    paymentProcessingCreditCardId,
    chargeAmount,
  }: {
    paymentProcessingCustomerId: string;
    paymentProcessingCreditCardId: string;
    chargeAmount: number;
  }): Promise<string> {
    // TODO: ADD SOME CHECKS TO DOUBLY CONFIRM USER BEING CHARGED
    const charge = await PaymentProcessingService.securionPayApi.charges.create({
      amount: chargeAmount,
      currency: "USD",
      card: paymentProcessingCreditCardId,
      customerId: paymentProcessingCustomerId,
    });

    return charge.id;
  }
}
