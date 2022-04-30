import { User } from './../user';
import { Room } from './../room';
import { RoomStore } from './../roomStore';
import { UserStore } from './../userStore';

import * as sEIf from './interface/socketEventsInterface'

import { Server, Socket } from "socket.io";
import { createPrivateKey } from 'node:crypto';



export function connect(
    io: Server<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
    socket: Socket<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
) {
    // eL("on", "connect")
    // ユーザの情報を再送
    // ユーザID
    // ルームID
    // ルームに再代入
    // eL("emit", "connect")
}

/**
 * ユーザ作成
 * 
 * @param socket 
 */
export function createUser(
    io: Server<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
    socket: Socket<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
) {
    eL("on", "createUser")
    // ユーザ作成
    const user = new User(socket.id, socket.handshake.address);
    UserStore.save(user); // ストアに保存
    socket.data.token = user.getToken();

    // 作成を通知
    eL("emit", "createdUser", JSON.stringify({ token: user.getToken() }));
    io.to(socket.id).emit('createdUser', { token: user.getToken() });
}

/**
 * 
 * @param io 
 * @param socket 
 * @param params 
 * @returns 
 */
export function startChat(
    io: Server<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
    socket: Socket<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
    params: sEIf.StartChatInterface
) {
    eL("on", "startChat", JSON.stringify(params));
    // ユーザ取得
    const user = UserStore.get(params.token);
    if (!user) { return console.log("エラー トークン認証"); }

    // 待機ユーザ取得
    const wait = UserStore.shiftWaitUser();
    let room;
    if (!wait) { // 存在しない場合、
        // 待機ユーザ追加
        UserStore.saveWaitUser(user);
        // ルーム作成
        room = new Room();
        RoomStore.save(room);
        // ルームに参加
        room.join(socket, user.id);
        user.roomId = room.id;
        eL("emit", "waitStartChat");
        io.to(socket.id).emit('waitStartChat');
        return;
    }

    // ルーム取得
    room = RoomStore.get(wait.roomId);
    if (!room) {
        // ルームを作り直すかどうするか。元のユーザもどうするか。
        return console.log("ルーム非存在エラー");
    }
    // ルームに参加
    room.join(socket, user.id);
    user.roomId = room.id;
    // ルーム作成通知
    eL("emit", "startedChat", JSON.stringify({ member: room.member }));
    io.to(room.id).emit("startedChat", { member: room.member });
    // socket.broadcast.to(room.id).emit("startedChat", room.member);
}

/**
 * メッセージ送信
 * @param io 
 * @param socket 
 * @param param 
 * @returns 
 */
export function sendMessage(
    io: Server<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
    socket: Socket<sEIf.ClientToServerEventsInterface, sEIf.ServerToClientEventsInterface, sEIf.InterServerEventsInterface, sEIf.SocketDataInterface>,
    params: sEIf.SendMessageInterface
) {
    eL("on", "sendMessage", JSON.stringify(params));
    console.log('トークン:', params.token);
    console.log('メッセージ:', params.text);
    // ユーザ取得
    const user = UserStore.get(params.token);
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
    eL("emit", "receiveMessage", JSON.stringify({ userId: user.id, text: params.text, datetime: Date.now() }));
    socket.broadcast.to(room.id).emit("receiveMessage", { userId: user.id, text: params.text, datetime: Date.now() });
}

// export function onCreateUser() {
// }
function eL(type: string, title: string, param?: any) {
    console.log(`**${type}** [${title}]`, param ? (" : " + param) : "");
}