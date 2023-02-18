//
// FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonError.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonError: Codable, JSONEncodable, Hashable {

    public var additionalErrorInformation: String?
    public var errorMessage: String?
    public var reason: FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonErrorReason

    public init(additionalErrorInformation: String? = nil, errorMessage: String? = nil, reason: FailureResponseErrorReasonTypesStringOrCreatePublishingChannelFailedReasonErrorReason) {
        self.additionalErrorInformation = additionalErrorInformation
        self.errorMessage = errorMessage
        self.reason = reason
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case additionalErrorInformation
        case errorMessage
        case reason
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(additionalErrorInformation, forKey: .additionalErrorInformation)
        try container.encodeIfPresent(errorMessage, forKey: .errorMessage)
        try container.encode(reason, forKey: .reason)
    }
}

