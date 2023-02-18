//
//  ContentItemImage.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

struct ContentItemImage: View {
    let imageUrl: String
    
    let height: CGFloat = 300
    let width: CGFloat = 300
    
    var body: some View {
        let url = URL(string: self.imageUrl)

        ZStack {
            
            Color.black
                .ignoresSafeArea()

            
            AsyncImage(url: url) { phase in
                
                if let image = phase.image {
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .clipShape(Rectangle())
                        .frame(
                            width: self.width,
                            height: self.height
                        )


                }
                //            else if phase.error != nil {
                //                Text("No image available")
                //            }
                else {
                    //appears as placeholder image
                    Image(systemName: "person.fill") // 4
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .clipShape(Rectangle())
                        .foregroundColor(Color(.white))
                    
                }
                
            }

        }
        .frame(
            width: self.width,
            height: self.height
        )

    }
}

struct ContentItemImage_Previews: PreviewProvider {
    static var previews: some View {
        let imageUrl = "https://imgs.search.brave.com/2pzNmwfpCnY-gPdbBBhRQ_IrsJ1UWAZufYNXZGznol0/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/aGF3dGNlbGVicy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTcvMTIva2F0ZS1i/b2NrLWF0LXNwb3J0/cy1pbGx1c3RyYXRl/ZC1zd2ltc3VpdC1p/c2xhbmQtYXQtdy1o/b3RlbC1pbi1taWFt/aS0xMi0wNy0yMDE3/LTAuanBn"
        
        ContentItemImage(imageUrl: imageUrl)
    }
}
