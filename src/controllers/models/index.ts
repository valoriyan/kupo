export enum GenericResponseFailedReason {
  DATABASE_TRANSACTION_ERROR = "DATABASE_TRANSACTION_ERROR",
}

export interface FiledMediaElement {
  blobFileKey: string;
  mimeType: string;
}

export interface MediaElement {
  temporaryUrl: string;
  mimeType: string;
}
