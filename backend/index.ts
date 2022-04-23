// モジュールの読み込み -------------------------------------------------------------
import express from 'express';
import http from 'http';
import { createPrivateKey } from 'node:crypto';
import socketio from 'socket.io';
import { WaitingSockets } from './waitingSocket';
import { Room } from './room';
import { RoomStore } from './roomStore';
import { User } from './user';
import { UserStore } from './userStore';
import { userInfo } from 'os';

// Expressインスタンスの作成 -------------------------------------------------------------
const app: express.Express = express();

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

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

io.on('connection', (socket: socketio.Socket) => {
    console.log('connection');

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
        io.to(socket.id).emit('makeRoom', {
            token: rUser.getToken(),
        });
        // clientにroom作成の通知
        io.to(waitingSocket.id).emit('makeRoom', {
            token: wUser.getToken(),
        });
    });

    // // 待機中に切断されたら待機プールから削除
    // io.to("roomId").emit('session', {
    //     roomId: "roomId"
    // });

    // クライアントから受ける
    socket.on('chatMessage', (data) => {
        console.log('****イベント チャットメッセージ****');
        console.log('トークン:' + data.token);
        console.log('メッセージ:' + data.text);
        // ユーザ取得
        const user = UserStore.get(data.token);
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
        socket.broadcast.to(room.id).emit("chatMessage", {
            userId: user.id,
            text: data.text,
            datetime: Date.now()
        });
        console.log('ルーム内に送信', data.text);
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
server.listen(port, () => {
    console.log(`listening on *:${port}`);
})
