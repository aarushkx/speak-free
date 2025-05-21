import mongoose, { Schema } from "mongoose";
import { IUser } from "@/types";
import { messageSchema } from "./message.model";

const userSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        verificationCode: {
            type: String,
            required: [true, "Verification code is required"],
        },
        verificationCodeExpiry: {
            type: Date,
            required: [true, "Verification code expiry is required"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAcceptingMessages: {
            type: Boolean,
            default: true,
        },
        messages: {
            type: [messageSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const User =
    (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", userSchema);

export default User;
