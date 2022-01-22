import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthInfoRequest extends Request {
    userId: string;
}

export default async (req: AuthInfoRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send('No token provided');
    
    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

        req.userId = decoded._id;

        return next();
    } catch (err) {
        console.log("Invalid Token");
        return res.status(401).send('Invalid token');
    }

};
