//
// DoesChatRoomExistWithUserIdsSuccess.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct DoesChatRoomExistWithUserIdsSuccess: Codable, JSONEncodable, Hashable {

    public var doesChatRoomExist: Bool
    public var chatRoomId: String?

    public init(doesChatRoomExist: Bool, chatRoomId: String? = nil) {
        self.doesChatRoomExist = doesChatRoomExist
        self.chatRoomId = chatRoomId
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case doesChatRoomExist
        case chatRoomId
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(doesChatRoomExist, forKey: .doesChatRoomExist)
        try container.encodeIfPresent(chatRoomId, forKey: .chatRoomId)
    }
}

