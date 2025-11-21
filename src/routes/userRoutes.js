import express from 'express';
const router = express.Router();
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { ApplicationController } from '../controllers/ApplicationController.js';
import { ApplicationService } from '../services/ApplicationService.js';
import { ApplicationRepository } from '../repository/ApplicationRepository.js';
import { JobService } from '../services/JobService.js';
import { JobRepository } from '../repository/JobRepository.js';
import { FeedbackService } from '../services/FeedbackService.js';
import { FeedbackRepository } from '../repository/FeedbackRepository.js';

const userController = new UserController();

const applicationRepository = new ApplicationRepository();
const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository);
const applicationService = new ApplicationService(applicationRepository);
const feedbackRepository = new FeedbackRepository();
const feedbackService = new FeedbackService(feedbackRepository);
const applicationController = new ApplicationController(applicationService, jobService, feedbackService);

router.post('/users', userController.createUser.bind(userController));
router.get('/users/:id', authMiddleware, userController.getUserByID.bind(userController));
router.get('/users/:user_id/jobs', authMiddleware, applicationController.getUserApplications.bind(applicationController));
router.patch('/users/:id', authMiddleware, userController.updateUser.bind(userController));
router.delete('/users/:id', authMiddleware, userController.deleteUser.bind(userController))

export default router;