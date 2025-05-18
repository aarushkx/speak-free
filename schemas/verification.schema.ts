import { z } from "zod";

const VERIFICATION_CODE = {
    LENGTH: 6,
    ERRORS: {
        INVALID_LENGTH: "Verification code must have 6 digits",
        INVALID_FORMAT: "Verification code must be a number",
    },
};

export const verifySchema = z.object({
    code: z
        .string()
        .length(
            VERIFICATION_CODE.LENGTH,
            VERIFICATION_CODE.ERRORS.INVALID_LENGTH
        )
        .regex(/^\d+$/, VERIFICATION_CODE.ERRORS.INVALID_FORMAT),
});
