import { Room } from './room'

export class RoomStore {

    // let 変数名 : Map<キーのデータ型,値のデータ型> = new Map();
    private static rooms: Map<string, Room> = new Map();

    static getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }
    /**
     * ルーム保存
     * 
     * @param roomId ルームID
     * @param room ルーム
     */
    static saveRoom(roomId: string, room: Room) {
        this.rooms.set(roomId, room);
    }
}

// module.exports = {
//     RoomStore
// };