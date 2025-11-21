import { Request, Response } from 'express';
import { FeedbackService } from '../services/FeedbackService.js';
import { JobService } from '../services/JobService.js';
import { ApplicationService } from '../services/ApplicationService.js';
import { feedbackSchema } from '../schemas/feedbackSchema.js';
import { ZodError } from 'zod';

export class FeedbackController {
    constructor(
        private feedbackService: FeedbackService,
        private jobService: JobService,
        private applicationService: ApplicationService
    ) {}

    async sendFeedback(req: Request, res: Response) {
        try {
            const jobId = parseInt(req.params.job_id);
            const companyId = (req as any).userID;
            const body = req.body;
            const requestBody = feedbackSchema.parse(body);

            const job = await this.jobService.getJobById(jobId);
            if (!job) {
                return res.status(404).json({ message: 'Job or User not found' });
            }

            const application = await this.applicationService.checkExistingApplication(
                requestBody.user_id,
                jobId
            );
            if (!application) {
                return res.status(404).json({ message: 'Job or User not found' });
            }

            await this.feedbackService.createFeedback({
                message: requestBody.message,
                user_id: requestBody.user_id,
                userId: requestBody.user_id,
                jobId,
                companyId
            });

            return res.status(200).json({ message: 'Feedback sent successfully' });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ field: i.path.join('.'), error: i.message })) || []
                });
            }
            console.error('Error sending feedback:', error);
            return res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}
