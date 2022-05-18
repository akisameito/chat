import { User } from './user';
import socketio from 'socket.io';

/**
 * ユーザ情報
 */
interface RoomInterface { // TODO typescriptではクラス作成と同時に同名で型定義も作成される。
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
     */
    constructor() {
        this.id = "roomID_" + Math.random().toString(32).substring(2);
        this.member = [];
        this.datetime = Date.now();
        // this.messageStore = new MessageStore();
    }

    /** メンバー数 */
    public countMembers(): number {
        return this.member.length;
    }
    /**
     * ユーザをルームに追加
     * 
     * @param socket 
     * @param userId 
     * @returns 
     */
    public join(socket: socketio.Socket, userId: User["id"]) {
        // ルームに追加
        socket.join(this.id);
        // メンバーに追加
        if (this.member.includes(userId)) { // 再接続時にも利用するため、メンバーに存在する場合はメンバーに追加しない。
            return;
        }
        this.member.push(userId);
    }

    /**
     * userIdがルームのメンバーかチェック
     * @param userId 
     * @returns 
     */
    public isMember(userId: string) {
        return this.member.includes(userId);
    }
}