import jwt from "jsonwebtoken"

const JWT_SECRET = "93685f132a9d5691c421c4522b543eb0a8e16521be9e7028786c0b5a6d9488c4"

export const authMiddleware = (req, res, next) => {
    const reqToken = req.headers.authorization;

    if (!reqToken || !reqToken.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token" })
    }

    const token = reqToken.replace("Bearer ", "")
    // ou reqToken.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (req.method != 'POST') {
            if (decoded.sub != req.params.id) {
                return res.status(403).json({ message: "Forbidden" })
            }
            req.userID = decoded.sub
        }

        if(req.originalUrl.includes('/jobs') && decoded.role != 'company'){
            return res.status(403).json({ message: "Forbidden" })
        }

        next()

    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}