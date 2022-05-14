export interface HistoryInterface {
    isSelf: boolean;
    message: MessageInterface;
}
// export interface MessageInterface {
//     userId: string;
//     text: string;
//     datetime?: string;
//     isRead?: boolean;
// };
export interface MessageInterface {
    text: string;
    unixtime: number;
    isYou: boolean;
};

export interface SendMessageInterface {
    token: string;
    text: string;
};
export interface ReceiveMessageInterface {
    text: string;
    unixtime: number;
    isYou: boolean;
};

export interface ReceiveRoomConnectInterface {
    token: string;
};
