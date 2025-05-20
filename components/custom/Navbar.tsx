"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { APP_NAME } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ToggleTheme from "./ToggleTheme";
import { Button } from "@/components/ui/button";
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

                <div className="flex items-center gap-2">
                    <ToggleTheme />
                    {session ? (
                        <>
                            <Link
                                href={
                                    pathname === "/dashboard"
                                        ? "/home"
                                        : "/dashboard"
                                }
                            >
                                <Button variant="outline">
                                    {pathname === "/dashboard"
                                        ? "Home"
                                        : "Dashboard"}
                                </Button>
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-destructive hover:bg-destructive/10"
                                    >
                                        Log out
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure you want to logout?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You will need to login again to
                                            access your account.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => signOut()}
                                        >
                                            Confirm Logout
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
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
