//
//  UserPortrait.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct UserPortrait: View {
    let imageUrl: String
    
    var body: some View {
        let url = URL(string: self.imageUrl)
        
        AsyncImage(url: url) { phase in
            
            if let image = phase.image {
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .clipShape(Circle())
                    .frame(
                        width: 60,
                        height: 60
                    )
            }
//            else if phase.error != nil {
//                Text("No image available")
//            }
            else {
                //appears as placeholder image
                Image(systemName: "person.fill") // 4
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .clipShape(Circle())
                    .frame(
                        width: 60,
                        height: 60
                    )
                    .foregroundColor(Color(.white))

            }
            
        }
    }
}

struct UserPortrait_Previews: PreviewProvider {
    static var previews: some View {
        let profilePictureUrl = "https://s3.us-east-1.wasabisys.com/kupo-prod/25cb2538-90a6-4078-8394-560d9a76466c.jpeg"

        
        UserPortrait(imageUrl: profilePictureUrl)
    }
}
