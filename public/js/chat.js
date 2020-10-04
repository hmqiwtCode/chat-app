const socket = io()

// socket.on('countUpdated',(count)=>{
//     console.log(count)

// })


const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $buttonLocation = document.getElementById('send-location')

const $messages = document.querySelector('#messages') //set up template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarUserTemplate = document.querySelector('#sidebar-template').innerHTML

// we need to know . 
//socket.on() is when server send message to client
//socket.emit() when we want to call to server 

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true })
if(!username || !room ){
    location.href = "/"
}


const scrollNicer = () => {
    const newMessageHeight = $messages.lastElementChild.offsetHeight+ parseInt(getComputedStyle($messages.lastElementChild).marginBottom)
    console.log(typeof newMessageHeight)
    const toltalMessagesHeight = $messages.scrollHeight
    const heightCurrentVisiblity = $messages.offsetHeight // always
    const heightOfTop = heightCurrentVisiblity + $messages.scrollTop

    if(toltalMessagesHeight - newMessageHeight <= heightOfTop){
        $messages.scrollTop = toltalMessagesHeight
    }
}
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        'username' : message.user,
        'message' : message.text,
        'createAt' : moment(message.createAt).format('hh:mm') //DD-MM-YYYY 
    })
    $messages.insertAdjacentHTML('beforeend', html)
    scrollNicer()
})

// document.querySelector('#increase').addEventListener('click',()=>{
//     socket.emit('updateCount')
// })

$messageForm.addEventListener('submit',(e)=>{
    $messageFormButton.setAttribute('disabled','disabled')
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(callback) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log("emit from client successful",callback)
        console.log($messages.scrollHeight)
    })
})

$buttonLocation.addEventListener('click',(e)=>{
    e.preventDefault()
    $buttonLocation.setAttribute('disabled','disabled')
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((success,error) => {
            if(success){
                 socket.emit('send-location',{
                     'latitude' : success.coords.latitude,
                     'longitude' : success.coords.longitude
                 })
            }else{
                console.log(error)
            }
        })
    }else{
        console.log('meo')
    }
})



const getUserOnsite = () => {
    socket.emit('getOnsite',undefined)
}


socket.on('onSite',(current) => {
        console.log(current)
})


socket.on('location',(url) => {
    const html = Mustache.render(locationTemplate, {url})
    $messages.insertAdjacentHTML('beforeend', html)
    $buttonLocation.removeAttribute('disabled')
 })

getUserOnsite()




socket.emit('join',{username,room}, (error) => {
    if(error){
        alert(error)
        location.href="/"
    }
    
})




socket.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarUserTemplate, {
        'users' : users,
        'room' : room,
    })
    document.querySelector('#usersib').innerHTML = html
})


myFunction = () => {
    console.log($messages.scrollTop)
}