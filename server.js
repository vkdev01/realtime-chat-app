const express = require('express');

const http = require('http');

const socketio = require('socket.io');


const formatMessage =  require('./utils/messages');

const {
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers
} =  require('./utils/user');

const path = require('path');

const dotenv = require('dotenv');
const { Console } = require('console');
dotenv.config()

// import express from 'express'; // es module syntax

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const botName = 'ChatBot'

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// run when a client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcomes Current user, emits to single user that connecting
        socket.emit('message', formatMessage(botName, 'Welcome to This Chat Room'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${username} has joined the chat`)); // emits to everybody excepts the user thats connecting

        // send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    


    // Listen for chatMessage
    socket.on('chatMessage', (msg) =>{
        const currentUser = getCurrentUser(socket.id);

        io.to(currentUser.room).emit('message', formatMessage(currentUser.username, msg));
    });




    //Runs when client disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room)
                .emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

        // send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

});



const PORT = process.env.PORT || 3000;


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

