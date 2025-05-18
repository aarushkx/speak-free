import { IMessage } from "@/types";
import mongoose, { Schema } from "mongoose";

const messageSchema: Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Message =
    (mongoose.models.Message as mongoose.Model<IMessage>) ||
    mongoose.model<IMessage>("Message", messageSchema);

export default Message;
