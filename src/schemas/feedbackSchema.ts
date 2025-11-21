import z from 'zod'

export const feedbackSchema = z.object({
    user_id: z
        .number()
        .int()
        .positive("User ID must be a positive integer"),
    message: z
        .string()
        .min(1, "Message is required")
        .max(1000, "Message must be at most 1000 characters")
})

export type FeedbackSchema = z.infer<typeof feedbackSchema>
