import socket from 'components/socket';

/**
 * イベント受信
 * 
 * @param ev 
 */
export const evOn = async (ev: string) => {
    socket.on(ev, function (response) {
        return response;
    });
}

/**
 * イベント送信
 * 
 * @param ev 
 */
export const evEmit = async (ev: string, sendMessage: any) => {
    socket.emit(ev, sendMessage);
}

/**
 * ソケット開始
 */
export function startSocket(auth: any) {
    // this.usernameAlreadySelected = true;
    socket.auth = { username: "username" };
    socket.connect();
}
