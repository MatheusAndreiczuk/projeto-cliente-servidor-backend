import User from "../models/User.js";
import database from "../database/db.js";

export class UserRepository {
    constructor() {}

    async createUser(userData) {
        const user = await User.create(userData);
        return user.toJSON();
    }

    async getUserById(id) {
        const user = await User.findByPk(id)
        if(!user){
            return null;
        } else {
            return user.toJSON();
        }
    }

    async updateUser(id, updateData) {
        await User.update(
            {
                name: updateData.name,
                email: updateData.email,
                password: updateData.password,
                experience: updateData.experience,
                education: updateData.education,
                phone: updateData.phone
            },
            {
                where: { id }
            }
        )
        
        const updatedUser = await User.findByPk(id);
        return updatedUser ? updatedUser.toJSON() : null;
    }

    async deleteUser(id) {
        await User.destroy({
            where: { id: id }
        })
        const message = "User deleted sucessfully"
        return {message};
    }

    async getUserByUsername(username) {
        const user = await User.findOne({
            where: { username }
        })
        return user ? user.toJSON() : null;
    }
}