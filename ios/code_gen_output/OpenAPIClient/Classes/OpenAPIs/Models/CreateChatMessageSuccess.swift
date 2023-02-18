//
// CreateChatMessageSuccess.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct CreateChatMessageSuccess: Codable, JSONEncodable, Hashable {

    public var chatMessage: RenderableChatMessage

    public init(chatMessage: RenderableChatMessage) {
        self.chatMessage = chatMessage
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case chatMessage
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(chatMessage, forKey: .chatMessage)
    }
}

