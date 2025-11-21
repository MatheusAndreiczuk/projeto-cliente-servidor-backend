import { Feedback } from "../models/Feedback.js"
import { FeedbackSchema } from "../schemas/feedbackSchema.js"

export class FeedbackRepository {

    constructor(){}

    async createFeedback(feedbackData: FeedbackSchema & { jobId: number; userId: number; companyId: number }){
        const feedback = await Feedback.create(feedbackData)
        return feedback ? feedback.toJSON() : null
    }

    async findByJobAndUser(jobId: number, userId: number){
        const feedbacks = await Feedback.findAll({
            where: { jobId, userId },
            order: [["createdAt", "DESC"]]
        })
        return feedbacks.map(fb => fb.toJSON())
    }

    async findByUser(userId: number){
        const feedbacks = await Feedback.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        })
        return feedbacks.map(fb => fb.toJSON())
    }
}
