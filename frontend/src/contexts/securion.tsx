import create from "zustand";

export interface Securion {
  createComponent: (type: "card", options?: object) => Component;
  createComponentGroup: () => ComponentGroup;
  createToken: (
    component: Component | ComponentGroup,
    data?: {
      cardholderName?: string;
      addressLine1?: string;
      addressLine2?: string;
      addressCity?: string;
      addressState?: string;
      addressZip?: string;
      addressCountry?: string;
    },
  ) => Promise<PaymentToken>;
}

export interface Component {
  mount: (selector: string | Element) => Component;
  clear: () => Component;
}

export interface ComponentGroup {
  automount: (selector: string | Element) => ComponentGroup;
  createComponent: (
    type: "number" | "expiry" | "cvc" | "expiryMonth" | "expiryYear",
    options?: object,
  ) => Component;
}

export interface PaymentToken {
  id: string;
  created: number;
  objectType: "token";
  first6: number;
  last4: number;
  fingerprint: string;
  expMonth: number;
  expYear: number;
  brand:
    | "Visa"
    | "American Express"
    | "MasterCard"
    | "Discover"
    | "JCB"
    | "Diners Club"
    | "Unknown";
  type: "Credit Card" | "Debit Card" | "Unknown";
  used: boolean;
  cardholderName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  addressCountry?: string;
}

export interface SecurionStore {
  securion: Securion | undefined;
  setSecurion: (securion: Securion) => void;
}

export const useSecurion = create<SecurionStore>((set) => ({
  securion: undefined,
  setSecurion: (securion) => set({ securion }),
}));
