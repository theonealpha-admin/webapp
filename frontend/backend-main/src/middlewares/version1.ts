import { Request, Response, NextFunction } from 'express';
import { getUsers } from '../utils/users';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const users = getUsers()

    if (!authHeader) {
        res.status(401).json({ message: 'Authentication token is missing or invalid' });
        return;
    }

    try {
        const user = users.find((user: any) => user.email === authHeader);
        
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        //@ts-ignore
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
};

export default authMiddleware;