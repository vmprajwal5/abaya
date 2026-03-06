import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export const profileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"), // Usually read-only or requires re-auth
    phoneNumber: z.string().optional(),
});
