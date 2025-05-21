import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { User as NextAuthUser } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ messageId: string }> }
) {
    const { messageId } = await params;
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
            { $pull: { messages: { _id: messageId } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                {
                    message: "Message not found",
                    success: false,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Message deleted", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json(
            { message: "Error deleting message", success: false },
            { status: 500 }
        );
    }
}
