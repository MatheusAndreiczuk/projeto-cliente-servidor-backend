import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";
import { UserService } from "../services/UserService.js";
import { CompanyService } from "../services/CompanyService.js";
import { CompanyRepository } from "../repository/CompanyRepository.js";
import bcrypt from 'bcrypt'

export class UserController {
    constructor() {
        this.userService = new UserService();
        const companyRepository = new CompanyRepository();
        this.companyService = new CompanyService(companyRepository);
    }

    async userExistsById(id) {
        const user = await this.userService.getUserById(id)
        if (user != null) {
            return user
        } else {
            return null
        }
    }

    async createUser(req, res) {
        try {
            const body = { ...req.body };
            const requestData = createUserSchema.parse(body);
            const userExists = await this.userService.getUserByUsername(requestData.username)
            const companyUsernameExists = await this.companyService.getCompanyByUsername(requestData.username)

            if (userExists || companyUsernameExists) {
                return res.status(409).json({ message: "Username already exists" })
            }

            const hashed = await bcrypt.hash(requestData.password, 10);
            requestData.password = hashed;

            await this.userService.createUser(requestData);
            return res.status(201).json({ message: "Created" });
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ path: i.path.join('.'), message: i.message })) || []
                });
            }
            console.error('createUser error:', error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getUserByID(req, res) {
        const reqId = req.userID;
        try {
            const user = await this.userExistsById(reqId)

            if (user == null) {
                return res.status(404).json({ message: "User not found" })
            }

            delete user.id
            delete user.password
            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async updateUser(req, res) {
        try {
            const body = { ...req.body }
            const requestData = updateUserSchema.parse(body)
            const passwordHashed = await bcrypt.hash(requestData.password, 10)
            requestData.password = passwordHashed

            const user = await this.userExistsById(req.userID)

            if (user == null) {
                return res.status(404).json({ message: "User not found" })
            }

            const updatedUser = await this.userService.updateUser(req.userID, requestData);
            if (updatedUser) {
                return res.status(200).json()
            }
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ path: i.path.join('.'), message: i.message })) || []
                });
            }
            return res.status(500).json({ message: error.message })
        }
    }

    async deleteUser(req, res) {
        const idReq = req.userID

        const user = await this.userExistsById(idReq)

        if (user == null) {
            return res.status(404).json({ message: "User not found" })
        }

        const deletedMessage = await this.userService.deleteUser(idReq)
        return res.status(200).json(deletedMessage)
    }
}