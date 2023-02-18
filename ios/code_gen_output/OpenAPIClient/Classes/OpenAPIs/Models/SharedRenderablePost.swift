//
// SharedRenderablePost.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct SharedRenderablePost: Codable, JSONEncodable, Hashable {

    public var type: PublishedItemTypePOST
    public var id: String
    public var authorUserId: String
    public var caption: String
    public var creationTimestamp: Double
    public var scheduledPublicationTimestamp: Double
    public var expirationTimestamp: Double?
    public var idOfPublishedItemBeingShared: String?
    public var host: PublishedItemHost
    public var hashtags: [String]
    public var likes: RenderableUserFollowers
    public var comments: RenderableUserFollowers
    public var isLikedByClient: Bool
    public var isSavedByClient: Bool
    public var sharedItem: RootRenderablePost

    public init(type: PublishedItemTypePOST, id: String, authorUserId: String, caption: String, creationTimestamp: Double, scheduledPublicationTimestamp: Double, expirationTimestamp: Double? = nil, idOfPublishedItemBeingShared: String? = nil, host: PublishedItemHost, hashtags: [String], likes: RenderableUserFollowers, comments: RenderableUserFollowers, isLikedByClient: Bool, isSavedByClient: Bool, sharedItem: RootRenderablePost) {
        self.type = type
        self.id = id
        self.authorUserId = authorUserId
        self.caption = caption
        self.creationTimestamp = creationTimestamp
        self.scheduledPublicationTimestamp = scheduledPublicationTimestamp
        self.expirationTimestamp = expirationTimestamp
        self.idOfPublishedItemBeingShared = idOfPublishedItemBeingShared
        self.host = host
        self.hashtags = hashtags
        self.likes = likes
        self.comments = comments
        self.isLikedByClient = isLikedByClient
        self.isSavedByClient = isSavedByClient
        self.sharedItem = sharedItem
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case type
        case id
        case authorUserId
        case caption
        case creationTimestamp
        case scheduledPublicationTimestamp
        case expirationTimestamp
        case idOfPublishedItemBeingShared
        case host
        case hashtags
        case likes
        case comments
        case isLikedByClient
        case isSavedByClient
        case sharedItem
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(id, forKey: .id)
        try container.encode(authorUserId, forKey: .authorUserId)
        try container.encode(caption, forKey: .caption)
        try container.encode(creationTimestamp, forKey: .creationTimestamp)
        try container.encode(scheduledPublicationTimestamp, forKey: .scheduledPublicationTimestamp)
        try container.encodeIfPresent(expirationTimestamp, forKey: .expirationTimestamp)
        try container.encodeIfPresent(idOfPublishedItemBeingShared, forKey: .idOfPublishedItemBeingShared)
        try container.encode(host, forKey: .host)
        try container.encode(hashtags, forKey: .hashtags)
        try container.encode(likes, forKey: .likes)
        try container.encode(comments, forKey: .comments)
        try container.encode(isLikedByClient, forKey: .isLikedByClient)
        try container.encode(isSavedByClient, forKey: .isSavedByClient)
        try container.encode(sharedItem, forKey: .sharedItem)
    }
}

