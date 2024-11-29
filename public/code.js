const socket = io();

const joinBtn = document.querySelector("#join-btn");
let uname;

joinBtn.addEventListener("click", function () {

    const userName =  document.getElementById("nickname").value;
    if(userName.length == 0){
        return;
    }

    uname = userName;
    socket.emit("newuser", uname)
      
    document.querySelector(".Join-screen").classList.remove("active");
    document.querySelector(".chat-screen").classList.add("active");
})

// sending message
const sendBtn = document.querySelector(".message-input button");

sendBtn.addEventListener("click", function (){
    let message = document.querySelector(".message-input input").value;

    if(message.length == 0){
        return;
    }

    renderMessage("my", message);
    socket.emit("chat", {
        userName: uname,
        text: message
    });
    document.querySelector(".message-input input").value = "";
});

// exit chat
const exitBtn = document.querySelector(".chat-screen .header button");

exitBtn.addEventListener("click", function(){
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
});

// revieving messages from server
socket.on("update", function(update){
    renderMessage("update", update);
})

socket.on("chat", function(message){
    renderMessage("other", message);
})

function renderMessage(type, message){
    let messagesDiv = document.querySelector(".messages");
    let div = document.createElement('div');
    if(type == "my"){
        div.classList = "my message";
        div.innerHTML = `
            <div>
                <div class="name">me</div>
                <div class="text">${message}</div>
            </div>
        `
        messagesDiv.appendChild(div);
    } else if(type == "other"){
        div.classList = "other message";
        div.innerHTML = `
            <div>
                <div class="name">${message.userName}</div>
                <div class="text">${message.text}</div>
            </div>
        `
        messagesDiv.appendChild(div);
    }  else if(type == "update"){
        div.classList = "update";
        div.textContent = message;
        messagesDiv.appendChild(div);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
} 