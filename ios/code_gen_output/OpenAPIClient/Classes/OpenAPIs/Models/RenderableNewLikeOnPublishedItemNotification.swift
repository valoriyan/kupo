//
// RenderableNewLikeOnPublishedItemNotification.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct RenderableNewLikeOnPublishedItemNotification: Codable, JSONEncodable, Hashable {

    public var type: NOTIFICATIONEVENTSNEWLIKEONPUBLISHEDITEM
    public var countOfUnreadNotifications: Double
    public var eventTimestamp: Double
    public var timestampSeenByUser: Double?
    public var userThatLikedPublishedItem: RenderableUser
    public var publishedItem: RenderablePublishedItem

    public init(type: NOTIFICATIONEVENTSNEWLIKEONPUBLISHEDITEM, countOfUnreadNotifications: Double, eventTimestamp: Double, timestampSeenByUser: Double? = nil, userThatLikedPublishedItem: RenderableUser, publishedItem: RenderablePublishedItem) {
        self.type = type
        self.countOfUnreadNotifications = countOfUnreadNotifications
        self.eventTimestamp = eventTimestamp
        self.timestampSeenByUser = timestampSeenByUser
        self.userThatLikedPublishedItem = userThatLikedPublishedItem
        self.publishedItem = publishedItem
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case type
        case countOfUnreadNotifications
        case eventTimestamp
        case timestampSeenByUser
        case userThatLikedPublishedItem
        case publishedItem
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(countOfUnreadNotifications, forKey: .countOfUnreadNotifications)
        try container.encode(eventTimestamp, forKey: .eventTimestamp)
        try container.encodeIfPresent(timestampSeenByUser, forKey: .timestampSeenByUser)
        try container.encode(userThatLikedPublishedItem, forKey: .userThatLikedPublishedItem)
        try container.encode(publishedItem, forKey: .publishedItem)
    }
}

