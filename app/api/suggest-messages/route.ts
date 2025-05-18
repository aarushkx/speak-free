import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions } from "@/services/ai-service";

export async function POST(request: NextRequest) {
    try {
        const { text } = await generateSuggestions();
        const suggestions = text.split("||");

        return NextResponse.json({ success: true, suggestions });
    } catch (error) {
        console.log("Suggestion generation failed:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to generate suggestions",
        });
    }
}
