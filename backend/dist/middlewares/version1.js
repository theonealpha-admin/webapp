"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../utils/users");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const users = (0, users_1.getUsers)();
    if (!authHeader) {
        res.status(401).json({ message: 'Authentication token is missing or invalid' });
        return;
    }
    try {
        const user = users.find((user) => user.email === authHeader);
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        //@ts-ignore
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
}
;
exports.default = authMiddleware;
