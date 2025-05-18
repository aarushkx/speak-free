import { SUGGESTION_MAX_TOKENS, SUGGESTION_TEMPERATURE } from "@/lib/constants";
import { SUGGESTION_PROMPT } from "@/lib/prompt";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

type THarmCategory =
    | "HARM_CATEGORY_HATE_SPEECH"
    | "HARM_CATEGORY_DANGEROUS_CONTENT"
    | "HARM_CATEGORY_HARASSMENT"
    | "HARM_CATEGORY_SEXUALLY_EXPLICIT";

type TThreshold =
    | "BLOCK_MEDIUM_AND_ABOVE"
    | "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
    | "BLOCK_LOW_AND_ABOVE"
    | "BLOCK_ONLY_HIGH"
    | "BLOCK_NONE";

type TSafetySetting = {
    category: THarmCategory;
    threshold: TThreshold;
};

const SAFETY_SETTINGS: TSafetySetting[] = [
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
];

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const generateSuggestions = async () => {
    const model = google("gemini-2.0-flash", {
        safetySettings: SAFETY_SETTINGS,
    });

    return await generateText({
        model,
        prompt: SUGGESTION_PROMPT,
        maxTokens: SUGGESTION_MAX_TOKENS,
        temperature: SUGGESTION_TEMPERATURE,
    });
};
