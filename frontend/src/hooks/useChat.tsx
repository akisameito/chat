import { useCookies } from "react-cookie";

import { useState, useEffect } from 'react';
import { MessageInterface, SendMessageInterface, ReceiveMessageInterface, ReceiveRoomConnectInterface } from 'pages/chat/interfaceList'

import { io, Socket } from "socket.io-client";
import { ServerToClientEventsInterface, ClientToServerEventsInterface } from "../../../backend/socket/interface/socketEventsInterface";
const socket: Socket<ServerToClientEventsInterface, ClientToServerEventsInterface> = io({
    auth: (cb: any) => {
        cb({ token: "" })
    }
});// TODO パラメータに「http://localhost:3000」を渡して、サーバサイドのcorsを消しても動くっぽい

function eL(type: string, title: string, param?: any) {
    console.log(`**${type}** [${title}]`, param ? (" : " + param) : "");
}

export const useChat = () => {
    /** メッセージログ */
    const [messageHistory, setMessageHistory] = useState<MessageInterface[]>([]);
    const [cookies, setCookie] = useCookies(["token"]);
    const [member, setMember] = useState<string[]>([]);

    useEffect(() => {
        // console.log("レンダリング useChat");
    });
    useEffect(() => {
        // トークンの設定
        socket.auth = { token: cookies?.token };

        socket.on("connect", () => {
            eL("on", "connect");
            // if (cookies?.token) {
            // }
            // if(cookies?.token){
            //     eL("emit", "reconnect", cookies?.token);
            //     socket.emit('reconnect', cookies?.token);
            // }
        });
        createdUser();
        waitStartChat();
        startedChat();
        receiveMessage();
        socket.on("disconnect", (reason) => eL("on", "disconnect", reason));
        socket.io.on("error", (error) => eL("on", "error", error));
        socket.io.on("reconnect_attempt", (attempt) => eL("on", "reconnect_attempt", attempt));
        socket.io.on("reconnect", (attempt) => eL("on", "reconnect", attempt));
        socket.io.on("reconnect_error", (error) => eL("on", "reconnect_error", error));
        socket.io.on("reconnect_failed", () => eL("on", "reconnect_failed"));
    }, []);

    // useEffect()利用することで、コンポーネントマウント後に処理を実行

    /**********************************************
     on
    **********************************************/
    const createdUser = () => {
        socket.on('createdUser', () => {
            eL("on", "createdUser", JSON.stringify(socket.auth));// TODO K.Yoshimoto どうも、サーバーサイドで扱うものではないらしいな、トークン。
            const auth: any = socket.auth;// socket.auth.tokenだと未定義エラーがでるので。TODO auth用型定義作るべき。
            setCookie("token", auth.token ?? ""); // TODO K.Yosdhimoto セキュアにする。HttpOnlyなど
        });
    }
    /**
     * ルーム作成イベント受信 responseMakeRoom
     */
    const waitStartChat = () => {
        socket.on('waitStartChat', () => {
            eL("on", "waitStartChat");
        });
    }
    const startedChat = () => {
        socket.on('startedChat', (params) => {
            eL("on", "startedChat", params.member);
            setMember(params.member);
            // setCookie("member", member);// 再描画などで消えれば、tokenを利用して再取得すればいいだけなので、クッキーに入れる必要はないよな
        });
    }
    /**
     * メッセージ受信
     */
    const receiveMessage = () => {
        // メッセージ受信イベント
        socket.on('receiveMessage', (params) => {
            eL("on", "receiveMessage", "省略");
            const date = new Date(params.datetime);
            const response = {
                userId: params.userId,
                text: params.text,
                datetime: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()// TODO ソートのキーとして利用したいので、時刻を表示する方法は考える(日付が消えるので不可になる)
            }
            setMessageHistory(pre => [...pre, response]);
            /* useChatコンポーネントがrenderingされた場合に、messageHistoryステートが再宣言されるので、
            ↓messageHistoryが空配列となってしまう。 */
            // setMessageHistory([...messageHistory, response]);
        });
    }

    /**********************************************
     emit
    **********************************************/
    /**
     * ソケット開始
     */
    const startSocket = () => {
        if (!socket.connected) {
            console.log("ソケットあり");
        } else {
            console.log("ソケット無し");
        }
        eL("emit", "ソケット開始");
        // ハンドシェイク実行
        socket.connect();

        // メンバー存在チェック
        // TODO ユーザ作成済みかチェック
    }
    /**
     * ユーザ作成
     */
    const createUser = () => {
        // TODO ユーザ作成済みかチェック
        startSocket();
        eL("emit", "createUser");
        socket.emit('createUser');
    }

    /**
     * ルーム作成 
     */
    const startChat = () => {
        if (socket.connected) {
            eL("emit", "startChat");
            socket.emit('startChat');
        }
    }
    /**
     * メッセージ送信
     * @param message 
     */
    const sendMessage = (message: string) => {
        if (!message) return;
        // メッセージ送信
        eL("emit", "sendMessage");
        socket.emit('sendMessage', { text: message });
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
        member,
        cookies,// TODO デバッグ用削除予定
        createUser,
        startChat,
        sendMessage,
    }
}