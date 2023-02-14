const socket = io("http://localhost:8000");

const form = document.querySelector(".form");
const messageInput = document.querySelector(".message");
const messageContainer = document.querySelector(".messages-container");
const dropdownMenu = document.querySelector(".dropdown-menu");

// Function to add element to the message container
const append= (name,message,pos)=>{
    const messageElement= document.createElement("div")
    messageElement.innerHTML="<p class='name'>"+name+"</p>"+"<p class='msg'>"+message+"</p>";
    messageElement.classList.add(pos);
    messageContainer.append(messageElement);
};
const appendJoin=(message,pos)=>{
    const messageElement= document.createElement("p")
    messageElement.innerHTML=message;
    messageElement.classList.add(pos);
    messageContainer.append(messageElement);

};

const appendMembers=(userName)=>{
    const user= document.createElement("p");
    user.innerHTML=userName;
    user.classList.add("dropdown-item");
    dropdownMenu.append(user);
};


// joining the chat yourself and letting others know about it
const yourName = prompt("Enter your name to join");

// emitting that you joined to other users 
socket.emit("new-user-joined",yourName);

// adding old users(that joined before) to the member list
socket.on("old-users",(data)=>{
    const oldUsers=Object.values(data);
    oldUsers.forEach(user=>{
        appendMembers(user);
    });
});

// notification for joining 
appendJoin(`Welcome to the chat group ${yourName}`,"center");

//add yourself in the chat members 
appendMembers(yourName);

// Event triggered when send button is pressed
form.addEventListener("submit",(e)=>{
    // prevent page from reloading on submit
    e.preventDefault();

    // get the message in the input
    const message=messageInput.value;

    // setting the input blank after send
    messageInput.value="";

    // adding the message for yourself
    append('You',`${message}`,"right");

    // emitting message to other users
    socket.emit("send",message);
});


// If another user joins the chat
socket.on("user-joined",(name)=>{
    appendJoin(`${name} joined the chat`,"center");
    appendMembers(name);
})

// If a message is received form socket.io broadcast
socket.on("receive",(data)=>{
    append(`${data.name}`,`${data.message}`,"left");
});

// If a user leaves the chat
socket.on("left-chat",(name)=>{
    appendJoin(`${name} left the chat`,"center");
});

// updates the users if a user leaves the chat
socket.on("updated-members",data=>{
    dropdownMenu.innerHTML="";
    const users = Object.values(data);
    users.forEach(user=>{
        appendMembers(user);
    });
});