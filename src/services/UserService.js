import { UserRepository } from "../repository/UserRepository.js";

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(userData) {
        const createdUser = await this.userRepository.createUser(userData);
        return createdUser;
    }

    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        return user;
    }

    async updateUser(id, updateData){
        const updatedUser = await this.userRepository.updateUser(id, updateData);
        return updatedUser;
    }

    async deleteUser(id){
        const message = await this.userRepository.deleteUser(id);
        return message;
    }

    async loginUser(username){
        const user = await this.userRepository.loginUser(username);
        return user;
    }
}