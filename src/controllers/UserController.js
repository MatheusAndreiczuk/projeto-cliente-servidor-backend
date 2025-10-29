import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";
import { UserService } from "../services/UserService.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UserController {
    constructor() {
        this.userService = new UserService();
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
            const userExists = await this.userService.loginUser(requestData)

            const hashed = await bcrypt.hash(requestData.password, 10);
            requestData.password = hashed;

            if (userExists) {
                res.status(409).json({ message: "User already exists" })
            } else {
                await this.userService.createUser(requestData);
                res.status(201).json({ message: "Created" });
            }
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ path: i.path.join('.'), message: i.message })) || []
                });
            }
            console.error('createUser error:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async loginUser(req, res) {
        const user = await this.userService.loginUser(req.body)
        const { password, username } = req.body

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" })
        }

        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '3600';

        if (!jwtSecret) {
            throw new Error("Não conseguiu pegar o jwt secret");
        }

        const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: parseInt(jwtExpiresIn) });

        res.status(200).json({ token, expires_in: parseInt(process.env.JWT_EXPIRES_IN) });
    }

    async getUserByID(req, res) {
        const reqId = req.userID;
        try {
            const user = await this.userExistsById(reqId)

            if (user == null) {
                res.status(404).json({ message: "User not found" })
            }

            delete user.id
            delete user.password
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
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
                res.status(404).json({ message: "User not found" })
            }

            const updatedUser = await this.userService.updateUser(req.userID, requestData);
            if (updatedUser) {
                res.status(200).json(updatedUser)
            }
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ path: i.path.join('.'), message: i.message })) || []
                });
            }
        }
    }

    async deleteUser(req, res) {
        const idReq = req.userID

        const user = await this.userExistsById(idReq)

        if (user == null) {
            res.status(404).json({ message: "User not found" })
        }

        const deletedMessage = await this.userService.deleteUser(idReq)
        res.status(200).json(deletedMessage)
    }

    async logoutUser(req, res) {
        res.status(200).json({ message: "OK" })
    }
}