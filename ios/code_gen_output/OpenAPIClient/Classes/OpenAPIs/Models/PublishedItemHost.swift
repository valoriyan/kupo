//
// PublishedItemHost.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct PublishedItemHost: Codable, JSONEncodable, Hashable {

    public var publishingChannelId: String
    public var name: String

    public init(publishingChannelId: String, name: String) {
        self.publishingChannelId = publishingChannelId
        self.name = name
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case publishingChannelId
        case name
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(publishingChannelId, forKey: .publishingChannelId)
        try container.encode(name, forKey: .name)
    }
}

