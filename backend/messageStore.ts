interface Message {
    text: string;
    user: string;
    dateTime: string;
};

export class MessageStore {
    /** メッセージリスト */
    private messages: Message[];

    constructor() {
        this.messages = [];
    }

    /**
     * メッセージ設定
     * @param messages 
     */
    saveMessage(message: Message) {
        this.messages.push(message);
    }
    /**
     * メッセージ取得
     */
    getMessages(): Message[] {
        return this.messages;
    }
}

// module.exports = {
//     MessageStore,
// };