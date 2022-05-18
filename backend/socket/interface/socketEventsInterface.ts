/**
 * ソケットイベントインターフェース(clientからserver)
 */
export interface ClientToServerEventsInterface { // on
    connect: () => void;
    connect_error: () => void;
    disconnect: () => void;

    /** チャット再接続要求 */
    requestReconnectChat: () => void;
    /** チャット開始要求 */
    requestStartChat: () => void;
    /** チャット終了要求 */
    requestEndChat: () => void;
    
    /** メッセージ送信要求 */
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

    /** トークン作成通知 */
    createdToken: (params: CreatedTokenInterface) => void;

    /** チャット開始通知 */
    startedChat: (params: StartedChatInterface) => void;
    /** チャット終了通知 */
    endedChat: () => void;
    /** チャット再接続通知 */
    reconnectedChat: () => void;

    /** メッセージ受信通知 */
    receiveMessage: (params: ReceiveMessageInterface) => void;
}
export interface CreatedTokenInterface {
    token: string
}export interface StartedChatInterface {
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
    token: string;
    userId: string;
    roomId: string;
}
export interface authInterface {
    token: string;
}