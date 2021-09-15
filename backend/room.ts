import { User } from './user';
import { MessageStore } from './messageStore';

export class Room {
    /** 
     * ルームid
     * 
     * ルーム参加者のプライベートidを利用して作成
     */
    private id: string;

    /** ルーム作成日時 */
    private startTime: string;

    /** ルーム参加者一覧 */
    private users: User[] = [];

    /** ルームメッセージ履歴 */
    private messageStore: MessageStore;

    /**
     * コンストラクタ
     * 
     * @param user1 ユーザ1
     * @param user2 ユーザ2
     */
    constructor(user1: User, user2: User) {
        // ルーム参加者追加
        this.users.push(user1);
        this.users.push(user2);

        // ルームID作成
        this.id = "roomID_" + this.users[0].getPrivateKey() + this.users[1].getPrivateKey();// TODO publicじゃない？

        this.startTime = new Date().toLocaleString();
        this.messageStore = new MessageStore();
    }

    /**
     * ルームID取得
     * 
     * @returns ルームid
     */
    public getId(): string {
        return this.id;
    }

    // /**
    //  * privateidに一致するユーザーのpublicidとprivateidを返却する
    //  * @param privateKey 
    //  * @returns 
    //  */
    // public getUser(privateKey: string): User | undefined {
    //     return this.users.find((v) => v.getPrivateKey() === privateKey);
    // }

    /**
     * 公開IDを配列で返却する
     * @returns 
     */
    public getUsersPublicKey(): string[] {
        return this.users.map(item => item["publicKey"]);
    }

    public countUsers() {
        return this.users.length;
    }

    public searchUser(pubulicKey: string): User | undefined {
        return this.users.find((v) => v.getPubulicKey() === pubulicKey);
    }
}

// module.exports = {
//     Room
// };