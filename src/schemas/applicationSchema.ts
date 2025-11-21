import z from 'zod'

export const applicationSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),
    email: z
        .email("Invalid email")
        .or(z.literal(''))
        .nullish(),
    phone: z
        .string()
        .or(z.literal(''))
        .nullish(),
    education: z
        .string()
        .min(1, "Education is required")
        .max(600, "Education must be at most 600 characters"),
    experience: z
        .string()
        .min(1, "Experience is required")
        .max(600, "Experience must be at most 600 characters")
})

export type ApplicationSchema = z.infer<typeof applicationSchema>
