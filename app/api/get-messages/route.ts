import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { User as NextAuthUser } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const user: NextAuthUser = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const userId = new mongoose.Types.ObjectId(user._id);
        const foundUser = await User.findById(userId).select("messages").lean();

        if (!foundUser) {
            return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        const messages =
            foundUser.messages?.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            ) || [];

        return NextResponse.json({ messages, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { message: "Failed to fetch messages", success: false },
            { status: 500 }
        );
    }
}
