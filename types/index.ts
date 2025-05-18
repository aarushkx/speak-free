import { Document } from "mongoose";

export interface IMessage extends Document {
    content: string;
    createdAt: Date;
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verificationCode: string;
    verificationCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: IMessage[];
}
