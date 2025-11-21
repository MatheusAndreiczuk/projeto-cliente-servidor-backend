import express from 'express';
import { CompanyController } from '../controllers/CompanyController.js';
import { CompanyService } from '../services/CompanyService.js';
import { UserService } from '../services/UserService.js';
import { CompanyRepository } from '../repository/CompanyRepository.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { JobController } from '../controllers/JobController.js';
import { JobService } from '../services/JobService.js';
import { JobRepository } from '../repository/JobRepository.js';
import { ApplicationController } from '../controllers/ApplicationController.js';
import { ApplicationService } from '../services/ApplicationService.js';
import { ApplicationRepository } from '../repository/ApplicationRepository.js';
import { FeedbackService } from '../services/FeedbackService.js';
import { FeedbackRepository } from '../repository/FeedbackRepository.js';

const router = express.Router();

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const userService = new UserService()
const companyController = new CompanyController(companyService, userService);

const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository);
const jobController = new JobController(jobService, companyService);

const applicationRepository = new ApplicationRepository();
const applicationService = new ApplicationService(applicationRepository);
const feedbackRepository = new FeedbackRepository();
const feedbackService = new FeedbackService(feedbackRepository);
const applicationController = new ApplicationController(applicationService, jobService, feedbackService);

router.post('/companies', companyController.createCompany.bind(companyController))
router.get('/companies/:id', authMiddleware, companyController.getCompanyById.bind(companyController))
router.post('/companies/:id/jobs', authMiddleware, jobController.getJobsByCompanyId.bind(jobController))
router.get('/companies/:company_id/jobs/:job_id', authMiddleware, applicationController.getJobApplications.bind(applicationController))
router.patch('/companies/:id', authMiddleware, companyController.updateCompany.bind(companyController))
router.delete('/companies/:id', authMiddleware, companyController.deleteCompany.bind(companyController))

export default router;
