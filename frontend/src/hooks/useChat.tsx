import { useState, useEffect } from 'react';
import { MessageInterface, SendMessageInterface, ReceiveMessageInterface, ReceiveRoomConnectInterface } from 'pages/chat/interfaceList'
import { StartedChatInterface, CreatedTokenInterface } from "../../../backend/socket/interface/socketEventsInterface";

import socket from "webSocket/sockets";

export interface UseChatInterface {
    messageList: MessageInterface[],
    member: string[],
    requestStartChat: () => void;
    requestEndChat: () => void;
    sendMessage: (message: string) => void;
}
export const useChat = (): UseChatInterface => {
    /** メッセージログ */
    const [messageList, setMessageList] = useState<MessageInterface[]>([]);
    const [member, setMember] = useState<string[]>([]);

    // useEffect()利用することで、コンポーネントマウント後に処理を実行
    useEffect(() => {
        // on
        socket.on('createdToken', (params) => createdToken(params));
        socket.on('startedChat', (params) => startedChat(params));
        socket.on('endedChat', () => endedChat());
        socket.on('reconnectedChat', () => reconnectedChat());
        socket.on('receiveMessage', (params) => receiveMessage(params));

        socket.on("disconnect", (reason) => disconnect(reason));// 切断
        socket.on("connect", () => { });
        socket.io.on("error", (error) => { });
        socket.io.on("reconnect_attempt", (attempt) => { });
        socket.io.on("reconnect", (attempt) => { });
        socket.io.on("reconnect_error", (error) => { });
        socket.io.on("reconnect_failed", () => { });
        socket.onAny((event, ...args) => console.log("[on] イベント:" + event + ", " + "引数:" + JSON.stringify(args)));
        socket.onAnyOutgoing((event, ...args) => console.log("[emit] イベント:" + event + ", " + "引数:" + JSON.stringify(args)));

        // emit
        requestReconnectChat();
    }, []);

    /**********************************************
     on
    **********************************************/
    /**
     * トークン作成通知
     * @param params 
     */
    const createdToken = (params: CreatedTokenInterface) => {
        socket.auth = { token: params.token };
        localStorage.setItem("token", params.token);
    }

    /**
     * チャット開始通知
     * @param params 
     */
    const startedChat = (params: StartedChatInterface) => {
        setMember(params.member);
        // メッセージクリア
        setMessageList([]);
    }

    /** チャット終了通知 */
    const endedChat = () => {
        localStorage.removeItem("token");
    }

    /** チャット再接続通知 */
    const reconnectedChat = () => {
    }

    /**
     * メッセージ受信通知
     * @param params 
     */
    const receiveMessage = (params: ReceiveMessageInterface) => {
        const response = {
            text: params.text,
            unixtime: params.unixtime,// TODO ソートのキーとして利用したいので、時刻を表示する方法は考える(日付が消えるので不可になる)
            isYou: params.isYou,
        }
        setMessageList(pre => [...pre, response]);
        /* useChatコンポーネントがrenderingされた場合に、messageListステートが再宣言されるので、
        ↓messageListが空配列となってしまう。 */
        // setMessageList([...messageList, response]);
    }

    /**
     * 切断
     * @param reason 切断理由
     */
    const disconnect = (reason: string) => {
        // serverからの強制切断の場合
        if (reason === "io server disconnect") {
            localStorage.removeItem("token");
        }
        console.log("切断された。", reason);
    }

    /**********************************************
     emit
    **********************************************/
    /**
     * 再接続処理
     */
    const requestReconnectChat = () => {
        const token = localStorage.getItem("token");
        if (token) {
            socket.auth = { token };
            connect();
            socket.emit('requestReconnectChat');
        }
    }

    /**
     * ソケット開始
     */
    const connect = () => {
        // 接続済みの場合、中断
        if (socket.connected) {
            return false;
        }
        // 接続
        socket.connect();
        return true;
    }

    /**
     * チャット開始リクエスト
     */
    const requestStartChat = () => {
        // socket開始
        connect();
        // チャット開始
        socket.emit('requestStartChat');
    }

    /**
     * チャット終了リクエスト
     */
    const requestEndChat = () => {
        socket.emit('requestEndChat');
    }

    /**
     * メッセージ送信
     * @param message 
     */
    const sendMessage = (message: string) => {
        if (!message) return;
        // メッセージ送信
        socket.emit('sendMessage', { text: message });
    }

    return {
        messageList,
        member,
        requestStartChat,
        requestEndChat,
        sendMessage,
    }
}