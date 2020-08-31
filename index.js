let express = require('express');
let http = require('http');
let path = require('path');
let socketio = require('socket.io');
let bodyparser = require('body-parser');

let port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let publicDirectory = path.join(__dirname,'/public');
let io = socketio(server);
io.on('connection', (socket) => {
    console.log('new websocket connection!!...');
    socket.on('join',(user) => {
        socket.username = user.username;
        socket.join(user.room);
        socket.emit('message', 'welcome!!!'+user.username);
        let message =user.username+" has joined";
        socket.broadcast.to(user.room).emit('message',message);

    });

    socket.on('send_message',(message) =>{
    socket.emit("conformation","delivred!!!...");
    socket.broadcast.emit('messages',(message));
    
    });

    socket.on('disconnect',()=>{
        socket.broadcast.emit('message',socket.username+" has left");
    });
});

app.use(express.static(publicDirectory));
app.use(express.urlencoded());
app.use(express.json()); 

app.get('/',(req,res) => {
    res.sendfile('./public/userjoin.html');
});


server.listen(port, ( ) => {
    console.log('Server is up to port : '+port);
})


