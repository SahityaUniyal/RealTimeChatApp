const { Server } = require("socket.io");

const io = new Server(8000, { 
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
 });

//  Store the users that join are in the server
let users={};


// when a connection is made with the server
io.on("connection", (socket) => {

    // emitting the previous user to the new user
    socket.emit("old-users",users);

    socket.on("new-user-joined",(name)=>{
        // add the user with its unique socket id
        users[socket.id]=name;

        // broadcast to other users that another user has joined 
        socket.broadcast.emit("user-joined",name);
    });

    // if send is emitter from the user
    socket.on("send",(message)=>{

        // broadcast to other that they need to receive a new message
        socket.broadcast.emit("receive",{message:message, name:users[socket.id]}); 
    });

    // if a user disconnects
    socket.on("disconnect",()=>{

        // broadcast to others that user has left
        socket.broadcast.emit("left-chat",users[socket.id]);
        
        // delete from the users
        delete users[socket.id];

        // broadcasting the updated users
        socket.broadcast.emit("updated-members",users);
    });

});
