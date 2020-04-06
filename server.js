const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser,userLeave,getTeamUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname, 'public')));

const bot = 'Chat Bot';

io.on('connection', socket => {
    socket.on('joinTeam', ({name, team}) => {
        const user = userJoin(socket.id, name, team);

        socket.join(user.team);

        socket.emit("chatMessage", formatMessage(bot, "Welcome to Chat"));
        socket.broadcast.to(user.team).emit(
        "chatMessage",
        formatMessage(bot, `${user.name} has joined`)
        );

        io.to(user.team).emit('teamUsers', {
            team: user.team,
            users: getTeamUsers(user.team)
        });
    });
    socket.on('message', (ms)=> {
        const user = getCurrentUser(socket.id);

    io.to(user.team).emit('chatMessage', formatMessage(user.name, ms));
    });
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if(user) {
        
    io.to(user.team).emit("chatMessage", formatMessage(bot, `${user.name} has left the chat`));
            io.to(user.team).emit('teamUsers', {
                team: user.team,
                users: getTeamUsers(user.team)
            });
        }
});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
