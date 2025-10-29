import User from "../models/User.js";
import database from "../database/db.js";

export class UserRepository {
    constructor() {
        database.sync().catch((err) => {
            console.error("Database sync failed:", err);
        });
    }

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
        const [rowsAffected, [dataAffected]] = await User.update(
            {
                name: updateData.name,
                email: updateData.email,
                password: updateData.password,
                experience: updateData.experience,
                education: updateData.education,
                phone: updateData.phone
            },
            {
                where: { id },
                returning: true
            },
        )
        const updatedUser = dataAffected;
        return updatedUser;
    }

    async deleteUser(id) {
        await User.destroy({
            where: { id: id }
        })
        const message = "User deleted sucessfully"
        return {message};
    }

    async loginUser(userData) {
        const { username, password } = userData;
        const user = await User.findOne({
            where: { username: username }
        })

        return user;
    }
}