export interface HistoryInterface {
    isSelf: boolean;
    message: MessageInterface;
}
export interface MessageInterface {
    userId: string;
    text: string;
    datetime?: string;
    isRead?: boolean;
};

export interface SendMessageInterface {
    token: string;
    text: string;
};
export interface ReceiveMessageInterface {
    userId: string;
    text: string;
    datetime: number;
};

export interface ReceiveRoomConnectInterface {
    token: string;
};
