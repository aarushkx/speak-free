import { z } from "zod";

const USERNAME = {
    MIN: 3,
    MAX: 20,
    REGEX: /^[a-z0-9_]+$/,
    ERRORS: {
        TOO_SHORT: "Username must be at least 3 characters long",
        TOO_LONG: "Username can not be longer than 20 characters",
        INVALID_CHARS:
            "Username can only contain lowercase letters, numbers, and underscores",
    },
};

const PASSWORD = {
    MIN: 6,
    ERROR: "Password must be at least 6 characters long",
};

const EMAIL = {
    ERROR: "Invalid email address",
};

const CONFIRM_PASSWORD = {
    ERROR: "Passwords do not match",
};

export const usernameValidation = z
    .string()
    .min(USERNAME.MIN, USERNAME.ERRORS.TOO_SHORT)
    .max(USERNAME.MAX, USERNAME.ERRORS.TOO_LONG)
    .regex(USERNAME.REGEX, USERNAME.ERRORS.INVALID_CHARS);

export const registerSchema = z
    .object({
        username: usernameValidation,
        email: z.string().email(EMAIL.ERROR),
        password: z.string().min(PASSWORD.MIN, PASSWORD.ERROR),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: CONFIRM_PASSWORD.ERROR,
        path: ["confirmPassword"],
    });
