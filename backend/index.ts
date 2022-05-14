import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface } from './socket/interface/socketEventsInterface'

// Expressインスタンスの作成
const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8080"],
        credentials: true
    },
    cookie: { // TODO K,Yoshimoto tokenの持ち方
        name: "testeststse",
        maxAge: 86400,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    }
});

/**********************************************
 ミドルウェアの追加
**********************************************/
instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit" encrypted with bcrypt
    },
});
const port = process.env.PORT || 3001;

const router: express.Router = express.Router();

/**********************************************
 ミドルウェアの追加
**********************************************/
// app.use(require("/backend/api/logger.js"));
// app.use(express.static(path.join(__dirname, '../frontend/build'))); // herokuに上げる場合に利用

/**********************************************
 ルーティングの追加 // TODO 残っていたコメントをコピペしただけで、実際にはAPI処理に見える。
**********************************************/
app.get('/api/test', function (req, res) { res.json({ test: 'テストAPI' }); });

/**********************************************
 api処理
**********************************************/
// // サイトニュース取得
// // app.get('/api/getSiteNews', require("./router/user.js"));
// // 接続中ユーザー数取得
// app.get('/api/countConnectingUsers', (req: express.Request, res: express.Response) => { res.send('Hello World!') });
// // 天気情報取得
// app.get('/api/getWeather', (req: express.Request, res: express.Response) => { });
// // チャットログ出力
// app.post('/api/exportChatLog', (req: express.Request, res: express.Response) => { });

/**********************************************
 socketIO処理
**********************************************/
require('./socket/socketEvents')(io);

/**********************************************
 Expressサーバの/api以外のアクセスはすべてReactに渡せるように*(アスタリスク)設定を追加。
 Reactにリクエストを渡す。 // TODO 残っていたコメントをコピペしただけで、実際にはよくわからない。
**********************************************/
// app.get('*', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

/**********************************************
 serverをportへlistenさせる
**********************************************/
httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
})
