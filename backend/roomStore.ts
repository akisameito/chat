import { Room } from './room'
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

export class RoomStore {
    // let 変数名 : Map<キーのデータ型,値のデータ型> = new Map();
    private static rooms: Map<string, Room> = new Map();
    /** ルーム取得 */
    public static get(id: Room["id"]) {
        return this.rooms.get(id);
    }
    /**
     * ルーム保存
     * 
     * @param room ルーム
     */
    static save(room: Room) {
        this.rooms.set(room.id, room);
    }
}
