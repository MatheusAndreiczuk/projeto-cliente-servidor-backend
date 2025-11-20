import z from 'zod'

export const createJobSchema = z.object({
    title: z
        .string()
        .min(3)
        .max(150),
    description: z
        .string()
        .min(10)
        .max(5000),
    area: z
        .string(),
    state: z
        .string()
        .min(2)
        .max(50),
    city: z
        .string()
        .min(2)
        .max(100),
    contact: z
        .string()
        .min(3)
        .max(255)
        .optional(),
    salary: z
        .number()
        .optional()
})

export type CreateJobSchema = z.infer<typeof createJobSchema>