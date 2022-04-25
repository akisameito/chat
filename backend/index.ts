import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { createPrivateKey } from 'node:crypto';
import { WaitingSockets } from './waitingSocket';
import { Room } from './room';
import { RoomStore } from './roomStore';
import { User } from './user';
import { UserStore } from './userStore';
import { userInfo } from 'os';

// Expressインスタンスの作成
const app = express();
const httpServer = createServer(app);

// socketio作成
export interface ClientToServerEvents { // on
    connect: () => void;
    connect_error: () => void;
    createUser: () => void;
    disconnect: () => void;
    startChat: (token: string) => void;
    sendMessage: (token: string, text: string) => void;
}
export interface ServerToClientEvents { // emit
    connect: () => void;
    createdUser: (token: string) => void;
    startedChat: (member: string[]) => void;
    waitStartChat: () => void;
    receiveMessage: (userId: string, text: string, datetime: number) => void;
}
interface InterServerEvents {
}
interface SocketData {
    token: string;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer
    , { cors: { origin: "http://localhost:3000", } }
);
const port = process.env.PORT || 3001;

const router: express.Router = express.Router();

// ミドルウェアの追加 -------------------------------------------------------------
// app.use(require("/backend/api/logger.js"));
// app.use(express.static(path.join(__dirname, '../frontend/build'))); // herokuに上げる場合に利用

// ルーティングの追加 -------------------------------------------------------------
app.get('/api/test', function (req, res) { res.json({ test: 'テストAPI' }); });

// // サイトニュース取得
// // app.get('/api/getSiteNews', require("./router/user.js"));
// // 接続中ユーザー数取得
// app.get('/api/countConnectingUsers', (req: express.Request, res: express.Response) => { res.send('Hello World!') });
// // 天気情報取得
// app.get('/api/getWeather', (req: express.Request, res: express.Response) => { });
// // チャットログ出力
// app.post('/api/exportChatLog', (req: express.Request, res: express.Response) => { });

io.on('connection', (socket) => {
    console.log('****イベント connection****');
    socket.on("connect", () => console.log('****イベント connect****'));
    socket.on("connect_error", () => console.log('****イベント connect_error****'));
    socket.on("disconnect", () => console.log("****イベント 切断****"));// 何分後までかにACCESSがない場合、ユーザ削除など

    // ユーザ作成
    socket.on("createUser", () => {
        console.log("****イベント ユーザ作成****")
        const user = new User(socket.id, socket.handshake.address); // ユーザ作成
        UserStore.save(user); // ストアに保存
        io.to(socket.id).emit('createdUser', user.getToken()); // 作成を通知
    });

    // ルーム作成
    socket.on('startChat', (token) => {
        // ユーザ取得
        const user = UserStore.get(token);
        if (!user) {
            return console.log("エラー トークン認証");
        }

        // 待機ユーザ取得
        const wait = UserStore.shiftWaitUser();
        console.log("待機ユーザ取得 %o", wait);
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
        io.to(room.id).emit("startedChat", room.member);
        // socket.broadcast.to(room.id).emit("startedChat", room.member);

    });

    // // 待機中に切断されたら待機プールから削除
    // io.to("roomId").emit('session', {
    //     roomId: "roomId"
    // });

    // クライアントから受ける
    socket.on('sendMessage', (token, text) => {
        console.log('****イベント チャットメッセージ****');
        console.log('トークン:', token);
        console.log('メッセージ:', text);
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
        socket.broadcast.to(room.id).emit("receiveMessage", user.id, text, Date.now());
    });
});

// Expressサーバの/api以外のアクセスはすべてReactに渡せるように*(アスタリスク)設定を追加。
// Reactにリクエストを渡す。
// app.get('*', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });


/**********************************************
 serverをportへlistenさせる
**********************************************/
httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
})
