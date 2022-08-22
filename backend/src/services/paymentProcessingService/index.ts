/* eslint-disable @typescript-eslint/ban-types */
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { singleton } from "tsyringe";
import { CreditCardSummary } from "../../controllers/publishedItem/shopItem/payments/models";
import { getEnvironmentVariable } from "../../utilities";
import { DBStoredCreditCardDatum } from "../databaseService/tableServices/storedCreditCardDataTableService";
import { GenericResponseFailedReason } from "../../controllers/models";
import { Controller } from "tsoa";

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
    controller,
    customerEmail,
  }: {
    controller: Controller;
    customerEmail: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>> {
    try {
      const customer = await PaymentProcessingService.securionPayApi.customers.create({
        email: customerEmail,
      });

      return Success(customer.id);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at registerCustomer",
      });
    }
  }

  async removeCustomer({
    controller,
    paymentProcessorCustomerId,
  }: {
    controller: Controller;
    paymentProcessorCustomerId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>> {
    try {
      const removedPaymentProcessorCustomerId =
        await PaymentProcessingService.securionPayApi.customers.delete(
          paymentProcessorCustomerId,
        );

      return Success(removedPaymentProcessorCustomerId);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at removeCustomer",
      });
    }
  }

  async updateCustomerEmail({
    controller,
    paymentProcessorCustomerId,
    updatedEmail,
  }: {
    controller: Controller;
    paymentProcessorCustomerId: string;
    updatedEmail: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      await PaymentProcessingService.securionPayApi.customers.update(
        paymentProcessorCustomerId,
        {
          email: updatedEmail,
        },
      );
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at updateCustomerEmail",
      });
    }
  }

  //////////////////////////////////////////////////
  // CARDS /////////////////////////////////////////
  //////////////////////////////////////////////////

  async storeCustomerCreditCard({
    controller,
    paymentProcessorCustomerId,
    paymentProcessorCardToken,
    ipAddressOfRequestor,
  }: {
    controller: Controller;
    paymentProcessorCustomerId: string;
    paymentProcessorCardToken: string;
    ipAddressOfRequestor: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>> {
    try {
      const card = await PaymentProcessingService.securionPayApi.cards.create(
        paymentProcessorCustomerId,
        {
          id: paymentProcessorCardToken,
          fraudCheckData: {
            ipAddress: ipAddressOfRequestor,
          },
        },
      );

      return Success(card.id);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at storeCustomerCreditCard",
      });
    }
  }

  async getCustomerCreditCardSummary({
    controller,
    paymentProcessorCustomerId,
    dbCreditCardDatum,
  }: {
    controller: Controller;
    paymentProcessorCustomerId: string;
    dbCreditCardDatum: DBStoredCreditCardDatum;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, CreditCardSummary>> {
    try {
      const cardDetails = await PaymentProcessingService.securionPayApi.cards.get(
        paymentProcessorCustomerId,
        dbCreditCardDatum.payment_processor_card_id,
      );
      return Success({
        localCreditCardId: dbCreditCardDatum.local_credit_card_id,
        userId: dbCreditCardDatum.user_id,
        isPrimaryCard: dbCreditCardDatum.is_primary_card,
        creationTimestamp: parseInt(dbCreditCardDatum.creation_timestamp),
        last4: cardDetails.last4,
        expMonth: cardDetails.expMonth,
        expYear: cardDetails.expYear,
        cardholderName: cardDetails.cardholderName,
        brand: cardDetails.brand,
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at getCustomerCreditCardSummary",
      });
    }
  }

  async removeCustomerCreditCard({
    controller,
    paymentProcessorCustomerId,
    paymentProcessorCardId,
  }: {
    controller: Controller;
    paymentProcessorCustomerId: string;
    paymentProcessorCardId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>> {
    try {
      const deletedPaymentProcessorCardId =
        await PaymentProcessingService.securionPayApi.cards.delete(
          paymentProcessorCustomerId,
          paymentProcessorCardId,
        );

      return Success(deletedPaymentProcessorCardId);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at removeCustomerCreditCard",
      });
    }
  }

  //////////////////////////////////////////////////
  // TRANSACTIONS //////////////////////////////////
  //////////////////////////////////////////////////

  async chargeCustomerWithCachedCreditCard({
    controller,
    paymentProcessingCustomerId,
    paymentProcessingCreditCardId,
    chargeAmount,
  }: {
    controller: Controller;
    paymentProcessingCustomerId: string;
    paymentProcessingCreditCardId: string;
    chargeAmount: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>> {
    try {
      // TODO: ADD SOME CHECKS TO DOUBLY CONFIRM USER BEING CHARGED
      const charge = await PaymentProcessingService.securionPayApi.charges.create({
        amount: chargeAmount,
        currency: "USD",
        card: paymentProcessingCreditCardId,
        customerId: paymentProcessingCustomerId,
      });

      return Success(charge.id);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.PAYMENT_PROCESSOR_ERROR,
        error,
        additionalErrorInformation: "Error at chargeCustomerWithCachedCreditCard",
      });
    }
  }
}
