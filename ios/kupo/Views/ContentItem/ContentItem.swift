//
//  ContentItem.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct ContentItem: View {
    let username: String
    let imageUrl: String
    
    let hashtags: [String]
    
    var body: some View {
        ZStack {
            Color.black
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                ContentItemHeader(
                    username: username)
                
                ContentItemImage(
                    imageUrl: imageUrl
                )
                
                ContentItemFooter(
                    hashtags: hashtags
                )
            }
        }
    }
}

struct ContentItem_Previews: PreviewProvider {
    static var previews: some View {
        let username = "theoderik"
        
        let imageUrl = "https://imgs.search.brave.com/2pzNmwfpCnY-gPdbBBhRQ_IrsJ1UWAZufYNXZGznol0/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/aGF3dGNlbGVicy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTcvMTIva2F0ZS1i/b2NrLWF0LXNwb3J0/cy1pbGx1c3RyYXRl/ZC1zd2ltc3VpdC1p/c2xhbmQtYXQtdy1o/b3RlbC1pbi1taWFt/aS0xMi0wNy0yMDE3/LTAuanBn"
        
        let hashtags = [
            "katebock",
            "taylors"
        ]

        
        ContentItem(
            username: username,
            imageUrl: imageUrl,
            hashtags: hashtags
        )
    }
}
