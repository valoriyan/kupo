//
// RevokeFollowerRequestBody.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct RevokeFollowerRequestBody: Codable, JSONEncodable, Hashable {

    public var revokedUserId: String

    public init(revokedUserId: String) {
        self.revokedUserId = revokedUserId
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case revokedUserId
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(revokedUserId, forKey: .revokedUserId)
    }
}

