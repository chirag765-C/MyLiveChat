const http=require('http');
const express=require('express');
const cors=require('cors');
const socketIO=require('socket.io');

const app=express();
const port=4500 || process.env.PORT;

const users=[{}];


app.use(cors()); 
app.get('/',(req,res)=>{
    res.send("Oh yeah its there");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on('connection',(socket)=>{
    console.log("New Connection");

   socket.on('joined',({user})=>{

         users[socket.id]=user;
         console.log(`${user} has joined`);
         socket.broadcast.emit('userJoined',{user:'Admin',message:`${users[socket.id]} has Joined`});
        
         socket.emit('welcome',{user:"Admin",message:`Welcome to the chat , ${users[socket.id]}`})
        })


socket.on('message',({message,id})=>{
//here we are making proper chat wala thing if one send message then we have to its message to everyone 
//it means we cant use boradcast because there should be message left for the user also to see on its right side what he has send 
// so we are using io to send message to whole circuit
//here in this socket we have received message what user has send and we are now sending it to whole io circuit

io.emit('sendMessage',{user:users[id],message,id});



})

    socket.on('disconnected',()=>{
        socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} has left`});
        console.log(`User left`);
    }) 

        

})


server.listen(port,()=>{
    console.log(`Server is running on  http://localhost:${port}`);
})