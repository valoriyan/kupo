//
// GetPageOfChatRoomsSuccess.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct GetPageOfChatRoomsSuccess: Codable, JSONEncodable, Hashable {

    public var chatRooms: [RenderableChatRoomWithJoinedUsers]
    public var previousPageCursor: String?
    public var nextPageCursor: String?

    public init(chatRooms: [RenderableChatRoomWithJoinedUsers], previousPageCursor: String? = nil, nextPageCursor: String? = nil) {
        self.chatRooms = chatRooms
        self.previousPageCursor = previousPageCursor
        self.nextPageCursor = nextPageCursor
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case chatRooms
        case previousPageCursor
        case nextPageCursor
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(chatRooms, forKey: .chatRooms)
        try container.encodeIfPresent(previousPageCursor, forKey: .previousPageCursor)
        try container.encodeIfPresent(nextPageCursor, forKey: .nextPageCursor)
    }
}

