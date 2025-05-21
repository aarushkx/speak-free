"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { IApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [usernameInput, setUsernameInput] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
        toast.success("Logged out successfully");
    };

    const deleteAccount = async () => {
        try {
            const response = await axios.delete<IApiResponse>(
                "/api/delete-account"
            );

            toast.success(response.data.message);

            if (response.data.success) await signOut({ callbackUrl: "/" });
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast.error(
                axiosError.response?.data.message ??
                    "Failed to delete account. Please try again."
            );
        }
    };

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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1">
                                        {/* Mobile */}
                                        <Settings className="h-4 w-4 sm:hidden" />

                                        {/* Desktop */}
                                        <span className="hidden sm:inline-flex items-center gap-1">
                                            Account
                                            <ChevronDown className="h-4 w-4" />
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <AlertDialog
                                        open={logoutDialogOpen}
                                        onOpenChange={setLogoutDialogOpen}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                Log out
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you sure you want to
                                                    logout?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    You will need to login again
                                                    to access your account.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleLogout}
                                                >
                                                    Confirm Logout
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog
                                        open={deleteDialogOpen}
                                        onOpenChange={setDeleteDialogOpen}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                Delete Account
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you sure you want to
                                                    delete your account?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete your
                                                    account and all associated
                                                    data.
                                                    <br />
                                                    To confirm, please type your
                                                    username{" "}
                                                    <span className="font-bold">
                                                        {session?.user.username}
                                                    </span>{" "}
                                                    below.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <div className="my-4">
                                                <Input
                                                    placeholder="Type your username"
                                                    value={usernameInput}
                                                    onChange={(e) =>
                                                        setUsernameInput(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {usernameInput !==
                                                    session?.user.username &&
                                                    usernameInput && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            Usernames do not
                                                            match
                                                        </p>
                                                    )}
                                            </div>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    onClick={() =>
                                                        setUsernameInput("")
                                                    }
                                                >
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={deleteAccount}
                                                    className="bg-destructive hover:bg-destructive/90"
                                                    disabled={
                                                        usernameInput !==
                                                        session?.user.username
                                                    }
                                                >
                                                    Delete Account
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
