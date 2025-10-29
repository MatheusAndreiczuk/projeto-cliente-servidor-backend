import express from 'express';
const router = express.Router();
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const userController = new UserController();

router.post('/users', userController.createUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.get('/users/:id', authMiddleware, userController.getUserByID.bind(userController));
router.patch('/users/:id', authMiddleware, userController.updateUser.bind(userController));
router.delete('/users/:id', authMiddleware, userController.deleteUser.bind(userController))
router.post('/logout', authMiddleware, userController.logoutUser.bind(userController))

export default router;