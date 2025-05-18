import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { User as NextAuthUser } from "next-auth";

export async function POST(request: NextRequest) {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const user: NextAuthUser = session?.user;

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to update message acceptance status. User not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating message acceptance status:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error updating message acceptance status",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const foundUser = await User.findById(user._id);

        if (!foundUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving message acceptance status:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error retrieving message acceptance status",
            },
            { status: 500 }
        );
    }
}
