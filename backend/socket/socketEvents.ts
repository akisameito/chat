import { User } from './../user';
import { Room } from './../room';
import { RoomStore } from './../roomStore';
import { UserStore } from './../userStore';

import { ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface } from './interface/socketEventsInterface'
import { SendMessageInterface } from './interface/socketEventsInterface'

import { Server, Socket } from "socket.io";
import { createPrivateKey } from 'node:crypto';
import { serialize, parse } from "cookie";

module.exports = function (io: Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>) {
    // 初回ハンドシェイク時に実行
    io.engine.on("initial_headers", (headers: any, request: any) => {
        // トークンが存在する場合、ユーザチェック
        // トークンが存在する場合、ルームチェック
    });

    // ミドルウェア
    io.use((socket, next) => {
        // トークンに紐づく情報を取得
        const { token, user, room } = getTokenData(socket.handshake.auth.token);

        // トークンチェック
        if (!token) {
            return next();
        }
        // ユーザチェック
        if (!user) {
            delete socket.handshake.auth.token;
            return next();
        }
        // ルームチェック
        if (!room) {
            delete socket.handshake.auth.token;
            UserStore.delete(token);
            return next();
        }

        // トークン, ユーザID, ルームID取得
        socket.data.token = token;
        socket.data.userId = user.id;
        socket.data.roomId = room.id;

        next();
    });

    io.on('connection', (socket) => {

        socket.on('requestReconnectChat', () => requestReconnectChat(socket));
        socket.on('requestStartChat', () => requestStartChat(io, socket));
        socket.on('requestEndChat', () => requestEndChat(io, socket));
        socket.on('sendMessage', (params) => sendMessage(io, socket, params));

        socket.on("connect_error", () => { console.log("イベント:" + "connect_error") });
        socket.on("disconnect", (reason) => {
            // 正常終了
            if (reason === "io server disconnect") {
                // ルーム削除
                // ユーザ削除
                // token削除
            }
            // io server disconnect : サーバーはsocket.disconnect（）を使用してソケットを強制的に切断しました
            // io client disconnect : socket.disconnect（）を使用してソケットを手動で切断しました
            // ping timeout         : pingInterval + pingTimeoutサーバーは範囲内でPINGを送信しませんでした
            // transport close      : 接続が閉じられました（例：ユーザーが接続を失った、またはネットワークがWiFiから4Gに変更された）
            // transport error      : 接続でエラーが発生しました（例：HTTPロングポーリングサイクル中にサーバーが強制終了されました）
            console.log("イベント:" + "disconnect" + ", " + "引数:" + reason)
        });// 何分後までかにACCESSがない場合、ユーザ削除など

        // デバッグ用
        socket.onAny((event, ...args) => console.log("[on] イベント:" + event + ", " + "引数:" + JSON.stringify(args)));
        socket.onAnyOutgoing((event, ...args) => console.log("[emit] イベント:" + event + ", " + "引数:" + JSON.stringify(args)));
    });

    io.of("/").adapter.on("create-room", (room) => console.log(`    ルーム作成 room:[${room}]`));
    io.of("/").adapter.on("delete-room", (room) => console.log(`    ルーム削除 room:[${room}]`));
    io.of("/").adapter.on("join-room", (room, id) => console.log(`    ルーム参加 room:[${room}], ID:[${id}]`));
    io.of("/").adapter.on("leave-room", (room, id) => console.log(`    ルーム退出 room:[${room}], ID:[${id}]`));
}

/**
 * チャット再接続
 * @param socket 
 * @returns 
 */
function requestReconnectChat(
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>
) {
    // 再接続
    const result = reconnectChat(socket);
    if (!result) { socket.disconnect(); }// 失敗した場合、切断
}

/**
 * チャット開始リクエスト
 * @param io 
 * @param socket 
 * @returns 
 */
function requestStartChat(
    io: Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>
) {
    // 再接続
    const result = reconnectChat(socket);
    if (result) { return; }// 成功した場合、中断

    // ユーザ作成
    const user = new User(socket.handshake.address);
    UserStore.save(user);
    // トークン設定
    socket.handshake.auth.token = user.getToken();
    socket.emit("createdToken", { token: user.getToken() });

    // 待機ユーザ取得
    const wait = UserStore.shiftWaitUser();

    let room;
    if (!wait) {
        // 待機ユーザが存在しない場合、待機ユーザ列に追加して新規ルームで待機
        UserStore.saveWaitUser(user);
        room = new Room();
        RoomStore.save(room);
        room.join(socket, user.id);
        user.roomId = room.id;

    } else {
        // 待機ユーザが存在する場合、待機ユーザが属するルームに参加
        room = RoomStore.get(wait.roomId);
        if (!room) { return console.log("ルーム非存在エラー"); }// ルームを作り直すかどうするか。元のユーザもどうするか。
        room.join(socket, user.id);
        user.roomId = room.id;

        // ルーム作成通知
        io.to(room.id).emit("startedChat", { member: room.member });
    }
}

/**
 * チャット終了リクエスト
 * @param io 
 * @param socket 
 */
function requestEndChat(
    io: Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>
) {
    // トークンに紐づく情報を取得
    const { token, user, room } = getTokenData(socket.handshake.auth.token);

    // トークンクリア
    if (token) { delete socket.handshake.auth.token; }

    // ユーザクリア
    if (user) { UserStore.delete(user.token); }

    // ルームクリア
    if (room) {
        RoomStore.delete(room.id);

        // 終了通知
        io.in(room.id).emit("endedChat");

        // 切断
        io.in(room.id).disconnectSockets(true);
    }
}

/**
 * チャットメッセージ送信
 * @param io 
 * @param socket 
 * @param param 
 * @returns 
 */
function sendMessage(
    io: Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
    params: SendMessageInterface
) {
    // トークンに紐づく情報を取得
    const { token, user, room } = getTokenData(socket.handshake.auth.token);
    
    // トークン存在, ユーザ存在, ルーム存在する場合、削除
    if (!token) {
        console.log("エラー トークン無し")
        return "エラーーー";
    }
    if (!user) {
        console.log("エラー ユーザ無し")
        return "エラーーー";
    }
    if (!room) {
        console.log("エラー ルーム無し")
        return "エラーーー";
    }
    if (!room.isMember(user.id)) {
        console.log("エラー エラー　ルーム参加者でない")
        return "エラーーー";
    }

    //送信元に送信
    socket.emit("receiveMessage", { text: params.text, unixtime: Date.now(), isYou: true });
    //Room内の送信元以外の全員に送信
    socket.broadcast.to(room.id).emit("receiveMessage", { text: params.text, unixtime: Date.now(), isYou: false });
}

/**
 * トークンに紐づく情報を取得
 * @param token 
 * @returns 
 */
function getTokenData(token: string | undefined): { token: string | undefined, user: User | undefined, room: Room | undefined } {
    let rtn: { token: string | undefined, user: User | undefined, room: Room | undefined } = {
        token: undefined,
        user: undefined,
        room: undefined,
    };

    // トークン
    if (!token) { return rtn; }
    rtn.token = token;

    // ユーザ
    const user = UserStore.get(token);
    if (!user) { return rtn; }
    rtn.user = user;

    // 所属ルーム
    const room = RoomStore.get(user.roomId);
    if (!room) { return rtn; }
    rtn.room = room;

    return rtn;
}

/**
 * 再接続処理
 * @param socket 
 * @returns 
 */
function reconnectChat(
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>
) {
    // トークンに紐づく情報を取得
    const { token, user, room } = getTokenData(socket.handshake.auth.token);
    // トークン情報が有効か
    if (!token || !user || !room) {
        return false;
    }
    // ルーム参加
    room.join(socket, user.id);
    return true;
}