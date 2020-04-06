const chatForm = document.getElementById('team-chat-form');
const chatMessages = document.querySelector('.team-chat-messages');
const teamName = document.getElementById('team-name');
const userList = document.getElementById('users');


const { name, team} = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});
console.log(name,team);


const socket = io();

socket.emit('joinTeam', {name, team});


socket.on('teamUsers', ({team, users}) => {
    outputTeamName(team);
    outputUsers(users);
})

socket.on('chatMessage', chatMessage => {
    console.log(chatMessage);
    outputMessage(chatMessage);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    const ms = e.target.elements.ms.value;

    socket.emit('message', ms);

    e.target.elements.ms.value = '';
    e.target.elements.ms.focus();

})
    function outputMessage(chatMessage) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${chatMessage.name}
                    <span>${chatMessage.time}</span>
                    </p>  
                    <p class="text">
                        ${chatMessage.text}
                    </p>  `;
        document.querySelector('.team-chat-messages').appendChild(div)
    }
    function outputTeamName(team) {
        teamName.innerText = team;
    }

    function outputUsers(users) {
        userList.innerHTML = `
        ${users.map(user => `<li>${user.name}</li>`).join('')}`;
    };