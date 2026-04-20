import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits long"),
    birthyear: z.number().int().min(1900, "Birth year must be after 1900").max(new Date().getFullYear(), "Birth year cannot be in the future")
});

export const validateSignUpData = (data: unknown) => {
    return signUpSchema.safeParse(data);
};