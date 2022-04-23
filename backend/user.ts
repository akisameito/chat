/**
 * ユーザ情報
 */
interface UserInterface {
    /** ID */
    readonly id: string;
    /** トークン */
    readonly token: string;
    /** IP */
    readonly ip: string;
    /** 開始時間 */
    readonly datetime: number;
    /** 
     * 入室中ルームID
     * roomのメンバーを検索してもいいが、ユーザに持たせている方がシンプル。
     * また、つどつど入室中のルームを検索する必要がなくなり処理不可が軽くなる。
     * また、情報が多い分にはセキュアにもなる(冗長ともいえるが...)。
     *  */
    roomId: string;
};

export class User implements UserInterface {
    id: string;
    token: string;
    ip: string;
    datetime: number;
    roomId: string = "";
    /**
     *  コンストラクタ
     * @param socketId ソケットID
     * @param ip IP
     */
    constructor(socketId: string, ip: string) {
        this.id = this.makeId(socketId);
        this.token = this.makeToken(socketId);
        this.ip = ip;
        this.datetime = Date.now();
    }
    /** ユーザID取得 */
    public getId(): UserInterface["id"] {
        return this.id;
    }
    /** トークン取得 */
    public getToken(): UserInterface["token"] {
        return this.token;
    }
    /**
     * ID作成
     * @param socketId 
     * @return ID
     */
    private makeId(socketId: string): UserInterface["id"] {
        return "userId_" + socketId;
    }
    /**
     * トークン作成
     * @param socketId 
     * @return 秘密鍵
     */
    private makeToken(socketId: string): UserInterface["token"] {
        return "token_" + socketId;
    }
};