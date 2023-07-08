const express = require('express');

const http = require('http');

const socketio = require('socket.io');


const formatMessage =  require('./utils/messages');

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

    // Welcomes Current user
    // emits to single user that connecting
    socket.emit('message', formatMessage(botName, 'Welcome to This Chat Room'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A new user has joined the chat')); // emits to everybody excepts the user thats connecting

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });


    // Listen for chatMessage
    socket.on('chatMessage', (msg) =>{
        console.log(msg);

        io.emit('message', formatMessage('User', msg));
    });
});



const PORT = process.env.PORT || 3000;


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

