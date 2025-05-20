import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest) {
    await connectToDatabase();

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const deletedUser = await User.findOneAndDelete({
            email: session.user.email,
        });

        if (!deletedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Account deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete account",
            },
            { status: 500 }
        );
    }
}
