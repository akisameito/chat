export interface MessageInterface {
    text: string;
    date?: string;
};
export interface SendMessageInterface {
    publicKey: string;
    privateKey: string;
    roomId: string;
    message: MessageInterface;
};
export interface ReceiveMessageInterface {
    publicKey: string;
    message: MessageInterface;
};
export interface RoomConnectionInfoInterface {
    publicKey: string;
    privateKey: string;
    roomId: string;
    roomMembers: string[];
};
