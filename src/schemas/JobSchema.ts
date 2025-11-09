import z from 'zod'

export const createJobSchema = z.object({
    name: z
        .string(),
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
    location: z
        .string(),
    contact: z
        .string(),
    salary: z
        .string()
        .optional()
})

export type CreateJobSchema = z.infer<typeof createJobSchema>