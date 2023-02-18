//
//  ContentItemHashtagsRow.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct ContentItemFooterHashtagsRow: View {
    let hashtags: [String]
    
    var body: some View {
        HStack {
            ForEach(hashtags, id: \.hashValue) { hashtag in
                Text("#\(hashtag)")
                    .foregroundColor(
                        Color.white
                    )
            }
            Spacer()
        }
    }
}

struct ContentItemFooterHashtagsRow_Previews: PreviewProvider {
    static var previews: some View {
        let hashtags = [
            "katebock",
            "taylors"
        ]
        
        ContentItemFooterHashtagsRow(hashtags: hashtags)
    }
}
