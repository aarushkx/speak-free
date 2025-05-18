import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    await connectToDatabase();

    try {
        const { username, code } = await request.json();

        if (!username || !code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username and verification code are required",
                },
                { status: 400 }
            );
        }

        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const isCodeValid = user.verificationCode === code;
        const isCodeExpired =
            new Date() > new Date(user.verificationCodeExpiry);

        if (!isCodeValid && isCodeExpired) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Verification code has expired and is invalid. Please request a new one.",
                },
                { status: 400 }
            );
        }

        if (!isCodeValid) {
            return NextResponse.json(
                { success: false, message: "Invalid verification code" },
                { status: 401 }
            );
        }

        if (isCodeExpired) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Verification code has expired. Please request a new one.",
                },
                { status: 400 }
            );
        }

        user.isVerified = true;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Account verified successfully",
                data: {
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error verifying user:", error);
        return NextResponse.json(
            { success: false, message: "Error verifying user" },
            { status: 500 }
        );
    }
}
