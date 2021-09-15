export class User {

    /** 公開鍵 */
    private publicKey: string;
    /** 秘密鍵 */
    private privateKey: string;

    /**
     *  コンストラクタ
     * 
     * @param socketId ソケットID
     */
    constructor(socketId: string) {
        this.privateKey = this.makePrivateKey(socketId);
        this.publicKey = this.makePubulicKey(socketId);
    }


    // /**
    //  * 公開鍵,秘密鍵取得
    //  * 
    //  * @return 公開鍵と秘密鍵
    //  */
    // public getKeys(): object {
    //     return {
    //         publicKey: this.publicKey,
    //         privateKey: this.privateKey,
    //     };
    // }
    /**
     * 公開鍵取得
     * 
     * @return 公開鍵
     */
    public getPubulicKey(): string {
        return this.publicKey;
    }
    /**
     * 秘密鍵取得
     * 
     * @return 秘密鍵
     */
    public getPrivateKey(): string {
        return this.privateKey;
    }

    /**
     * 公開鍵作成
     * 
     * @param socketId 
     * @return 公開鍵
     */
    private makePubulicKey(socketId: string): string {
        return "pubulicKey_" + socketId;
    }
    /**
     * 秘密鍵作成
     * 
     * @param socketId 
     * @return 秘密鍵
     */
    private makePrivateKey(socketId: string): string {
        return "privateKey_" + socketId;
    }
};