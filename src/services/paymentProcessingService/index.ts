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

  //////////////////////////////////////////////////
  // CUSTOMERS /////////////////////////////////////
  //////////////////////////////////////////////////

  async registerCustomer({
    customerEmail,
  }: {
    customerEmail: string,
  }): Promise<string> {
    const customer = await PaymentProcessingService.securionPayApi.customers.create({
      email: customerEmail,
    });

    return customer.id;
  };

  async removeCustomer({
    paymentProcessorCustomerId,
  }: {
    paymentProcessorCustomerId: string,
  }): Promise<string> {
    const removedPaymentProcessorCustomerId = await PaymentProcessingService.securionPayApi.customers.delete(paymentProcessorCustomerId);

    return removedPaymentProcessorCustomerId;
  };

  async updateCustomerEmail({
    paymentProcessorCustomerId,
    updatedEmail,
  }: {
    paymentProcessorCustomerId: string,
    updatedEmail: string,
  }): Promise<void> {
    await PaymentProcessingService.securionPayApi.customers.update(paymentProcessorCustomerId, {
      email: updatedEmail,
    });
  };

  //////////////////////////////////////////////////
  // CARDS /////////////////////////////////////////
  //////////////////////////////////////////////////


  async storeCustomerCreditCard({
    paymentProcessorCustomerId,
    CREDIT_CARD_NUMBER,
    CREDIT_CARD_EXPIRATION_MONTH,
    CREDIT_CARD_EXPIRATION_YEAR,
    CREDIT_CARD_VERIFICATION_CODE,
    CREDIT_CARD_OWNER_NAME,
    ipAddressOfRequestor,
  }: {
    paymentProcessorCustomerId: string;
    CREDIT_CARD_NUMBER: string;
    CREDIT_CARD_EXPIRATION_MONTH: string;
    CREDIT_CARD_EXPIRATION_YEAR: string;
    CREDIT_CARD_VERIFICATION_CODE: string;
    CREDIT_CARD_OWNER_NAME: string;    
    ipAddressOfRequestor: string;    
  }): Promise<string> {
    const card = await PaymentProcessingService.securionPayApi.cards.create(
      paymentProcessorCustomerId,
      {
        number: CREDIT_CARD_NUMBER,
        expMonth: CREDIT_CARD_EXPIRATION_MONTH,
        expYear: CREDIT_CARD_EXPIRATION_YEAR,
        cvc: CREDIT_CARD_VERIFICATION_CODE,
        cardholderName: CREDIT_CARD_OWNER_NAME,
        fraudCheckData: {
          ipAddress: ipAddressOfRequestor,
        }
    });

    return card.id;
  }

  async removeCustomerCreditCard({
    paymentProcessorCustomerId,
    paymentProcessorCardId,
  }: {
    paymentProcessorCustomerId: string;
    paymentProcessorCardId: string;
  }): Promise<string> {
    const deletedPaymentProcessorCardId = await PaymentProcessingService.securionPayApi.cards.delete(
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
