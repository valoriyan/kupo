//
// EitherErrorReasonTypesStringOrUploadFileFailedReasonUploadFileSuccess.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct EitherErrorReasonTypesStringOrUploadFileFailedReasonUploadFileSuccess: Codable, JSONEncodable, Hashable {

    public var type: EitherTypeSuccess
    public var error: FailureResponseErrorReasonTypesStringOrUploadFileFailedReasonError
    public var success: UploadFileSuccess

    public init(type: EitherTypeSuccess, error: FailureResponseErrorReasonTypesStringOrUploadFileFailedReasonError, success: UploadFileSuccess) {
        self.type = type
        self.error = error
        self.success = success
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case type
        case error
        case success
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(error, forKey: .error)
        try container.encode(success, forKey: .success)
    }
}

