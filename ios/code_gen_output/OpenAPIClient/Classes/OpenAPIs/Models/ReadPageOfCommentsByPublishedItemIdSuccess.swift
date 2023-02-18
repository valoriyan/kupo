//
// ReadPageOfCommentsByPublishedItemIdSuccess.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct ReadPageOfCommentsByPublishedItemIdSuccess: Codable, JSONEncodable, Hashable {

    public var postComments: [RenderablePublishedItemComment]
    public var previousPageCursor: String?
    public var nextPageCursor: String?

    public init(postComments: [RenderablePublishedItemComment], previousPageCursor: String? = nil, nextPageCursor: String? = nil) {
        self.postComments = postComments
        self.previousPageCursor = previousPageCursor
        self.nextPageCursor = nextPageCursor
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case postComments
        case previousPageCursor
        case nextPageCursor
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(postComments, forKey: .postComments)
        try container.encodeIfPresent(previousPageCursor, forKey: .previousPageCursor)
        try container.encodeIfPresent(nextPageCursor, forKey: .nextPageCursor)
    }
}

