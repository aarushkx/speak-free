import { resend } from "@/lib/resend";
import VerificationEmail from "@/app/_email/VerificationEmail";
import { IApiResponse } from "@/types/ApiResponse";
import { APP_NAME } from "@/lib/constants";

export const sendVerificationEmail = async (
    email: string,
    username: string,
    verificationCode: string
): Promise<IApiResponse> => {
    const validity = "1 hour";

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
            to: email,
            subject: `${APP_NAME} Verification Code`,
            react: VerificationEmail({
                username,
                otp: verificationCode,
                validity,
            }),
        });
        return {
            success: true,
            message: "Verification e-mail sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification e-mail:", error);
        return {
            success: false,
            message: "Failed to send verification e-mail.",
        };
    }
};
