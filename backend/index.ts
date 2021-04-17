// モジュールの読み込み -------------------------------------------------------------
import express from 'express';
import http from 'http';
import socketio from 'socket.io';

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
app.get('/api/test', function (req, res) { res.json({ test: 'Hello World!' }); });

// // サイトニュース取得
// // app.get('/api/getSiteNews', require("./router/user.js"));
// // 接続中ユーザー数取得
// app.get('/api/countConnectingUsers', (req: express.Request, res: express.Response) => { res.send('Hello World!') });
// // 天気情報取得
// app.get('/api/getWeather', (req: express.Request, res: express.Response) => { });
// // チャットログ出力
// app.post('/api/exportChatLog', (req: express.Request, res: express.Response) => { });


io.on('connection', (socket: socketio.Socket) => {
    console.log('ソケット接続');

    // クライアントから受ける
    socket.on('chat message', (msg) => {
        console.log('ソケット 受信: ' + msg);

        // クライアントに送付
        io.emit('chat message', msg);
        console.log('ソケット 送信: ' + msg);
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
