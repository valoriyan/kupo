//
//  TextInput.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/12/23.
//

import SwiftUI

struct TextInput: View {
    @Binding var value: String
    
    let keyName: String
    let placeholder: String
    let label: String
    let keyboardType: UIKeyboardType
    
    let editingChanged: (Bool)->() = { _ in }
    let commit: ()->() = { }


    
    var body: some View {
        ZStack {
            Color.black

            VStack {
                HStack {
                    Text(label)
                        .foregroundColor(Color.purple)
                    Spacer()
                }

                ZStack {
                    if value.isEmpty { Text(placeholder) }
                    
                    TextField(
                        keyName,
                        text: $value,
                        onEditingChanged: editingChanged,
                        onCommit: commit
                    )
                    .keyboardType(keyboardType)
                    .multilineTextAlignment(.leading)
                }
                .foregroundColor(Color.purple)
                .cornerRadius(10)
                .padding(.all, 20)
                .font(.system(size: 20, weight: .heavy, design: .default))
                .accentColor(.green)
                
                
            }
            

        }
        .frame(height: 100)


                
    }
}

struct TextInput_Previews: PreviewProvider {
    struct PreviewWrapper: View {
        @State var value = ""
        
        var body: some View {
            
            TextInput(
                value: $value,
                keyName: "email",
                placeholder: "email",
                label: "email",
                keyboardType: .emailAddress
            )
        }
    }
    
    
    static var previews: some View {
        PreviewWrapper()
    }
}
