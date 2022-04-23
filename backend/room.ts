import { User } from './user';
import socketio from 'socket.io';

/**
 * ユーザ情報
 */
interface RoomInterface {
    /** 
     * ID
     * ルーム参加者のプライベートidを利用して作成
     */
    readonly id: string;
    /** メンバー */
    member: string[];
    /** ルーム作成日時 */
    readonly datetime: number;
};

export class Room implements RoomInterface {
    id;
    member: string[];
    datetime;

    /** ルームメッセージ履歴 */
    // private messageStore: MessageStore;

    /**
     * コンストラクタ
     * 
     * @param user1 ユーザ1
     * @param user2 ユーザ2
     */
    constructor(user1: User, user2: User) {
        this.id = "roomID_" + user1.getId() + user2.getId();
        this.member = [user1.getId(), user2.getId()];
        this.datetime = Date.now();
        // this.messageStore = new MessageStore();
    }

    /** メンバー数 */
    public countMembers(): number {
        return this.member.length;
    }
    public join(socket: socketio.Socket, userId: User["id"]) {
        socket.join(this.id);
        this.member.push(userId);// TODO コンストラクタでやるべきか
    }
    public isMember(userId: string) {
        return this.member.includes(userId);
    }
}