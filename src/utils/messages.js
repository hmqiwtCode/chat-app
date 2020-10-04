const generateMessage = (user,text) => {
    return {
        'user' : user,
        'text' : text,
        'createAt' : new Date().getTime()
    }
}

module.exports = {
    generateMessage
}