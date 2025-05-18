// import { z } from "zod";

// export const usernameValidation = z
//     .string()
//     .min(2, "Username must be at least 2 characters")
//     .max(20, "Username must be no more than 20 characters")
//     .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

// export const signUpSchema = z.object({
//     username: usernameValidation,

//     email: z.string().email({ message: "Invalid email address" }),
//     password: z
//         .string()
//         .min(6, { message: "Password must be at least 6 characters" }),
// });

import { z } from "zod";

const USERNAME = {
    MIN: 3,
    MAX: 20,
    REGEX: /^[a-zA-Z0-9_]+$/,
    ERRORS: {
        TOO_SHORT: "Username must be at least 3 characters long",
        TOO_LONG: "Username can not be longer than 20 characters",
        INVALID_CHARS: "Username can not contain special characters",
    },
};

const PASSWORD = {
    MIN: 6,
    ERROR: "Password must be at least 6 characters long",
};

const EMAIL = {
    ERROR: "Invalid email address",
};

export const usernameValidation = z
    .string()
    .min(USERNAME.MIN, USERNAME.ERRORS.TOO_SHORT)
    .max(USERNAME.MAX, USERNAME.ERRORS.TOO_LONG)
    .regex(USERNAME.REGEX, USERNAME.ERRORS.INVALID_CHARS);

export const registerSchema = z.object({
    username: usernameValidation,
    email: z.string().email(EMAIL.ERROR),
    password: z.string().min(PASSWORD.MIN, PASSWORD.ERROR),
});
