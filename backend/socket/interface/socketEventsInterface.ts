/**
 * ソケットイベントインターフェース(clientからserver)
 */
export interface ClientToServerEventsInterface { // on
    connect: () => void;
    // reconnectUser: (token: string) => void; // トークン所持の場合、ルームにいれるなど。
    connect_error: () => void;
    createUser: () => void;
    disconnect: () => void;
    startChat: () => void;
    sendMessage: (params: SendMessageInterface) => void;
}
/**
 * token, text
 */
export interface SendMessageInterface {
    /** 本文 */
    text: string
}
// ----------------------------------------------------------------------------------------------------------------------
/**
 * ソケットイベントインターフェース(serverからclient)
 */
export interface ServerToClientEventsInterface {
    connect: () => void;
    // reconnectedUser: (member?: string[]) => void;// TODO メッセージ
    createdUser: () => void;
    startedChat: (params: StartedChatInterface) => void;
    waitStartChat: () => void;
    receiveMessage: (params: ReceiveMessageInterface) => void;
}
export interface StartedChatInterface {
    member: string[]
}
export interface ReceiveMessageInterface {
    userId: string,
    text: string,
    datetime: number
}
// ----------------------------------------------------------------------------------------------------------------------
export interface InterServerEventsInterface {
}
// ----------------------------------------------------------------------------------------------------------------------
/**
 * ソケットイベント時の受け渡しデータ
 */
export interface SocketDataInterface {
}