import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
    email: z.email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits long"),
    birthYear: z.number().int().min(1900, "Birth year must be after 1900").max(new Date().getFullYear(), "Birth year cannot be in the future"),
    gender: z.string().min(2, "Please provide a gender").max(20, "Gender must be at most 20 characters long")
});

export const validateSignUpData = (data: unknown) => {
    return signUpSchema.safeParse(data);
};