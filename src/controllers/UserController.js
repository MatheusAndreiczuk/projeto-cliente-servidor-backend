import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";
import { UserService } from "../services/UserService.js";
import { CompanyService } from "../services/CompanyService.js";
import { CompanyRepository } from "../repository/CompanyRepository.js";

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

            await this.userService.createUser(requestData, this.companyService);
            return res.status(201).json({ message: "Created" });
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ path: i.path.join('.'), error: i.message })) || []
                });
            }
            if (error.message === "Username already exists") {
                return res.status(409).json({ message: "Username already exists" })
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

            const updatedUser = await this.userService.updateUser(req.userID, requestData);
            if (updatedUser) {
                return res.status(200).json()
            }
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ path: i.path.join('.'), error: i.message })) || []
                });
            }
            if (error.message === "User not found") {
                return res.status(404).json({ message: "User not found" })
            }
            return res.status(500).json({ message: error.message })
        }
    }

    async deleteUser(req, res) {
        try {
            const idReq = req.userID
            const deletedMessage = await this.userService.deleteUser(idReq)
            return res.status(200).json(deletedMessage)
        } catch (error) {
            if (error.message === "User not found") {
                return res.status(404).json({ message: "User not found" })
            }
            return res.status(500).json({ message: error.message })
        }
    }
}