import { z } from "zod";

const CONTENT = {
    MIN: 10,
    MAX: 256,
    ERRORS: {
        TOO_SHORT: "Message must be at least 10 characters long",
        TOO_LONG: "Message can not be longer than 256 characters",
    },
};

export const messageSchema = z.object({
    content: z
        .string()
        .min(CONTENT.MIN, {
            message: CONTENT.ERRORS.TOO_SHORT,
        })
        .max(CONTENT.MAX, {
            message: CONTENT.ERRORS.TOO_LONG,
        }),
});
