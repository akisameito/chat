import './Chat.css';
import { useState/*, useEffect*/ } from 'react'

import io from 'socket.io-client';
const port = 3001;
const socket = io(`http://localhost:${port}`);

function Chat() {

    /** ステート */
    const [message, setMessage] = useState('');
    const [displayMessageArea, setDisplayMessageArea] = useState('');

    socket.on('connection', (socket: any) => {
        console.log("Hi client");
        console.log(socket);
    });

    function socketTest() {
        console.log('ソケット 送信: ' + message);

        // ソケット 送信
        socket.emit('chat message', message);
        setMessage("");

        // ソケット 受信
        socket.on('chat message', function (msg: string) {
            console.log('ソケット 受信: ' + msg);

            setDisplayMessageArea(displayMessageArea + msg);
        });
    }

    return (
        <div className="Chat">
            <h1>Chat</h1>
            <div>
                {/* メッセージ表示欄 */}
                <p>{displayMessageArea}</p>
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