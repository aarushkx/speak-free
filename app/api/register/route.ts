import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { sendVerificationEmail } from "@/services/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    await connectToDatabase();

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await User.findOne({ email });

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "User already exists with this e-mail",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verificationCode = verificationCode;
                existingUserByEmail.verificationCodeExpiry = new Date(
                    Date.now() + 3600000
                ); // 1 hour

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verificationCode: verificationCode,
                verificationCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verificationCode
        );
        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "User registered successfully. We have sent you an email to verify your account.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to register user",
            },
            { status: 500 }
        );
    }
}
