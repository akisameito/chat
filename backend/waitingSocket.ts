import socketio from 'socket.io';
export class WaitingSockets {

    static Sockets: socketio.Socket[] = [];

    /**
     * socketIdを待機ユーザー配列の末尾に追加
     * 
     * @param socketId
     */
    static saveWaitingSocket(socketId: socketio.Socket): void {
        this.Sockets.push(socketId);
    }

    /**
     * 待機ユーザー配列の先頭からsocketio.Socketを切り出し
     * @return 存在しない場合undefind
     */
    static shiftWaitingSocket(): socketio.Socket | undefined {
        return this.Sockets.shift();
    }

    /**
     * socketIdを待機ユーザー配列から削除
     * 
     * TODO 20210915 socket削除するように要修正
     * 
     * @param socketId 
     */
    static deleteWaitingSocket(socketId: string): void {
        const index = this.Sockets.findIndex((socketId) => socketId === socketId);
        this.Sockets.splice(index, 1);
    }
}