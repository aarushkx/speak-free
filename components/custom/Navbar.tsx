"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { APP_NAME } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
                <div className="flex-shrink-0">
                    <Link href="/home" className="flex items-center">
                        <h1 className="text-xl font-bold text-primary">
                            {APP_NAME}
                        </h1>
                    </Link>
                </div>

                <div className="flex-shrink-0">
                    {session ? (
                        <Button
                            onClick={() => signOut()}
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10"
                        >
                            Log out
                        </Button>
                    ) : pathname === "/login" ? (
                        <Link href="/register">
                            <Button variant="outline">Register</Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline">Log in</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
