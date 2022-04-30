import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { RoomStore } from './roomStore';
import { UserStore } from './userStore';

import { connect, createUser, startChat, sendMessage } from './socket/socketEvents'
import { ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface } from './socket/interface/socketEventsInterface'

// Expressインスタンスの作成
const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEventsInterface, ServerToClientEventsInterface, InterServerEventsInterface, SocketDataInterface>(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8080"],
        credentials: true
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
function eL(type: string, title: string, param?: any) { console.log(`**${type}** [${title}]`, param ? (" : " + param) : ""); }
io.on('connection', (socket) => {
    eL("on", "connection", JSON.stringify(socket.handshake.auth));
    // トークンが保持されている場合、
    if (socket.handshake.auth?.token) {
        // ユーザ作成済みか
        const user = UserStore.get(socket.handshake.auth.token);
        // 入室中ルームが存在するか
        if (user?.roomId) {
            const room = RoomStore.get(user.roomId);
            // ソケットをルームに入れなおす
            if (room) {
                room.join(socket, user.id);
            }
        }
    }

    // 初回接続チェック
    socket.on("connect", () => connect(io, socket));
    // ユーザ作成
    socket.on("createUser", () => createUser(io, socket));
    // ルーム作成
    socket.on('startChat', (params) => startChat(io, socket, params));
    // クライアントメッセージを受ける
    socket.on('sendMessage', (params) => sendMessage(io, socket, params));

    socket.on("connect_error", () => eL("on", "connect_error"));
    socket.on("disconnect", () => eL("on", "disconnect", JSON.stringify(socket.data)));// 何分後までかにACCESSがない場合、ユーザ削除など
});

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
