//
//  NavigationPanel.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct NavigationPanel: View {
    var body: some View {
//        https://github.com/andrewtavis/sf-symbols-online
        
        
        let profilePictureUrl = "https://s3.us-east-1.wasabisys.com/kupo-prod/25cb2538-90a6-4078-8394-560d9a76466c.jpeg"

        ZStack {
            Color.black
                .ignoresSafeArea()

            HStack {
                Image(systemName: "house")

                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .clipShape(Circle())
                    .frame(
                        width: 60,
                        height: 60
                    )
                    .foregroundColor(Color(.white))
                
                
                Spacer()

                Image(systemName: "bell")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .clipShape(Circle())
                    .frame(
                        width: 60,
                        height: 60
                    )
                    .foregroundColor(Color(.white))

                Spacer()

                Image(systemName: "plus")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .clipShape(Circle())
                    .frame(
                        width: 60,
                        height: 60
                    )
                    .foregroundColor(Color(.white))

                
                
                Spacer()

                Image(systemName: "envelope")
                    .resizable()
                    .frame(
                        width: 60,
                        height: 60
                    )
                    .foregroundColor(Color(.white))

                
                Spacer()
                
                UserPortrait(imageUrl: profilePictureUrl)
                
            }
        }
    }
}

struct NavigationPanel_Previews: PreviewProvider {
    static var previews: some View {
        NavigationPanel()
    }
}
