import './Chat.css';
import { useRef, useEffect } from 'react'

// カスタムフック 
import { useChat } from "hooks/useChat";

function Chat() {
    useEffect(() => {
        console.log("レンダリング Chat");
    });
    /** メッセージ用element */
    const msgEl = useRef<HTMLInputElement>(null);

    const {
        messageHistory,
        createUser,
        startChat,
        sendMessage,
    } = useChat();

    const handleSendMessage = () => {
        if (msgEl.current == null || msgEl.current.value == null) return;
        sendMessage(msgEl.current.value);
        msgEl.current.value = "";
    }
    return (
        <div className="Chat">
            <button onClick={createUser}>ユーザ作成</button>
            <br />
            <button onClick={startChat}>ルーム作成</button>
            <div>
                <input type="text" ref={msgEl} />
                <br />
                <button onClick={handleSendMessage}>送信</button>
                <br />
                {messageHistory.map((msg) => (
                    <p key={msg.datetime}>{msg.text}</p>
                ))}
            </div>
        </div>
    );
}

export default Chat;