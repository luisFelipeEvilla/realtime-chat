const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const debug = require('debug')('server:index');
const chalk = require('chalk');
const router = require('./routes/router');
const { addUser, getUser, removeUser, getUsersInRoom } = require('./users');

// enviroment variables config
const config = require('./config');
const PORT = config.PORT;

// server setup
const app = express();
const server = new http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
    methods: ["GET", "POST"]
    }
})

// middlewares

// routes
app.use(router);

// socket.o
io.on('connection', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({id: socket.id, name, room});

        if (error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${user.name} Welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});

        socket.join(user.room);

        callback();

        socket.name = name;
        socket.room = room;
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});

        callback();
    })

    socket.on('disconnect', () => {
        debug(`${socket.name} had left the room ${socket.room}`);
    })
})

// start server
server.listen(PORT, () => {
    debug(`Server its listenning on port ${chalk.green(PORT)}`)
});