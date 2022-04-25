import { useCookies } from "react-cookie";

import { useState, useEffect } from 'react';
import { MessageInterface, SendMessageInterface, ReceiveMessageInterface, ReceiveRoomConnectInterface } from 'pages/chat/interfaceList'

import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../../backend";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

export const useChat = () => {
    /** メッセージログ */
    const [messageHistory, setMessageHistory] = useState<MessageInterface[]>([]);
    const [cookies, setCookie] = useCookies(["token"]);
    useEffect(() => {
        console.log("レンダリング useChat");
    });

    // useEffect()利用することで、コンポーネントマウント後に処理を実行

    /**
     * ソケット開始
     */
    const startSocket = () => {
        console.log("ソケット開始");
        socket.connect();
    }
    // ------------------------------------------------------------------------------------------------------
    /**
     * ルーム作成 requestMakeRoom
     */
    const makeRoom = () => {
        console.log("リクエスト ルーム作成");
        startSocket();
        socket.emit('makeRoom');
        makedRoom();
    }
    /**
     * ルーム作成イベント受信 responseMakeRoom
     */
    const makedRoom = () => {
        socket.on('makeRoom', (token) => {
            console.log("作成 ルーム", token);
            setCookie("token", token); // TODO K.Yosdhimoto セキュアにする。HttpOnlyなど
            // メッセージ受信イベント
            receiveMessage();
        });
    }
    // ------------------------------------------------------------------------------------------------------

    /**
     * メッセージ送信
     * @param message 
     */
    const sendMessage = (message: string) => {
        if (!message) return;

        // メッセージ送信
        socket.emit('chatMessage', cookies.token, message);
        console.log('送信 メッセージ', sendMessage);
    }
    /**
     * メッセージ受信
     */
    const receiveMessage = () => {
        // メッセージ受信イベント
        socket.on('chatMessage', (userId, text, datetime) => {
            const response = {
                userId: userId,
                text: text,
                datetime: datetime
            }
            console.log('受信 メッセージ', response);
            setMessageHistory(pre => [...pre, response]);
            /* useChatコンポーネントがrenderingされた場合に、messageHistoryステートが再宣言されるので、
            ↓messageHistoryが空配列となってしまう。 */
            // setMessageHistory([...messageHistory, response]);
        });
    }
    // /**
    //  * エラー時の処理
    //  */
    // const receiveError = () => {
    //     console.log('エラー時の処理');
    //     socket.on("connect_error", (err) => {
    //         if (err.message === "invalid username") {
    //             // this.usernameAlreadySelected = false;
    //         }
    //     });a
    // }
    return {
        /** 現在のTODOリスト */
        messageHistory,
        makeRoom,
        sendMessage,
    }
}