import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";

export async function GET() {
    try {
        await connectToDatabase();

        const users = await User.find(
            { isVerified: true },
            { username: 1, isAcceptingMessages: 1 }
        ).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                users,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching users",
            },
            { status: 500 }
        );
    }
}
