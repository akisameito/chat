import './Chat.css';
import { useState/*, useEffect*/ } from 'react'

import io from 'socket.io-client';
const port = 3001;
const URL = `http://localhost:${port}`;
var socket = io(URL, { autoConnect: false });
interface Message {
    text: string;
    date: string;
};

function Chat() {
    /**
     * ソケット開始
     */
    function startSocket() {
        socket.on('connection', (socket: any) => {
            console.log("Hi client");
            console.log(typeof socket);
            console.log(socket);
        });

        // this.usernameAlreadySelected = true;
        socket.auth = { username: "username" };
        socket.connect();
    }

    // ソケット終了
    function endSocket() {
        // this.usernameAlreadySelected = true;
        socket.auth = { username: "username" };
        socket.connect();
    }

    // エラー時の処理
    socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
            // this.usernameAlreadySelected = false;
        }
    });

    // ソケット 受信
    socket.on('makeRoom', function (msg: any) {
        console.log('makeRoom');
        console.log(msg);
    });


    /** ステート */
    const [message, setMessage] = useState('');
    const [displayMessages, setDisplayMessages] = useState<Message[]>([]);


    function socketTest() {
        console.log('ソケット 送信: ' + message);

        // ソケット 送信
        socket.emit('chat message', message);
        setMessage("");

        // ソケット 受信
        socket.on('chat message', function (msg: Message) {
            console.log('ソケット 受信: ');
            console.log(JSON.stringify(displayMessages));
            setDisplayMessages([...displayMessages, msg]);
            // setDisplayMessages(oldArray => [...oldArray, msg]);

            // const newaaaaaa: Message[] = [...displayMessages, msg];
            // setDisplayMessages(() => newaaaaaa);
        });

    }
    return (
        <div className="Chat">
            <h1>Chat</h1>

            {/* ソケット接続 */}
            <button onClick={startSocket}>ソケット接続</button>
            {/* ソケット切断 */}
            <button onClick={endSocket}>ソケット切断</button>



            <div>
                {/* メッセージ表示欄 */}
                {displayMessages.map((data) =>
                    <>
                        <span>{data.text} {data.date}</span><br />
                    </>
                )}
                <br />

                {/* 入力欄 */}
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                <br />

                {/* 送信ボタン */}
                <button onClick={socketTest}>button socketTest</button>
                <br />
            </div>
            <p>{ }</p>
        </div>
    );
}

export default Chat;