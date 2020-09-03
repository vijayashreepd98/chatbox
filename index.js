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
    // when new user joins new connection will established
    socket.on('join',(user) => {
        socket.username = user.username;
        socket.join(user.room);
        socket.join(user.username);
        
        socket.username = user.username;
        //for checking  whether new connection with the same username is already existed or not
        for(let i=0;i<newuser.length;i++)
        {
           if(newuser[i] == socket.username){
               let message = "Tab is already open with same username!!Please try to close it and reconnect it....";
               socket.emit('notification',message);
               
           }
        }
       
        //pushing new username into array
        newuser.push(socket.username);
        
        io.emit('newuser',newuser);
       
        socket.emit('message', 'welcome!!!'+user.username);
        let message =user.username+" has joined";
        socket.broadcast.to(user.room).emit('newusermessage',message);
        

    });
    //for sending messsages to perticular client
    socket.on('send_message',(message) =>{
    username=message.recipient;
    //conforming message delivery to perticular client
    socket.emit("conformation","delivred!!!...");
    //  recipient recieving message sent by sender
    socket.in(username).emit('messages',(message));
    //updating chat history in sender side
    socket.emit('frommessage',message);

    });
    //diconnecting connection
    socket.on('disconnect',()=>{
        //removing disconnected username from global array
        for(let i=0;i<newuser.length;i++)
        {
           if(newuser[i] == socket.username){
              
               newuser.splice(i,1);
               
           }
        }
        //sending  user left notifiaction to all available user
        socket.broadcast.emit('userleft',socket.username+" has left");
        // updating displaying userlist
        io.emit('newuser',newuser);
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


