export interface HTTPResponse<ErrorType, SuccessType> {
    error?: ErrorType;
    success?: SuccessType;
}

