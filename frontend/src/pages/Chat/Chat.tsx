import './Chat.css';
import { useEffect, useState/*, useEffect*/ } from 'react'
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
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<MessageInterface[]>([{ text: "こんにちは", date: "12:10" }, { text: "こんばんは", date: "20:40" }]);
    // レンダリング処理
    useEffect(() => {
        setMessages([...messages, { text: "おはよう", date: "08:10" }])
    }, []);

    // エラー時の処理
    socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
            // this.usernameAlreadySelected = false;
        }
    });

    // ルーム作成　受信
    socket.on('makeRoom', function (response: RoomConnectionInfoInterface) {
        console.log("makeRoom");
        console.log(response);
        roomConnectionInfo = response;
    });

    /**
     * メッセージ　受信
     */
    socket.on('chatMessage', function (response: ReceiveMessageInterface) {
        setMessages([...messages, response.message]);
        console.log('メッセージ受信');
        console.log(response);
        console.log(JSON.stringify(messages));
        // setMessages(oldArray => [...oldArray, msg]);

        // const newaaaaaa: Message[] = [...messages, msg];
        // setMessages(() => newaaaaaa);
    });

    /**
     * ソケット開始
     */
    function startSocket() {
        // this.usernameAlreadySelected = true;
        socket.auth = { username: "username" };
        socket.connect();
    }
    // /**
    //  * ソケット終了
    //  */
    // function endSocket() {
    //     // this.usernameAlreadySelected = true;
    //     socket.auth = { username: "username" };
    //     socket.connect();
    // }

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
                text: message,
            }
        };
        // メッセージ送信
        socket.emit('chatMessage', sendMessage);
        console.log('メッセージ送信');
        console.log(sendMessage);

        // メッセージクリア
        // setMessage("");
    }

    return (
        <div className="Chat">
            <h1>Chat</h1>
            <button onClick={makeRoom}>ルーム作成</button>
            {/* <button onClick={endSocket}>ソケット切断</button> */}
            <div>
                {/* <MessageArea message={"eeee"}></MessageArea> */}
                <MessageArea messages={messages} />
                <br />
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                <br />
                <button onClick={sendMessage}>sendMessage</button>
                <br />
            </div>
        </div>
    );
}

export default Chat;