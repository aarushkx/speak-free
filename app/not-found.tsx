"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

const NotFoundPage = () => {
    const { data: session } = useSession();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col items-center justify-center text-center px-4"
        >
            <div className="flex items-center justify-center mb-6 mt-10">
                <Ghost className="h-12 w-12 text-muted-foreground" />
            </div>

            <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mb-6">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
            </p>

            {session ? (
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            ) : (
                <Link href="/home">
                    <Button>Go Back Home</Button>
                </Link>
            )}
        </motion.div>
    );
};

export default NotFoundPage;
