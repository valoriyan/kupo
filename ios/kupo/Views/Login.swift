//
//  Login.swift
//  kupo
//
//  Created by Julian Theoderik Trajanson on 2/12/23.
//

import SwiftUI
import OpenAPIClient

struct Login: View {
    @State private var email: String = ""
    @State private var password: String = ""
    
    @State var tempText = "Yo ho"
    
    
    var body: some View {
        
        ZStack {
            Color.black

//            Color.black
//                .ignoresSafeArea()

            VStack {
                Text(tempText)
                    .foregroundColor(.white)
                
                TextInput(
                    value: $email,
                    keyName: "email",
                    placeholder: "enter email",
                    label: "email:",
                    keyboardType: .emailAddress
                )

                TextInput(
                    value: $password,
                    keyName: "password",
                    placeholder: "enter password",
                    label: "password:",
                    keyboardType: .default
                )
                
                
                Button("Log In") {
                    OpenAPIClientAPI.basePath = "http://localhost:4000"
                    
                    let loginUserRequestBody = LoginUserRequestBody(email: email.lowercased(), password: password)
                    
                    DefaultAPI.loginUser(loginUserRequestBody: loginUserRequestBody) {(response,error) in
                        
                        guard error == nil else {
                            tempText = error.debugDescription
//                            print(error)
                            return
                        }


                        guard let response else {
                            tempText = "Missing response"
                            return
                        }
                        
//                        guard response.error == nil else {
//                            tempText = response.error.errorMessage ?? "Missing Error Message"
//                            return
//                        }
                        
                        tempText = response.success.accessToken
                        
                    }

                                        
                }

                
            }

        }
        
    }
}

struct Login_Previews: PreviewProvider {
    static var previews: some View {
        Login()
    }
}
