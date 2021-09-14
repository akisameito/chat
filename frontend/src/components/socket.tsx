import { io } from "socket.io-client";

const port = 3001;
const URL = `http://localhost:${port}`;
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;