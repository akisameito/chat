/**
 * ソケットイベントインターフェース(clientからserver)
 */
export interface ClientToServerEventsInterface { // on
    connect: () => void;
    // reconnectUser: (token: string) => void; // トークン所持の場合、ルームにいれるなど。
    connect_error: () => void;
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
    
    createdToken: () => void;
    startedChat: (params: StartedChatInterface) => void;
    receiveMessage: (params: ReceiveMessageInterface) => void;
    // reconnectedUser: (member?: string[]) => void;// TODO メッセージ
}
export interface StartedChatInterface {
    member: string[]
}
export interface ReceiveMessageInterface {
    text: string,
    unixtime: number,
    isYou: boolean,
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