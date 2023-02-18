//
// UpdateUserProfilePictureRequestBody.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct UpdateUserProfilePictureRequestBody: Codable, JSONEncodable, Hashable {

    public var profilePicture: FileDescriptor

    public init(profilePicture: FileDescriptor) {
        self.profilePicture = profilePicture
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case profilePicture
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(profilePicture, forKey: .profilePicture)
    }
}

