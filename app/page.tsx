"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 text-center">
            <h1 className="text-4xl font-bold">Welcome to {APP_NAME}</h1>

            <div className="max-w-md space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                        Send Anonymous Messages
                    </h2>
                    <p className="text-muted-foreground">
                        Share your thoughts secretly with anyone
                    </p>
                    <Link href="/home">
                        <Button className="mt-4">Browse Users</Button>
                    </Link>
                </div>

                <div className="border-t pt-6 space-y-4">
                    <h2 className="text-2xl font-semibold">
                        Get Anonymous Messages
                    </h2>
                    <p className="text-muted-foreground">
                        Create your profile to start receiving secret messages
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/register">
                            <Button variant="default">Create Account</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
