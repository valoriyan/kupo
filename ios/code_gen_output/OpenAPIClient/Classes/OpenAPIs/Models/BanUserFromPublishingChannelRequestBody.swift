//
// BanUserFromPublishingChannelRequestBody.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct BanUserFromPublishingChannelRequestBody: Codable, JSONEncodable, Hashable {

    public var publishingChannelId: String
    public var bannedUserId: String

    public init(publishingChannelId: String, bannedUserId: String) {
        self.publishingChannelId = publishingChannelId
        self.bannedUserId = bannedUserId
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case publishingChannelId
        case bannedUserId
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(publishingChannelId, forKey: .publishingChannelId)
        try container.encode(bannedUserId, forKey: .bannedUserId)
    }
}

