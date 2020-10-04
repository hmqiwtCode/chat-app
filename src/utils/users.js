const users = []
const User = require('./user')

const addUser = ({id,username,room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return{
            'error' : 'Username and room are required!'
        }
    }
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            'error' : 'user is in use'
        }
    }
    
    const user = new User(id,username,room)
    users.push(user)
    return {user}

}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return  users.splice(index,1)[0]
    }
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = users.filter((user) => {
        return user.room === room
    })

    return usersInRoom
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    return user
    //find() return the first element in array if pass the test
}


module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}