import { User } from './user'

export class UserStore {
    // let 変数名 : Map<キーのデータ型,値のデータ型> = new Map();
    private static users: Map<string, User> = new Map();
    private static waitUsers: User[] = [];
    /**
     * ユーザ検索
     * @param token トークン
     * @returns ユーザ情報
     */
    public static get(token: User["token"]): User | undefined {
        return this.users.get(token);
    }
    /**
     * ユーザ保存
     * @param user ユーザ情報
     */
    public static save(user: User) {
        this.users.set(user.token, user);
    }
    /**
     * ユーザ削除
     * @param token 秘密トークン
     */
    public static delete(token: User["token"]) {
        this.users.delete(token);
    }
    /**
     * ユーザ保存
     * @param user ユーザ情報
     */
    public static wait(user: User) {
        this.users.set(user.token, user);
    }

    /**
     * 待機ユーザーの末尾に追加
     */
    static saveWaitUser(user: User) {
        this.waitUsers.push(user);
    }
    /**
     * 待機ユーザーの先頭から切り出し
     * @return 存在しない場合undefind
     */
    static shiftWaitUser() {
        return this.waitUsers.shift();
    }
}
