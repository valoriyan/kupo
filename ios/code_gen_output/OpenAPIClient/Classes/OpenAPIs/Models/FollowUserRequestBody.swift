//
// FollowUserRequestBody.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct FollowUserRequestBody: Codable, JSONEncodable, Hashable {

    public var userIdBeingFollowed: String

    public init(userIdBeingFollowed: String) {
        self.userIdBeingFollowed = userIdBeingFollowed
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case userIdBeingFollowed
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(userIdBeingFollowed, forKey: .userIdBeingFollowed)
    }
}

