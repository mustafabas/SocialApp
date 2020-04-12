import SockJsClient from 'react-stomp';

const SOCK_URL = "http://sapi.fillsoftware.com/socialapp/sock";
const ROOM_URL = "http://sapi.fillsoftware.com/socialapp"


export class SocketServices {


    stompClient = null;
    postId: number;
    username: string;


    constructor(postId: number, username: string) {


        this.postId = postId;
        this.username = username;
        // this.orderId = orderId;
        // this.tokenList = tokenList;
        this.connect()
    }



    connect() {
        var socket = new SockJS(SOCK_URL);
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, ()=>this.onConnected(), (e)=>this.onError(e));

    }


    onConnected() {
        this.enterRoom(this.postId);
    }
    onError(error: any) {
        console.log(error)
    }
    enterRoom(postId: number) {
        var roomId = postId;
        // Cookies.set('roomId', room);
        // roomIdDisplay.textContent = roomId;
        var topic = `/chat-app/chat/${postId}`;

        var currentSubscription = this.stompClient.subscribe(`/chat-room/${roomId}`, this.onMessageReceived);

        this.stompClient.send(`${topic}/addUser`,
            {},
            JSON.stringify({ sender: this.username, type: 'JOIN' })
        );
    }

    sendMessage(messageContent: string, username: string, newRoomId: number) {

        var topic = `/chat-app/chat/${newRoomId}`;
        if (messageContent && stompClient) {
            var chatMessage = {
                sender: username,
                content: messageContent,
                type: 'CHAT'
            };

            this.stompClient.send(`${topic}/sendMessage`, {}, JSON.stringify(chatMessage));

        }

    }
    onMessageReceived(payload) {
        var message = JSON.parse(payload.body);
       

        if (message.type === 'JOIN') {
            // messageElement.classList.add('event-message');
            message.content = message.sender + ' joined!';
        } else if (message.type === 'LEAVE') {
            // messageElement.classList.add('event-message');
            message.content = message.sender + ' left!';
        } else {
            
        }
        var messageText = message.content;
        var messageSender = message.sender;


       
    }



}

