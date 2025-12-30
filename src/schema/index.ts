import z from "zod";

export const signUpSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type SignUpData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInData = z.infer<typeof signInSchema>;

export const MaterialRequestSchema = z.object({
    material_name: z.string().min(2, 'Material name is required').max(200),
    quantity: z.coerce.number().positive('Quantity must be positive').default(1),
    unit: z.string().min(1, 'Unit is required').default('pieces'),
    priority: z
        .enum(['low', 'medium', 'high', 'urgent'])
        .default('medium'),
    project_id: z.string().optional().default(''),
    notes: z.string().max(1000).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'delivered']).default("pending")
});

export type MaterialRequestValues = z.infer<typeof MaterialRequestSchema>;