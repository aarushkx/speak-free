"use client";

import { IApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/schemas/register.schema";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/constants";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedUsername, setDebouncedUsername] = useDebounceValue(
        username,
        300
    );

    const router = useRouter();

    const register = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        setDebouncedUsername(value);
    };

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<IApiResponse>(
                "/api/register",
                data
            );
            toast.success(response.data.message);

            router.replace(`/verify/${username}`);

            setIsSubmitting(false);
        } catch (error) {
            console.error("Failed to register user:", error);

            const axiosError = error as AxiosError<IApiResponse>;

            const errorMessage = axiosError.response?.data.message;
            ("There was a problem with your registration. Please try again.");

            toast.error(errorMessage);

            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage("");

                try {
                    const response = await axios.get<IApiResponse>(
                        `/api/check-username-unique?username=${debouncedUsername}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<IApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            "Error checking username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [debouncedUsername]);

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
                            Join <span>{APP_NAME}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create an account to receive private messages
                        </p>
                    </CardHeader>

                    <CardContent>
                        <Form {...register}>
                            <form
                                onSubmit={register.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    name="username"
                                    control={register.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleUsernameChange(e);
                                                }}
                                                required
                                                placeholder="john_doe"
                                            />
                                            {isCheckingUsername && (
                                                <div className="text-sm text-muted-foreground">
                                                    <Loader2 className="animate-spin inline mr-1" />
                                                    Checking username...
                                                </div>
                                            )}

                                            {!isCheckingUsername &&
                                                usernameMessage && (
                                                    <p
                                                        className={`text-sm ${
                                                            usernameMessage ===
                                                            "Username is unique"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {usernameMessage}
                                                    </p>
                                                )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="email"
                                    control={register.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <Input
                                                {...field}
                                                required
                                                type="email"
                                                placeholder="johndoe@example.com"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                We will send you a verification
                                                code
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="password"
                                    control={register.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <Input
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                {...field}
                                            />
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
                                            <span>Registering...</span>
                                        </div>
                                    ) : (
                                        "Register"
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary hover:underline"
                            >
                                Log in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        // <div className="flex justify-center items-center min-h-screen bg-gray-800">
        //     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        //         <div className="text-center">
        //             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        //                 Join <span>{APP_NAME}</span>
        //             </h1>
        //             <p className="mb-4">
        //                 Create an account to start your anonymous adventure
        //             </p>
        //         </div>
        //         <Form {...form}>
        //             <form
        //                 onSubmit={form.handleSubmit(onSubmit)}
        //                 className="space-y-6"
        //             >
        //                 <FormField
        //                     name="username"
        //                     control={form.control}
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Username</FormLabel>
        //                             <Input
        //                                 {...field}
        //                                 onChange={(e) => {
        //                                     field.onChange(e);
        //                                     handleUsernameChange(e);
        //                                 }}
        //                             />
        //                             {isCheckingUsername && (
        //                                 <Loader2 className="animate-spin" />
        //                             )}
        //                             {!isCheckingUsername && usernameMessage && (
        //                                 <p
        //                                     className={`text-sm ${
        //                                         usernameMessage ===
        //                                         "Username is unique"
        //                                             ? "text-green-500"
        //                                             : "text-red-500"
        //                                     }`}
        //                                 >
        //                                     {usernameMessage}
        //                                 </p>
        //                             )}
        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />
        //                 <FormField
        //                     name="email"
        //                     control={form.control}
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>E-mail</FormLabel>
        //                             <Input {...field} name="email" />
        //                             <p className="text-muted text-gray-400 text-sm">
        //                                 We will send you a verification code
        //                             </p>
        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />

        //                 <FormField
        //                     name="password"
        //                     control={form.control}
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Password</FormLabel>
        //                             <Input
        //                                 type="password"
        //                                 {...field}
        //                                 name="password"
        //                             />
        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />
        //                 <Button
        //                     type="submit"
        //                     className="w-full"
        //                     disabled={isSubmitting}
        //                 >
        //                     {isSubmitting ? (
        //                         <>
        //                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        //                             Registering...
        //                         </>
        //                     ) : (
        //                         "Register"
        //                     )}
        //                 </Button>
        //             </form>
        //         </Form>
        //         <div className="text-center mt-4">
        //             <p>
        //                 Already have an account?{" "}
        //                 <Link
        //                     href="/login"
        //                     className="text-blue-600 hover:text-blue-800"
        //                 >
        //                     Log in
        //                 </Link>
        //             </p>
        //         </div>
        //     </div>
        // </div>
    );
};

export default RegisterPage;
