import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { User as NextAuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest) {
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
        const result = await User.updateOne(
            { _id: user._id },
            { $set: { messages: [] } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                {
                    message: "No messages found or already empty",
                    success: false,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "All messages deleted successfully",
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting messages:", error);
        return NextResponse.json(
            {
                message: "Error deleting messages",
                success: false,
            },
            { status: 500 }
        );
    }
}
