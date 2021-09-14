// モジュールの読み込み -------------------------------------------------------------
import express from 'express';
import http from 'http';
import { createPrivateKey } from 'node:crypto';
import socketio from 'socket.io';
import { WaitingUsers } from './waitingUsers';
import { Room } from './room';
import { RoomStore } from './roomStore';

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

    let waitingUser = WaitingUsers.shiftUser();

    // 待機ユーザーがいない場合、待機ユーザー配列に追加
    if (waitingUser === undefined) {
        // 待機プールに追加
        WaitingUsers.saveUser(socket.id);

        console.log('saveUser');
        return;
    }

    // room作成
    let room = new Room(socket.id, waitingUser);

    // roomStoreに保存
    RoomStore.saveRoom(room.getId(), room);

    // TODO 新規と待機ユーザをツッコむか
    socket.join(room.getId());

    console.log("room作成");

    // clientにroom作成の通知
    io.to(socket.id).emit('makeRoom', {
        user: room.getUser(socket.id),
        roomId: room.getId(),
        roomMembers: room.getUsersPublicId()
    });

    // clientにroom作成の通知
    io.to(waitingUser).emit('makeRoom', {
        user: room.getUser(waitingUser),
        roomId: room.getId(),
        roomMembers: room.getUsersPublicId()
    });

    // // 待機中に切断されたら待機プールから削除
    // io.to("roomId").emit('session', {
    //     roomId: "roomId"
    // });

    // // クライアントから受ける
    // socket.on('chat message', (msg) => {
    //     console.log('ソケット 受信: ' + msg);

    //     // クライアントに送付
    //     io.emit('chat message',
    //         {
    //             publickKey: "publickKey",
    //             text: msg,
    //             dateTime: "2021/04/18 22:45:10"
    //         }
    //     );
    //     console.log('ソケット 送信: ' + msg);
    // });
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
