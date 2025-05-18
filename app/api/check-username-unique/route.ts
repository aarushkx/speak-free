import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import User from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/register.schema";

const usernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: NextRequest) {
    await connectToDatabase();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username"),
        };

        const result = usernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors =
                result.error.format().username?._errors || [];

            return NextResponse.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Username is unique",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error checking username",
            },
            { status: 500 }
        );
    }
}
