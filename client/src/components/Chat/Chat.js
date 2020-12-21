import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css'

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');

    const ENDPOINT = 'localhost:5000';
    

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        setName(name);
        setRoom(room);

        socket = io(ENDPOINT);

        socket.emit('join', {
            name,
            room
        }, () => {});

        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }

        event.target.value='';
    }

    console.log(message, messages);

    return (
        <div className="outerContainer">
           <div className="container">
               <input valuie={message} onChange={ event => setMessage(event.target.value)}
               onKeyPress={ event => event.key === 'Enter' ? sendMessage(event) : null} 
               />
            </div> 
        </div>
    )
}

export default Chat;