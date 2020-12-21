const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const debug = require('debug')('server:index');
const chalk = require('chalk');
const router = require('./routes/router');

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
    socket.on('join', ({name, room}) => {
        debug(`${name} had connected to the room ${room}`);

        socket.name = name;
        socket.room = room;
    })

    socket.on('disconnect', () => {
        debug(`${socket.name} had left the room ${socket.room}`);
    })
})

// start server
server.listen(PORT, () => {
    debug(`Server its listenning on port ${chalk.green(PORT)}`)
});