import './Chat.css';
import { useEffect, useState, useRef } from 'react'
import socket from 'components/socket';
import MessageArea from 'components/molecules/messageArea/MessageArea';
import { MessageInterface, SendMessageInterface, ReceiveMessageInterface, RoomConnectionInfoInterface } from 'pages/chat/interfaceList'

class RoomConnectionInfo implements RoomConnectionInfoInterface {
    publicKey = "";
    privateKey = "";
    roomId = "";
    roomMembers = [""];
}
var roomConnectionInfo = new RoomConnectionInfo();

function Chat() {
    /** ステート */
    const [outgoingMessage, setOutgoingMessage] = useState('');
    // const [messages, setMessages] = useState<MessageInterface[]>([]);

    const [messages, _setMessages] = useState<MessageInterface[]>([]);
    const messagesRef = useRef(messages);
    const setMessages = (messages: MessageInterface[]) => {
        messagesRef.current = messages;
        _setMessages(messages);
    };

    // レンダリング処理
    useEffect(() => {
        // ルーム作成
        socket.on('makeRoom', function (response: RoomConnectionInfoInterface) {
            roomConnectionInfo = response;
        });
        // メッセージ
        socket.on('chatMessage', function (response: ReceiveMessageInterface) {
            // setMessages([...messages, response.message]);
            setMessages(messagesRef.current.concat(response.message));
        });
    }, []);

    // エラー時の処理
    socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
            // this.usernameAlreadySelected = false;
        }
    });

    /**
     * ソケット開始
     */
    function startSocket() {
        // this.usernameAlreadySelected = true;
        socket.auth = { username: "username" };
        socket.connect();
    }

    /**
     * ルーム作成
     */
    function makeRoom() {
        startSocket();
        socket.emit('makeRoom', sendMessage);
    }

    /**
     * メッセージ送信
     */
    function sendMessage() {
        // 送信データ作成
        let sendMessage: SendMessageInterface = {
            publicKey: roomConnectionInfo.publicKey,
            privateKey: roomConnectionInfo.privateKey,
            roomId: roomConnectionInfo.roomId,
            message: {
                text: outgoingMessage,
            }
        };
        // メッセージ送信
        socket.emit('chatMessage', sendMessage);
        console.log('メッセージ送信');
        console.log(sendMessage);

        // メッセージクリア
        // setOutgoingMessage("");
    }

    return (
        <div className="Chat">
            <h1>Chat</h1>
            <button onClick={makeRoom}>ルーム作成</button>
            <div>
                <MessageArea messages={messages} />
                <br />
                <input type="text" value={outgoingMessage} onChange={e => setOutgoingMessage(e.target.value)} />
                <br />
                <button onClick={sendMessage}>sendMessage</button>
                <br />
            </div>
        </div>
    );
}

export default Chat;