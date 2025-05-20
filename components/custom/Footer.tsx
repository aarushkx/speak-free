"use client";

import { APP_NAME } from "@/lib/constants";
import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-4 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                © {currentYear} {APP_NAME}. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
