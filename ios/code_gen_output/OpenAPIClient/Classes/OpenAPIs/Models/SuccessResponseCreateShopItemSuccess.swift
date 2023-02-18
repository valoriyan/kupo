//
// SuccessResponseCreateShopItemSuccess.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct SuccessResponseCreateShopItemSuccess: Codable, JSONEncodable, Hashable {

    public var type: EitherTypeSuccess
    public var success: CreateShopItemSuccess

    public init(type: EitherTypeSuccess, success: CreateShopItemSuccess) {
        self.type = type
        self.success = success
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case type
        case success
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(success, forKey: .success)
    }
}

