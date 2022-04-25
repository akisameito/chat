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
export interface ServerToClientEvents { // emit
    connect: () => void;
    makeUser: () => void;
    makeRoom: (token: string) => void;
    chatMessage: (userId: string, text: string, datetime: number) => void;
}
export interface ClientToServerEvents { // on
    connect: () => void;
    makeUser: () => void;
    connect_error: () => void;
    disconnect: () => void;
    makeRoom: () => void;
    chatMessage: (token: string, text: string) => void;
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
    socket.on("makeUser", () => console.log("****イベント ユーザ作成****"));
    socket.on('makeRoom', () => {
        console.log('****イベント ルーム作成****');
        // 待機中ソケット取得
        let waitingSocket = WaitingSockets.shiftWaitingSocket();
        if (waitingSocket === undefined) {
            // 待機中ソケットがない場合、待機中ソケット配列に追加
            WaitingSockets.saveWaitingSocket(socket);
            console.log('追加 待機ソケット');
            return;
        }

        // TODO 待機中ソケットがすでに切断されている可能性もあるので、疎通確認でブラウザからの応答があった場合にルームへ入れる分岐追加

        // ユーザ作成
        let rUser = new User(socket.id, socket.handshake.address); // ソケット送信ユーザ
        let wUser = new User(waitingSocket.id, socket.handshake.address); // 待機ユーザ
        // ストアに保存
        UserStore.save(rUser);
        UserStore.save(wUser);
        console.log("作成 ユーザ:", UserStore);


        // ルーム作成
        let room = new Room(rUser, wUser);
        // ストアに保存
        RoomStore.save(room);
        // ルームに参加
        room.join(socket, rUser.id);
        room.join(waitingSocket, wUser.id);
        rUser.roomId = room.id;
        wUser.roomId = room.id;
        console.log("作成 ルーム:", RoomStore);

        // clientにroom作成の通知
        io.to(socket.id).emit('makeRoom', rUser.getToken());
        // clientにroom作成の通知
        io.to(waitingSocket.id).emit('makeRoom', wUser.getToken());
    });

    // // 待機中に切断されたら待機プールから削除
    // io.to("roomId").emit('session', {
    //     roomId: "roomId"
    // });

    // クライアントから受ける
    socket.on('chatMessage', (token, text) => {
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
        socket.broadcast.to(room.id).emit("chatMessage", user.id, text, Date.now());
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
