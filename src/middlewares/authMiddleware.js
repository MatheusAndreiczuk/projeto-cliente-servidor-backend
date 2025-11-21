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
        req.userID = decoded.sub
        req.userRole = decoded.role

        const publicRoutes = [
            { path: '/jobs/search', method: 'POST' }, 
            { path: '/jobs/', method: 'GET', isParam: true }, 
        ];

        for (const route of publicRoutes) {
            if (route.isParam) {
                if (req.originalUrl.match(/^\/jobs\/\d+$/) && req.method === route.method) {
                    return next();
                }
            } else if (req.originalUrl.startsWith(route.path) && req.method === route.method) {
                return next();
            }
        }

        if (req.originalUrl.match(/^\/users\/\d+\/jobs$/) && req.method === 'GET') {
            if (decoded.role !== 'user') {
                return res.status(403).json({ message: "Forbidden" })
            }
            const userId = parseInt(req.originalUrl.split('/')[2]);
            if (userId !== decoded.sub) {
                return res.status(403).json({ message: "Forbidden" })
            }
            return next();
        }

        if (req.originalUrl.match(/^\/companies\/\d+\/jobs\/\d+$/) && req.method === 'GET') {
            if (decoded.role !== 'company') {
                return res.status(403).json({ message: "Forbidden" })
            }
            return next();
        }

        if (req.originalUrl.match(/^\/jobs\/\d+\/feedback$/) && req.method === 'POST') {
            if (decoded.role !== 'company') {
                return res.status(403).json({ message: "Forbidden" })
            }
            return next();
        }

        if (req.originalUrl.match(/^\/jobs\/\d+$/) && req.method === 'POST') {
            if (decoded.role !== 'user') {
                return res.status(403).json({ message: "Forbidden" })
            }
            return next();
        }

        if (req.originalUrl === '/jobs' && req.method === 'POST') {
            if (decoded.role !== 'company') {
                return res.status(403).json({ message: "Forbidden" })
            }
        } else if (req.originalUrl.match(/^\/jobs\/\d+$/) && (req.method === 'PATCH' || req.method === 'DELETE')) {
            if (decoded.role !== 'company') {
                return res.status(403).json({ message: "Forbidden" })
            }
        } else if (req.originalUrl.match(/^\/companies\/\d+\/jobs$/) && req.method === 'POST') {
            if (decoded.role !== 'company') {
                return res.status(403).json({ message: "Forbidden" })
            }
        }

        if ((req.method === 'PATCH' || req.method === 'DELETE') && req.params.id) {
            if (!req.originalUrl.includes('/jobs')) {
                if (decoded.sub != req.params.id) {
                    return res.status(403).json({ message: "Forbidden" })
                }
            }
        }

        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}