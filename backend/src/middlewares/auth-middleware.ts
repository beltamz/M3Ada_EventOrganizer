import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare module 'express-serve-static-core' {
    interface Request {
        user?: any
    }
}

const SECRET_KEY = process.env.SECRET_KEY || 'belu'

export function autenticacionToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: 'Token not provided' })
        return
    }
    
    //jwt.verify(token, SECRET_KEY, (err: Error | null, user: any) => {
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err || !user) {
            res.status(403).json({ error: 'Token not valid' })
            return
        }
        
        req.user = user
        next()
    })
}