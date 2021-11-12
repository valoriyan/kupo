import { Server } from "socket.io";
import {Server as httpServer } from "http";

export class WebSocketService {
    private io: Server;

    constructor(httpServer: httpServer) {
        const io = new Server(
            httpServer,
            {
                cors: {
                    origin: "http://localhost:3000",
                  }                
            }
            );

        this.io = io;

        io.on('connection', (socket) => {

            socket.join("user:128223123");

            socket.on('chat message', (msg) => {
                io.emit('chat message', msg);

                socket.join("bob's room");
                
                io.in("bob's room").in("bob's room").emit("woah");

                // sent to everyone except the socket
                socket.to("bob's room").emit("woah");
            
                socket.id;
              });
            
        });          
    }

    sendData({userId}: {userId: string;}) {
        this.io.in(`user:${userId}`).emit("bla bla", (acknowledgementOne: string, acknowledgementTwo: string) => {
            console.log(acknowledgementOne, acknowledgementTwo);
        });
    }

    handleChatMessage() {
        this.io.on("chat-message", (messageText: string, sendAcknowledgement) => {
            sendAcknowledgement({customREsponseCode: 123}, "okayy");
        })
    }
}