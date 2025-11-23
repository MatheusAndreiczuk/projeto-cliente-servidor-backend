import { UserRepository } from "../repository/UserRepository.js";
import bcrypt from 'bcrypt'

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(userData, companyService) {
        const userExists = await this.userRepository.getUserByUsername(userData.username)
        const companyUsernameExists = companyService ? await companyService.getCompanyByUsername(userData.username) : null

        if (userExists || companyUsernameExists) {
            throw new Error("Username already exists")
        }

        const hashed = await bcrypt.hash(userData.password, 10);
        userData.password = hashed;

        const createdUser = await this.userRepository.createUser(userData);
        return createdUser;
    }

    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        return user;
    }

    async updateUser(id, updateData){
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new Error("User not found")
        }

        const passwordHashed = await bcrypt.hash(updateData.password, 10)
        updateData.password = passwordHashed

        const updatedUser = await this.userRepository.updateUser(id, updateData);
        return updatedUser;
    }

    async deleteUser(id){
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new Error("User not found")
        }

        const message = await this.userRepository.deleteUser(id);
        return message;
    }

    async getUserByUsername(username){
        const user = await this.userRepository.getUserByUsername(username);
        return user;
    }
}