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
    // called during the handshake
    io.engine.on("initial_headers", (headers: any, request: any) => {
        headers["set-cookie"] = serialize("token", "1234567890abcdefghijklmn", { httpOnly: true, sameSite: "strict", secure: true, maxAge: 86400, });
    });

    io.on('connection', (socket) => {
        // 初回接続チェック
        initCheck(socket);
        // チャット開始リクエスト
        socket.on('startChat', () => startChat(io, socket));
        // チャットメッセージ送信
        socket.on('sendMessage', (params) => sendMessage(io, socket, params));

        socket.on("connect_error", () => eL("on", "connect_error"));
        socket.on("disconnect", () => eL("on", "disconnect", JSON.stringify(socket.data)));// 何分後までかにACCESSがない場合、ユーザ削除など
    });

    io.of("/").adapter.on("create-room", (room) => {
        console.log(`ルーム作成 room:[${room}]`);
    });
    io.of("/").adapter.on("delete-room", (room) => {
        console.log(`ルーム削除 room:[${room}]`);
    });
    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`ルーム参加 room:[${room}], ID:[${id}]`);
    });
    io.of("/").adapter.on("leave-room", (room, id) => {
        console.log(`ルーム退出 room:[${room}], ID:[${id}]`);
    });
}

function initCheck(
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>
) {
    eL("on", "connection", JSON.stringify(socket.handshake.auth));
    // トークンが存在するか、
    if (!socket.handshake.auth?.token) {
        return;
    }

    // ユーザ作成かつ、入室中ルーム設定済みか、
    const user = UserStore.get(socket.handshake.auth.token);
    if (!user?.roomId) {
        return;
    }

    // ルーム存在かつ、ルームメンバーか、
    const room = RoomStore.get(user.roomId);
    if (!room) {
        return;
    }
    // ソケットをルームに入れなおす
    room.join(socket, user.id);
}

// /**
//  * ユーザ作成
//  * 
//  * @param socket 
//  */
// function createdToken(
//     io: Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
//     socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
// ) {
//     eL("on", "createUser")
//     // ユーザ作成
//     const user = new User(socket.id, socket.handshake.address);
//     UserStore.save(user); // ストアに保存

//     // 作成を通知
//     eL("emit", "createdUser", JSON.stringify(socket.handshake.auth));
//     io.to(socket.id).emit('createdUser');
// }

/**
 * 
 * @param io 
 * @param socket 
 * @returns 
 */
function startChat(
    io: Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>,
    socket: Socket<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>
) {
    // トークンチェック

    // ユーザ作成
    const user = new User(socket.id, socket.handshake.address);
    UserStore.save(user);

    // トークン作成
    socket.handshake.auth.token = user.getToken();
    io.to(socket.id).emit('createdToken');

    // 待機ユーザ取得
    const wait = UserStore.shiftWaitUser();

    let room;
    if (!wait) { // 待機ユーザが存在しない場合、
        // 待機ユーザ追加
        UserStore.saveWaitUser(user);

        // ルーム作成
        room = new Room();
        RoomStore.save(room);

        // ルームに参加
        room.join(socket, user.id);
        user.roomId = room.id;
    } else { // 待機ユーザが存在する場合、
        // 待機ユーザが属するルーム取得
        room = RoomStore.get(wait.roomId);
        if (!room) { return console.log("ルーム非存在エラー"); }// ルームを作り直すかどうするか。元のユーザもどうするか。

        // ルームに参加
        room.join(socket, user.id);
        user.roomId = room.id;

        // ルーム作成通知
        eL("emit", "startedChat", JSON.stringify({ member: room.member }));
        io.to(room.id).emit("startedChat", { member: room.member });
    }
}

/**
 * メッセージ送信
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
    eL("on", "sendMessage", JSON.stringify(params));
    // トークンが存在するか、
    if (!socket.handshake.auth?.token) {
        return;
    }
    const token = socket.handshake.auth.token;
    console.log('トークン:', token);
    console.log('メッセージ:', params.text);


    // ユーザ取得
    const user = UserStore.get(token);
    if (user === undefined) {
        console.log("エラー トークン認証")
        return "エラーーー";
    }
    // ルーム取得
    const room = RoomStore.get(user.roomId);
    console.log("RoomStore.get", room);
    if (room === undefined) {
        console.log("エラー ルーム不在")
        return "エラーーー";
    }
    // ルームの参加者に存在するか
    if (!room.isMember(user.id)) {
        console.log("エラー　ルーム参加者")
        return "エラーーー";
    }
    // sessioinが書き変わっている場合、joinしなおす必要がある...??

    //Room内の送信元以外の全員に送信
    eL("emit", "receiveMessage");
    socket.emit("receiveMessage", { text: params.text, unixtime: Date.now(), isYou: true });
    socket.broadcast.to(room.id).emit("receiveMessage", { text: params.text, unixtime: Date.now(), isYou: false });
    // io.in(room.id).emit("receiveMessage", { userId: user.id, text: params.text, datetime: Date.now() });
}

// export function onCreateUser() {
// }
function eL(type: string, title: string, param?: any) {
    console.log(`**${type}** [${title}]`, param ? (" : " + param) : "");
}