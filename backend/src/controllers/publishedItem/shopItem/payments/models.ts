import { RootPurchasedShopItemDetails } from "../models";

export interface CreditCardSummary {
  localCreditCardId: string;
  userId: string;
  isPrimaryCard: boolean;
  creationTimestamp: number;
  last4: string;
  expMonth: string;
  expYear: string;
  cardholderName: string;
  brand: string;
}

export interface RenderableShopItemPurchaseSummary {
  transactionId: string;
  transactionTimestamp: number;

  purchasedShopItem: RootPurchasedShopItemDetails;
}
