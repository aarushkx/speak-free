"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { IMessage } from "@/types";
import { IApiResponse } from "@/types/ApiResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

type MessageCardProps = {
    message: IMessage;
    onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<IApiResponse>(
                `/api/delete-message/${message._id}`
            );

            toast.success(response.data.message);
            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ?? "Failed to delete message"
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="card-bordered">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>{message.content}</CardTitle>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="icon" variant="destructive">
                                    <Trash2 />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure you want to delete this
                                        message?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. The
                                        message will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteConfirm}
                                    >
                                        Confirm Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                        {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
                    </div>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
        </motion.div>
    );
};

export default MessageCard;
