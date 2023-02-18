//
//  kupoApp.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/11/23.
//

import SwiftUI

@main
struct kupoApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}

struct Previews_kupoApp_Previews: PreviewProvider {
    static var previews: some View {
        /*@START_MENU_TOKEN@*/Text("Hello, World!")/*@END_MENU_TOKEN@*/
    }
}
