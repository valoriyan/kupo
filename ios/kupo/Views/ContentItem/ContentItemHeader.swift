//
//  ContentItemHeader.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct ContentItemHeader: View {
    let username: String

    
    var body: some View {
        HStack {
            Text("@\(username)")
                .foregroundColor(
                    Color.purple
                )
            
            
            Spacer()
            Spacer()
            Spacer()
            
            Text("last week")
                .foregroundColor(
                    Color.white
                )

            Spacer()

            
            Image(systemName: "lightbulb")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(
                    width: 20,
                    height: 20
                )
                .foregroundColor(Color(.white))

            
        }
        
    }
}

struct ContentItemHeader_Previews: PreviewProvider {
    static var previews: some View {
        ContentItemHeader(
            username: "theoderik"
        )
    }
}
