import { Room } from './room'

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
    /**
     * ルーム削除
     * @param id
     */
    public static delete(id: Room["id"]) {
        this.rooms.delete(id);
    }
}
