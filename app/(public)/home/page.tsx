"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserRound, Loader2 } from "lucide-react";
import UserProfileCard from "@/components/custom/UserProfileCard";

type UserProfile = {
    _id: string;
    username: string;
};

const HomePage = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();

                if (data.success) setUsers(data.users);
                else toast.error("Failed to fetch users' data");
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Failed to fetch users' data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin h-8 w-8" />
                    <p className="text-muted-foreground">Loading profiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 mt-10 px-16">
            <div className="mb-10 text-center">
                <motion.h1
                    className="text-2xl font-bold mb-3 text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Connect Anonymously
                </motion.h1>
                <motion.p
                    className="text-muted-foreground max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Find profiles and send anonymous messages to people in our
                    community
                </motion.p>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 rounded-lg border border-border">
                    <UserRound className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                        No Profiles Found
                    </h3>
                    <p className="text-muted-foreground">
                        There are no verified users in the directory yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <UserProfileCard key={user._id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
