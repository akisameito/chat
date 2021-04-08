import express from 'express'

const app: express.Express = express()

// // socket用
// import http from 'http';
// import socketio from 'socket.io';
// const server: http.Server = http.createServer();
// const io: socketio.Server = new socketio.Server(server);
// io.on('connection', (socket: socketio.Socket) => console.log('connect'));

const path = require('path');
const port = process.env.PORT || 3001;

// TODO buildフォルダ消滅したが、そもそもこれ何用なんだ？
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/api", (req: express.Request, res: express.Response) => {
    res.json({ message: "Hello World! TypScript!" });
});

app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`listening on *:${port}`);
})
