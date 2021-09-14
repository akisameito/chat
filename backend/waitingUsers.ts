export class WaitingUsers {

    static users: string[] = [];

    /**
     * socketIdを待機ユーザー配列の末尾に追加
     * 
     * @param socketId 
     */
    static saveUser(socketId: string): void {
        this.users.push(socketId);
    }

    /**
     * 待機ユーザー配列の先頭からsocketIdを切り出し
     * @return 存在しない場合undefind
     */
    static shiftUser(): string | undefined {
        return this.users.shift();
    }

    /**
     * socketIdを待機ユーザー配列から削除
     * 
     * @param socketId 
     */
    static deleteUser(socketId: string): void {
        const index = this.users.findIndex((socketId) => socketId === socketId);
        this.users.splice(index, 1);
    }
}