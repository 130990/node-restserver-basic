const enterKey = 13;
let socket = null;
let user = null;

//HTML References
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogOut = document.querySelector('#btnLogOut');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth'
    : '';


const validateJWT = async () => {
    const token = localStorage.getItem('token');

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No server token was provided');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { userAuth, token: tokenDB } = await resp.json();

    //REFRESH TOKEN WITH SERVER VALUE
    localStorage.setItem('token', tokenDB);
    user = userAuth;

    document.title = user.name;
    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-messages', displayMessages);
    socket.on('active-users', displayUsers);

    socket.on('private-message', (payload) => {
        console.log('Private message', payload)
    });

}

const displayUsers = (users = []) => {
    let usersHtml = '';

    users.forEach(({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>        
        `;
    });

    ulUsers.innerHTML = usersHtml;
}

const displayMessages = (messages = []) => {
    let messagesHtml = '';
    console.log(messages)

    messages.forEach(({ name, message }) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span>${message}</span>
                </p>
            </li>        
        `;
    });

    ulMessages.innerHTML = messagesHtml;
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;
    if (keyCode !== enterKey) { return; }
    if (message.length === 0) { return; }

    if(keyCode === enterKey){
        socket.emit('send-message', {message, uid});    
        txtMessage.value = '';
        txtUid.value = '';
    }
});

const main = async () => {
    await validateJWT();
}

main();