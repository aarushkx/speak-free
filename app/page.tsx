"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { motion } from "framer-motion";
import {
    Mail,
    User,
    Lock,
    Heart,
    Sparkles,
    Circle,
    Flower,
} from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

const LandingPage = () => {
    const headings = [
        `Welcome to ${APP_NAME}!`,
        "Share your thoughts anonymously.",
        "Discover a new way to connect.",
    ];

    const features = [
        {
            icon: User,
            title: "Anonymous Messaging",
            text: "Send messages without revealing your identity. No account needed to reach someone anonymously.",
        },
        {
            icon: Mail,
            title: "Private Inbox",
            text: "Registered users get a secure inbox to view and manage all incoming messages in one place.",
        },
        {
            icon: Sparkles,
            title: "AI-Assisted Messaging",
            text: "Use AI-powered suggestions to help you write thoughtful, anonymous messages with ease.",
        },
    ];

    const steps = [
        {
            title: "For Message Recipients",
            description: [
                "Start by creating an account to receive your unique personal message link. Once registered, your public profile becomes visible to others who want to reach out to you anonymously. All incoming messages are delivered securely to your private inbox, giving you the freedom to receive honest feedback, confessions, or casual notes — all while maintaining complete privacy.",
            ],
        },
        {
            title: "For Message Senders",
            description: [
                "No account? No problem. Anyone can send a message anonymously by simply finding a user’s public profile or accessing their personal message link. It’s fast, frictionless, and completely anonymous — making it easy to share your thoughts, appreciation, or secrets without ever revealing your identity.",
            ],
        },
        {
            title: "How It Works Together",
            description: [
                "Recipients have full control over their experience — they can toggle their availability to either accept or temporarily pause incoming messages. This system ensures thoughtful interactions, allowing everyone to engage comfortably without the pressure of exposure or unwanted contact.",
            ],
        },
    ];

    const benefits = [
        {
            icon: Lock,
            title: "True Anonymity",
            text: "Your identity stays completely hidden when sending messages.",
        },
        {
            icon: Heart,
            title: "Safe Space",
            text: "Share real thoughts or feedback without worrying about being identified.",
        },
        {
            icon: Flower,
            title: "Simple & Intuitive",
            text: "Easy-to-use interface that gets you started in seconds.",
        },
    ];

    return (
        <div className="min-h-screen mt-10 bg-gradient-to-b from-background to-muted/10">
            <div className="container mx-auto px-4 py-20 flex flex-col items-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl space-y-6 mb-20"
                >
                    <h1 className="text-4xl lg:text-5xl pb-1 font-bold bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white font-sans relative z-20 tracking-tight">
                        <Typewriter
                            words={headings}
                            loop
                            cursor
                            cursorStyle="_"
                            typeSpeed={50}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        />
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        The platform for authentic, anonymous conversations
                    </p>

                    <div className="flex justify-center gap-4 pt-4">
                        <Link href="/register">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link href="/home">
                            <Button variant="outline" size="lg">
                                Explore
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-5xl w-full mb-20"
                >
                    <h2 className="text-center text-3xl font-bold mb-12">
                        Key Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center bg-white dark:bg-muted p-6 rounded-xl shadow hover:shadow-md transition-shadow"
                            >
                                <feature.icon className="h-8 w-8 text-primary mb-4" />
                                <h4 className="text-lg font-semibold mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-4xl w-full mb-20"
                >
                    <h3 className="text-center text-3xl font-bold mb-12">
                        How It Works
                    </h3>
                    <div className="relative">
                        <div className="space-y-16">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row items-center gap-6"
                                >
                                    <div className="flex-shrink-0 relative">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Circle className="h-5 w-5 text-primary fill-primary" />
                                        </div>
                                    </div>

                                    <div className="text-center md:text-left flex-1">
                                        <h4 className="font-medium text-lg mb-2">
                                            {index + 1}. {step.title}
                                        </h4>
                                        <p className="text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="max-w-4xl w-full"
                >
                    <h3 className="text-center text-3xl font-bold mb-8">
                        Why Choose {APP_NAME}?
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {benefits.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-4"
                            >
                                <div className="p-3 bg-primary/10 rounded-full mb-3">
                                    <item.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-medium mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
