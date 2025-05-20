"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardContent, Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { IApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/message.schema";
import { motion } from "framer-motion";
import { SUGGESTION_TEMPLATE } from "@/lib/constants";

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split("||");
};

const MessagePage = () => {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const [completion, setCompletion] = useState("");
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch("content");

    const handleMessageClick = (message: string) => {
        form.setValue("content", message);
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);

        try {
            const response = await axios.post<IApiResponse>(
                "/api/send-message",
                { ...data, username }
            );

            toast.success(response.data.message);
            form.reset({ ...form.getValues(), content: "" });
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ?? "Failed to send message"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        setIsSuggestLoading(true);
        setError(null);

        try {
            const response = await axios.post<{ suggestions: string[] }>(
                "/api/suggest-messages"
            );
            setCompletion(response.data.suggestions.join("||"));
        } catch (error) {
            setError(error as Error);
            toast.error("Failed to fetch suggestions");
        } finally {
            setIsSuggestLoading(false);
        }
    };

    useEffect(() => {
        const index = Math.floor(Math.random() * SUGGESTION_TEMPLATE.length);
        setCompletion(SUGGESTION_TEMPLATE[index]);
    }, []);

    return (
        <div className="min-h-screen mt-10 bg-gradient-to-b from-background to-muted/20 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl mx-auto space-y-8"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                        Public Profile of @<span>{username}</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Send anonymous messages to @{username}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border border-border/50 rounded-xl shadow-md backdrop-blur-sm bg-card/70">
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="What would you like to tell them?"
                                                        className="min-h-32 text-lg border-border/50 bg-background/50 hover:bg-background/70 transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex flex-col sm:flex-row gap-3"
                                    >
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all"
                                            disabled={
                                                isLoading || !messageContent
                                            }
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="h-4 w-4" />
                                                    Send Anonymously
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={fetchSuggestedMessages}
                                            variant="outline"
                                            size="lg"
                                            className="w-full sm:w-auto border-border/50 hover:bg-accent/50"
                                            disabled={isSuggestLoading}
                                        >
                                            {isSuggestLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Generating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-4 w-4" />
                                                    Get Suggestions
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>

                {completion && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {parseStringMessages(completion).map(
                            (message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.6 + index * 0.1,
                                        duration: 0.3,
                                    }}
                                >
                                    <Card
                                        className="h-16 border-border/30 bg-card/50 hover:bg-card/70 transition-colors cursor-pointer flex items-center justify-center"
                                        onClick={() =>
                                            handleMessageClick(message)
                                        }
                                    >
                                        <CardContent className="p-3 text-sm text-muted-foreground w-full">
                                            {message}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        )}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Separator className="my-8 bg-border/30" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center"
                >
                    <Link href="/register">
                        <Button
                            variant="ghost"
                            className="text-primary hover:bg-primary/10 text-lg font-medium"
                        >
                            Create your own message board →
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MessagePage;
