export enum GenericResponseFailedReason {
  BAD_REQUEST = "BAD_REQUEST",
  DATABASE_TRANSACTION_ERROR = "DATABASE_TRANSACTION_ERROR",
  PAYMENT_PROCESSOR_ERROR = "PAYMENT_PROCESSOR_ERROR",
  EMAIL_SERVICE_ERROR = "EMAIL_SERVICE_ERROR",
  BLOB_STORAGE_ERROR = "BLOB_STORAGE_ERROR",
  IMPROPER_USE_OF_FUNCTION = "IMPROPER_USE_OF_FUNCTION",
}

export interface UploadableKupoFile {
  blobSize: number;
  blobText: string;
  mimetype: string;
}

export interface BackendKupoFile {
  mimetype: string;
  buffer: Buffer;
}

export interface FiledMediaElement {
  blobFileKey: string;
  mimeType: string;
}

export interface MediaElement {
  temporaryUrl: string;
  mimeType: string;
}
