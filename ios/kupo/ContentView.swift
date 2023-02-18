//
//  ContentView.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI
import CoreData
import OpenAPIClient

struct ContentView: View {


    var body: some View {
        ZStack {
            Color.black
                .ignoresSafeArea()
            
            VStack(alignment: .trailing) {
                
                Spacer()
                
                Divider()
                    .frame(height: 3)
                    .background(Color.white)

                NavigationPanel()
                    .frame(height: 100)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
