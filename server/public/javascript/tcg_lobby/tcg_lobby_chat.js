const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
var socket;
const messageContainer = document.getElementById('message-container')
socket=io.connect('http://pokemon.zachicus.xyz:80')
var name = prompt('What is your name?');
if (name==null||name==""||name=="null"){  //stops users from being able to input no name into the prompt
    window.location.replace("http://pokemon.zachicus.xyz")
}
else{
    document.getElementById('playerName').setAttribute("value",name)
}
appendMessage('You joined')
socket.emit('new-user', name)
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
});
socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
})
socket.on('user-disconnected',name =>{
    appendMessage(`${name} disconnected`)
})
messageForm.addEventListener('submit',e=>{
    e.preventDefault();
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message',message)
    messageInput.value='';
})
function appendMessage(message){
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageElement.offsetHeight+messageElement.offsetTop //scrolls the message window to the bottom message
}