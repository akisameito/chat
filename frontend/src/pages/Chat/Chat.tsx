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
        member,
        cookies,
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
            <hr />
            <div style={{ display: "flex" }}>
                <div style={{ border: "solid", width: "300px", backgroundColor: "#c8c2c6" }}>
                    <b>ユーザ</b>
                    <pre>トークン:<pre>{cookies.token}</pre></pre>
                    <button onClick={createUser}>ユーザ作成</button>
                </div>
                <div style={{ border: "solid", width: "300px", backgroundColor: "#c8c2c6" }}>
                    <b>ルーム</b>
                    <pre>メンバー:<pre>{member.join("\n")}</pre></pre>
                    <button onClick={startChat}>ルーム作成</button>
                </div>
            </div>
            <hr />

            <div>
                <input type="text" ref={msgEl} />
                <br />
                <button onClick={handleSendMessage}>送信</button>
                <div>
                    {messageHistory.map((msg) => {
                        return (
                            <p key={msg.datetime}
                                style={{ border: "solid", width: "350px", backgroundColor: "#bce2e8" }}
                            >
                                [{msg.datetime}]　{msg.text}
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Chat;