/**
 * ソケットイベントインターフェース(clientからserver)
 */
export interface ClientToServerEventsInterface { // on
    connect: () => void;
    // reconnectUser: (token: string) => void; // トークン所持の場合、ルームにいれるなど。
    connect_error: () => void;
    createUser: () => void;
    disconnect: () => void;
    startChat: (params: StartChatInterface) => void;
    sendMessage: (params: SendMessageInterface) => void;
}
export interface StartChatInterface {
    /** トークン */
    token: string,
}
/**
 * token, text
 */
export interface SendMessageInterface {
    /** トークン */
    token: string,
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
    createdUser: (params: CreatedUserInterface) => void;
    startedChat: (params: StartedChatInterface) => void;
    waitStartChat: () => void;
    receiveMessage: (params: ReceiveMessageInterface) => void;
}
export interface CreatedUserInterface {
    /** トークン */
    token: string
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
    token: string;
}