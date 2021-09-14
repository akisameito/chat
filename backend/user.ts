export class User {

    privateId: string;
    publicId: string;

    constructor(socketId: string) {
        this.privateId = this.makePrivateId(socketId);
        this.publicId = this.makePubulicId(socketId);
    }

    private makePrivateId(socketId: string) {
        return socketId + "_privateId";
    }

    private makePubulicId(socketId: string) {
        return socketId + "_pubulicId";
    }
};