//
// StoreCreditCardRequestBody.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct StoreCreditCardRequestBody: Codable, JSONEncodable, Hashable {

    public var paymentProcessorCardToken: String

    public init(paymentProcessorCardToken: String) {
        self.paymentProcessorCardToken = paymentProcessorCardToken
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case paymentProcessorCardToken
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(paymentProcessorCardToken, forKey: .paymentProcessorCardToken)
    }
}

