// モジュールの読み込み -------------------------------------------------------------
import express from 'express';
import http from 'http';
import { createPrivateKey } from 'node:crypto';
import socketio from 'socket.io';
import { WaitingSockets } from './waitingSocket';
import { Room } from './room';
import { RoomStore } from './roomStore';
import { User } from './user';

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
        console.log('makeRoom');
        // 待機中ソケット取得
        let waitingSocket = WaitingSockets.shiftWaitingSocket();
        if (waitingSocket === undefined) {
            // 待機中ソケットがない場合、待機中ソケット配列に追加
            WaitingSockets.saveWaitingSocket(socket);
            console.log('add WaitingSockets');
            return;
        }

        // ユーザ作成
        let requestUser = new User(socket.id); // ソケット送信ユーザ
        let waitingUser = new User(waitingSocket.id); // 待機ユーザ

        // ルーム作成
        let room = new Room(requestUser, waitingUser);
        // ルームストアに保存
        RoomStore.saveRoom(room.getId(), room);
        // ルームに参加
        socket.join(room.getId());
        waitingSocket.join(room.getId());// TODO ブラウザからの応答があった場合にそっちでルームに入れた方がいい気もするな
        console.log("room作成");
        // clientにroom作成の通知
        io.to(socket.id).emit('makeRoom', {
            privateKey: requestUser.getPrivateKey(),
            publicKey: requestUser.getPubulicKey(),
            roomId: room.getId(),
            roomMembers: room.getUsersPublicKey()
        });
        // clientにroom作成の通知
        io.to(waitingSocket.id).emit('makeRoom', {
            privateKey: waitingUser.getPrivateKey(),
            publicKey: waitingUser.getPubulicKey(),
            roomId: room.getId(),
            roomMembers: room.getUsersPublicKey()
        });
    });

    // // 待機中に切断されたら待機プールから削除
    // io.to("roomId").emit('session', {
    //     roomId: "roomId"
    // });

    // クライアントから受ける
    socket.on('chatMessage', (data) => {
        console.log('chatMessage');
        console.log('ソケット 受信:' + data.message.text);
        // ルーム取得
        let room = RoomStore.getRoom(data.roomId);
        if (room === undefined) {
            console.log("エラー　room")
            return "エラーーー";
        }
        // ルーム参加者から検索
        let user = room.searchUser(data.publicKey);
        if (user === undefined) {
            console.log("エラー　ルーム参加者")
            return "エラーーー";
        }
        // 秘密鍵の確認
        if (user.getPrivateKey() !== data.privateKey) {
            console.log("エラー　秘密鍵")
            return "エラーーー";
        }

        //Room内の送信元以外の全員に送信
        socket.broadcast.to(data.roomId).emit("chatMessage",
            {
                publickKey: data.publicKey,
                message: {
                    text: data.message.text,
                    dateTime: new Date()
                }
            }
        );
        console.log('ソケット 送信:' + data.message.text);
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
