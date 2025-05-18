import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { IMessage } from "@/types";

export async function POST(request: NextRequest) {
    await connectToDatabase();

    const { username, content } = await request.json();

    if (!username || !content) {
        return NextResponse.json(
            { message: "Username and content are required", success: false },
            { status: 400 }
        );
    }

    try {
        const user = await User.findOne({ username }).exec();

        if (!user) {
            return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessages) {
            return NextResponse.json(
                { message: "User is not accepting messages", success: false },
                { status: 403 }
            );
        }

        const newMessage = { content, createdAt: new Date() };

        user.messages.push(newMessage as IMessage);

        await user.save();

        return NextResponse.json(
            { message: "Message sent successfully", success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding message:", error);
        return NextResponse.json(
            { message: "Failed to add message", success: false },
            { status: 500 }
        );
    }
}
