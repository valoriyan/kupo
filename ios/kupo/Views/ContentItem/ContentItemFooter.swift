//
//  ContentItemFooter.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct ContentItemFooter: View {
    let hashtags: [String]
    
    var body: some View {
        VStack {
            ContentItemFooterHashtagsRow(
                hashtags: hashtags
            )
            
            ContentItemFooterIconsRow()
        }
    }
}

struct ContentItemFooter_Previews: PreviewProvider {
    static var previews: some View {
        
        let hashtags = [
            "katebock",
            "taylors"
        ]

        ContentItemFooter(
            hashtags: hashtags
        )
    }
}
