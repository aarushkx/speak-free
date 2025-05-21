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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, RefreshCcw, Clipboard, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { IMessage } from "@/types";
import { acceptMessagesSchema } from "@/schemas/accept-messages.schema";
import { IApiResponse } from "@/types/ApiResponse";
import MessageCard from "@/components/custom/MessageCard";

const DashboardPage = () => {
    const { data: session } = useSession();
    const user = session?.user;

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDeletingAllMessages, setIsDeletingAllMessages] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const handleDeleteAllMessages = async () => {
        try {
            setIsDeletingAllMessages(true);
            const response = await axios.delete<IApiResponse>(
                "/api/delete-all-messages"
            );

            if (response.data.success) {
                setMessages([]);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ?? "Failed to delete messages"
            );
        } finally {
            setIsDeletingAllMessages(false);
        }
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
            setIsRefreshing(true);
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
                setIsRefreshing(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsRefreshing, setMessages]
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
        <div className="min-h-screen mt-10 bg-background px-4 py-12">
            <div className="mx-auto max-w-5xl">
                {/* Main Container */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            Dashboard
                        </h1>
                        {session && (
                            <p className="text-muted-foreground">
                                Welcome back, {user?.username || user?.email}
                            </p>
                        )}
                    </div>

                    {/* Card Container */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border border-border rounded-lg shadow-sm">
                            <CardContent className="space-y-6 pt-6">
                                {/* Profile Link Section */}
                                <div className="space-y-2">
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
                                </div>

                                {/* Message Toggle Section */}
                                <div className="flex items-center gap-3">
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
                                </div>
                                <Separator className="bg-border" />

                                {/* Messages Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-base font-medium text-foreground">
                                            Messages
                                        </h2>
                                        <div className="flex gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={
                                                            messages.length ===
                                                                0 ||
                                                            isDeletingAllMessages
                                                        }
                                                        className="h-8 px-2"
                                                    >
                                                        {isDeletingAllMessages ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete all messages?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This cannot be
                                                            undone and will
                                                            permanently delete
                                                            all messages.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={
                                                                handleDeleteAllMessages
                                                            }
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            {isDeletingAllMessages ? (
                                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            ) : null}
                                                            Delete All
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    fetchMessages(true);
                                                }}
                                                className="h-8 px-2"
                                                disabled={isRefreshing}
                                            >
                                                {isRefreshing ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <RefreshCcw className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Messages List */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {messages.length > 0 ? (
                                            messages.map((message) => (
                                                <MessageCard
                                                    key={message._id?.toString()}
                                                    message={message}
                                                    onMessageDelete={
                                                        handleDeleteMessage
                                                    }
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground col-span-full text-center py-8">
                                                No messages to display.
                                            </p>
                                        )}
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage;
