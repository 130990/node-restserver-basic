const { Socket } = require("socket.io"); //<====DELETE FOR PROD
const { checkJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

const socketController = async (socket=  new Socket(), io) =>{ //<=REMOVE INSTANCE FOR PROD
    const user = await checkJWT(socket.handshake.headers['x-token']);

    if(!user){
        return socket.disconnect();
    }

    //Connect user
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);
    io.emit('receive-messages', chatMessages.lastTen);

    //Connect to a private chat by userId
    socket.join(user.id);
    
    //Clean user list when it's disconnected
    socket.on('disconnect',()=>{
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({message, uid})=>{
        console.log({message, uid})
        if(uid){
            //message for private chat
            socket.to(uid).emit('private-message',{from: user.name, message});
        }
        else{
            //message for global chat
            chatMessages.sendMessage(user.id, message, user.name);
            io.emit('receive-messages', chatMessages.lastTen);
        }
    });
}

module.exports ={
    socketController
}