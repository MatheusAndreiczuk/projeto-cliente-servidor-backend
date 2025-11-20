import express from 'express';
import userRoutes from './userRoutes.js';
import companyRoutes from './companyRoutes.js';
import jobRoutes from './jobRoutes.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { LoginController } from '../controllers/LoginController.js';
import { UserService } from '../services/UserService.js';
import { CompanyService } from '../services/CompanyService.js';
import { CompanyRepository } from '../repository/CompanyRepository.js';

const companyRepository = new CompanyRepository();
const userService = new UserService();
const companyService = new CompanyService(companyRepository);

const loginController = new LoginController(userService, companyService);

const router = express.Router();

router.post('/logout', authMiddleware, loginController.logout.bind(loginController));
router.post('/login', loginController.login.bind(loginController));

router.use(userRoutes);

router.use(companyRoutes);

router.use(jobRoutes);

export default router;
