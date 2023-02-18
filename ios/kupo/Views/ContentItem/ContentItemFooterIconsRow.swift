//
//  ContentItemFooterIconsRow.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct ContentItemFooterIconsRow: View {
    var body: some View {
        HStack {
            Image(
                systemName: "heart"
            )
                .foregroundColor(
                    Color.white
                )

            Text("1")
            Spacer()
            
            Image(
                systemName: "bubble.left.fill"
            )
                .foregroundColor(
                    Color.white
                )

            Text("1")
            Spacer()

            Image(
                systemName: "paperplane"
            )
            .foregroundColor(
                Color.white
            )

            Spacer()
            
            Image(
                systemName: "bookmark"
            )
            .foregroundColor(
                Color.white
            )

        }
        
    }
}

struct ContentItemFooterIconsRow_Previews: PreviewProvider {
    static var previews: some View {
        ContentItemFooterIconsRow()
    }
}
