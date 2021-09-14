import { User } from './user';
import { MessageStore } from './messageStore';

export class Room {
    /** ルームid */
    private id: string;

    /** ルーム作成日時 */
    private startTime: string;

    /** ルーム参加者一覧 */
    private users: User[] = [];

    /** ルームメッセージ履歴 */
    private messageStore: MessageStore;

    constructor(socketId: string, socketId2: string) {

        this.users.push(new User(socketId));
        this.users.push(new User(socketId2));

        this.id = this.users[0].privateId + this.users[1].privateId;
        this.startTime = new Date().toLocaleString();
        this.messageStore = new MessageStore();
    }

    public getId(): string {
        return this.id;
    }

    /**
     * privateidに一致するユーザーのpublicidとprivateidを返却する
     * @param privateId 
     * @returns 
     */
    public getUser(privateId: string): User | undefined {
        return this.users.find((v) => v.privateId === privateId);
    }

    /**
     * 公開IDを配列で返却する
     * @returns 
     */
    public getUsersPublicId(): string[] {
        return this.users.map(item => item["publicId"]);
    }

    public countUsers() {
        return this.users.length;
    }
}

// module.exports = {
//     Room
// };