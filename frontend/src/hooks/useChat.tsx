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
     * ユーザ作成
     */
    const createUser = () => {
        console.log("****イベント****ユーザ作成リクエスト");
        startSocket();
        createdUser()
        socket.emit('createUser');
    }
    const createdUser = () => {
        socket.on('createdUser', (token) => {
            console.log("****イベント****ユーザ作成完了", token);
            setCookie("token", token); // TODO K.Yosdhimoto セキュアにする。HttpOnlyなど
        });
    }

    // ------------------------------------------------------------------------------------------------------
    /**
     * ルーム作成 
     */
    const startChat = () => {
        console.log("****イベント****チャット開始リクエスト");
        waitStartChat();
        startedChat();
        socket.emit('startChat', cookies.token);
    }
    /**
     * ルーム作成イベント受信 responseMakeRoom
     */
    const waitStartChat = () => {
        socket.on('waitStartChat', () => {
            console.log("****イベント****チャット開始待機");
        });

    }
    const startedChat = () => {
        socket.on('startedChat', (member) => {
            console.log("****イベント****チャット開始", member);
            // setCookie("member", member);// 再描画などで消えれば、tokenを利用して再取得すればいいだけなので、クッキーに入れる必要はないよな
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
        socket.emit('sendMessage', cookies.token, message);
        console.log('****イベント****メッセージ送信', message);
    }
    /**
     * メッセージ受信
     */
    const receiveMessage = () => {
        // メッセージ受信イベント
        socket.on('receiveMessage', (userId, text, datetime) => {
            const response = {
                userId: userId,
                text: text,
                datetime: datetime
            }
            console.log('****イベント****メッセージ受信', response);
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
        createUser,
        startChat,
        sendMessage,
    }
}