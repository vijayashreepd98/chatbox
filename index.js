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
let newuser = [];
io.on('connection', (socket) => {
   
    console.log('new websocket connection!!...');
    
    if(newuser.length!=0){
        
        io.sockets.emit('userview',newuser);  
    }
    socket.on('join',(user) => {
        socket.username = user.username;
        socket.join(user.room);
        socket.join(user.username);
        
        socket.username = user.username;
        
        newuser.push(socket.username);
        
        io.sockets.emit('newuser',user.username);
       
        socket.emit('message', 'welcome!!!'+user.username);
        let message =user.username+" has joined";
        socket.broadcast.to(user.room).emit('message',message);
        

    });

    socket.on('send_message',(message) =>{
    username=message.recipient;
   
    
    socket.emit("conformation","delivred!!!...");
    // io.sockets.in(username).emit('messages',(message));
    socket.in(username).emit('messages',(message));

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


