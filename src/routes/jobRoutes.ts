import { JobRepository } from '../repository/JobRepository.js';
import express from 'express';
import { JobController } from '../controllers/JobController.js';
import { JobService } from '../services/JobService.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { CompanyRepository } from '../repository/CompanyRepository.js';
import { CompanyService } from '../services/CompanyService.js';
import { ApplicationController } from '../controllers/ApplicationController.js';
import { ApplicationService } from '../services/ApplicationService.js';
import { ApplicationRepository } from '../repository/ApplicationRepository.js';
import { FeedbackController } from '../controllers/FeedbackController.js';
import { FeedbackService } from '../services/FeedbackService.js';
import { FeedbackRepository } from '../repository/FeedbackRepository';

const router = express.Router();

const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository);
const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const jobController = new JobController(jobService, companyService);

const applicationRepository = new ApplicationRepository();
const applicationService = new ApplicationService(applicationRepository);

const feedbackRepository = new FeedbackRepository();
const feedbackService = new FeedbackService(feedbackRepository);

const applicationController = new ApplicationController(applicationService, jobService, feedbackService);
const feedbackController = new FeedbackController(feedbackService, jobService, applicationService);

router.post('/jobs', authMiddleware, jobController.createJob.bind(jobController))
router.post('/jobs/search', authMiddleware, jobController.getAllJobs.bind(jobController))
router.get('/jobs/:id', authMiddleware, jobController.getJobById.bind(jobController))
router.post('/jobs/:id', authMiddleware, applicationController.applyToJob.bind(applicationController))
router.post('/jobs/:job_id/feedback', authMiddleware, feedbackController.sendFeedback.bind(feedbackController))
router.patch('/jobs/:id', authMiddleware, jobController.updateJob.bind(jobController))
router.delete('/jobs/:id', authMiddleware, jobController.deleteJob.bind(jobController))

export default router;
