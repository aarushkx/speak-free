"use client";

import React, { useState } from "react";
import { IApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verification.schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Loader2 } from "lucide-react";

const VerifyPage = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const [otpValue, setOtpValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const register = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true);

            const response = await axios.post<IApiResponse>(
                `/api/verify-code`,
                {
                    username: params.username,
                    code: data.code,
                }
            );

            toast.success(response.data.message);

            router.replace("/login");
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ??
                    "An error occurred. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="rounded-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Verify Your Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            A verification code has been sent to your email
                        </p>
                    </CardHeader>

                    <CardContent>
                        <Form {...register}>
                            <form
                                onSubmit={register.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    name="code"
                                    control={register.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center gap-2">
                                            <FormLabel className="text-center">
                                                Verification Code
                                            </FormLabel>
                                            <InputOTP
                                                maxLength={6}
                                                pattern={
                                                    REGEXP_ONLY_DIGITS_AND_CHARS
                                                }
                                                value={otpValue}
                                                onChange={(val) => {
                                                    setOtpValue(val);
                                                    field.onChange(val);
                                                }}
                                            >
                                                <InputOTPGroup>
                                                    {[...Array(6)].map(
                                                        (_, i) => (
                                                            <InputOTPSlot
                                                                key={i}
                                                                index={i}
                                                            />
                                                        )
                                                    )}
                                                </InputOTPGroup>
                                            </InputOTP>
                                            <div className="text-sm text-muted-foreground text-center mt-1">
                                                {otpValue === "" ? (
                                                    <>
                                                        Enter your one-time
                                                        password
                                                    </>
                                                ) : (
                                                    <>You entered: {otpValue}</>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" />
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        "Verify"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyPage;
