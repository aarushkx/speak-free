"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw, Clipboard, Check } from "lucide-react";
import { toast } from "sonner";
import { IMessage } from "@/types";
import { acceptMessagesSchema } from "@/schemas/accept-messages.schema";
import { IApiResponse } from "@/types/ApiResponse";
import MessageCard from "@/components/custom/MessageCard";

const DashboardPage = () => {
    const { data: session } = useSession();
    const user = session?.user;

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch("acceptMessages");

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<IApiResponse>(
                "/api/accept-messages"
            );
            setValue(
                "acceptMessages",
                response.data.isAcceptingMessages ?? false
            );
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ??
                    "Failed to fetch message settings"
            );
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(false);

            try {
                const response =
                    await axios.get<IApiResponse>("/api/get-messages");

                setMessages(response.data.messages || []);
                if (refresh) toast.success("Messages refreshed");
            } catch (error) {
                const axiosError = error as AxiosError<IApiResponse>;
                toast.error(
                    axiosError.response?.data.message ??
                        "Failed to fetch messages"
                );
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages]
    );

    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessages();
    }, [session, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<IApiResponse>(
                "/api/accept-messages",
                {
                    acceptMessages: !acceptMessages,
                }
            );

            setValue("acceptMessages", !acceptMessages);
            toast.success(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ??
                    "Failed to update message settings"
            );
        }
    };

    if (!session || !session.user) return null;

    const { username } = session.user;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success("URL Copied!");

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-10 bg-background px-4 py-12">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    {/* Dashboard Header */}
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-bold text-foreground"
                        >
                            Dashboard
                        </motion.h1>
                        {session && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-muted-foreground"
                            >
                                Welcome back, {user?.username || user?.email}
                            </motion.p>
                        )}
                    </div>

                    {/* Main Content Card */}
                    <Card className="border border-border rounded-lg shadow-sm">
                        <CardContent className="space-y-6 pt-6">
                            {/* Profile Link Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <h2 className="text-base font-medium text-foreground">
                                    Copy Your Unique Link
                                </h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={profileUrl}
                                        disabled
                                        className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
                                    />
                                    <Button
                                        onClick={copyToClipboard}
                                        className="flex gap-1 items-center"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Clipboard className="h-4 w-4" />
                                        )}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Message Toggle Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-3"
                            >
                                <Switch
                                    {...register("acceptMessages")}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitchLoading}
                                    className="data-[state=checked]:bg-primary"
                                />
                                <span className="text-sm text-foreground">
                                    Accept Messages:{" "}
                                    <span
                                        className={`font-medium ${acceptMessages ? "text-primary" : "text-muted-foreground"}`}
                                    >
                                        {acceptMessages ? "On" : "Off"}
                                    </span>
                                </span>
                                {isSwitchLoading && (
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                )}
                            </motion.div>

                            <Separator className="bg-border" />

                            {/* Messages Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-medium text-foreground">
                                        Messages
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fetchMessages(true);
                                        }}
                                        className="h-8 px-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <RefreshCcw className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {messages.length > 0 ? (
                                        messages.map((message, index) => (
                                            <motion.div
                                                key={message._id?.toString()}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: 0.1 * index,
                                                    duration: 0.3,
                                                }}
                                            >
                                                <MessageCard
                                                    message={message}
                                                    onMessageDelete={
                                                        handleDeleteMessage
                                                    }
                                                />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground col-span-full text-center py-8">
                                            No messages to display.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage;
