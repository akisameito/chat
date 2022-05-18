import { io, Socket } from "socket.io-client";
import { ServerToClientEventsInterface, ClientToServerEventsInterface } from "../../../backend/socket/interface/socketEventsInterface";
// const URL = "http://localhost:3000";
const socket: Socket<ServerToClientEventsInterface, ClientToServerEventsInterface> = io(/*URL,*/ {// TODO パラメータに「http://localhost:3000」を渡して、サーバサイドのcorsを消しても動くっぽい
    autoConnect: false,
    auth: (cb) => {
        cb({ token: localStorage.token })
    }
});
export default socket;
