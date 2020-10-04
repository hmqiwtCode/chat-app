const express = require('express')
const http = require('http') // setup socket.io
const path = require('path')
const socketio = require('socket.io')
const {generateMessage} = require('./utils/messages')
const User = require('./utils/user')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app) // setup socket.io
const io = socketio(server)

const publicDirectory = path.join(__dirname,'../public')
console.log(publicDirectory)
app.use(express.static(publicDirectory)) // using folder public contain html to display ui () 


const port = process.env.PORT || 3000

let count = 0
let userOnsite = 0;
io.on('connection',(socket)=>{       // receive connnect from client
    userOnsite++
    console.log('Have a connection')

    // socket.emit('countUpdated', count) // send event to client

    // socket.on('updateCount',() => {
    //    // socket.emit('countUpdated',count++)   // send event to specific connection to server
    //     io.emit('countUpdated',count++) //send event for every single connection to server
  //  })

    // socket.emit('message',generateMessage('Welcome'))
    // socket.broadcast.emit('message', generateMessage('A new user has joined')) // send to all connection except connection make this connection
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback('Delivery!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        userOnsite--
        io.emit('onSite',userOnsite)
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                'room' : user.room,
                'users' : getUsersInRoom(user.room)
            })
        }

        

        
    })

    socket.on('send-location',(location,callback)=> {
        console.log(location)

        io.emit('location',`http://map.google.com/maps?q=${location.latitude},${location.longitude}`)
    })

    socket.on('getOnsite',() => {
        io.emit('onSite',userOnsite)
    })

    socket.on('join',({username,room},callback) => {
        const {error,user} = addUser({'id': socket.id, username,room})
        console.log(error)
        if(error){
            return callback(error)
        }
        socket.join(user.room)   // to join to a specific room

        socket.emit('message',generateMessage('Admin','Welcome')) 
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${user.username} has joined`)) // send message to everyone in this room except the user make this request
        io.to(user.room).emit('roomData',{
            'room' : user.room,
            'users' : getUsersInRoom(user.room)
        })
    })



})
server.listen(port, () => {
    console.log(`Listen at port ${port}`)
})

