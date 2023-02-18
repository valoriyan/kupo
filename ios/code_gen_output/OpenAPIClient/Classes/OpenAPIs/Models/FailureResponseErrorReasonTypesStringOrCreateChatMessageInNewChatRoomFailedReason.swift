//
// FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason: Codable, JSONEncodable, Hashable {

    public var type: EitherTypeFailure
    public var error: FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError

    public init(type: EitherTypeFailure, error: FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError) {
        self.type = type
        self.error = error
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case type
        case error
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(error, forKey: .error)
    }
}

