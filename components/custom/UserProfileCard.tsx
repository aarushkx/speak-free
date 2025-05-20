"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRound, Link2, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type UserProfileCardProps = {
    user: {
        _id: string;
        username: string;
        isAcceptingMessages: boolean;
    };
};

const UserProfileCard = ({ user }: UserProfileCardProps) => {
    const copyProfileUrl = (username: string) => {
        const profileUrl = `${window.location.protocol}//${window.location.host}/u/${username}`;
        navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied to clipboard!");
    };

    return (
        <motion.div
            key={user._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Card className="h-full border-border bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg max-w-full">
                        <span className="bg-secondary rounded-full p-1.5 shrink-0">
                            <UserRound className="h-4 w-4 text-secondary-foreground" />
                        </span>
                        <span className="truncate max-w-[180px] sm:max-w-[180px]">
                            @{user.username}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                            className={
                                user.isAcceptingMessages
                                    ? "text-green-600"
                                    : "text-red-600"
                            }
                        >
                            {user.isAcceptingMessages ? "On" : "Off"}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Send anonymous messages and connect with @
                        {user.username}
                    </p>
                    <div className="flex flex-col space-y-2">
                        <Link
                            href={`/u/${user.username}`}
                            passHref
                            className="w-full"
                        >
                            <Button variant="default" className="w-full">
                                <Eye className="h-4 w-4" /> View Profile
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => copyProfileUrl(user.username)}
                            className="w-full border-border"
                        >
                            <Link2 className="h-4 w-4" /> Share Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default UserProfileCard;
