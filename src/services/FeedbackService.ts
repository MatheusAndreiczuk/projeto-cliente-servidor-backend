import { FeedbackRepository } from "../repository/FeedbackRepository.js"
import { FeedbackSchema } from "../schemas/feedbackSchema.js"

export class FeedbackService {

    constructor(private repository: FeedbackRepository){}

    async createFeedback(feedbackData: FeedbackSchema & { jobId: number; userId: number; companyId: number }){
        const createdFeedback = await this.repository.createFeedback(feedbackData)
        return createdFeedback
    }

    async getFeedbacksByJobAndUser(jobId: number, userId: number){
        const feedbacks = await this.repository.findByJobAndUser(jobId, userId)
        return feedbacks
    }

    async getFeedbacksByUser(userId: number){
        const feedbacks = await this.repository.findByUser(userId)
        return feedbacks
    }
}
