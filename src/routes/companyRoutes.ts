import express from 'express';
import { CompanyController } from '../controllers/CompanyController.js';
import { CompanyService } from '../services/CompanyService.js';
import { CompanyRepository } from '../repository/CompanyRepository.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

router.post('/companies', companyController.createCompany.bind(companyController))
router.get('/companies/:id', authMiddleware, companyController.getCompanyById.bind(companyController))
router.patch('/companies/:id', authMiddleware, companyController.updateCompany.bind(companyController))
router.delete('/companies/:id', authMiddleware, companyController.deleteCompany.bind(companyController))

export default router;
