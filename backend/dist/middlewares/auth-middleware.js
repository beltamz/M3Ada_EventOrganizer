"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticacionToken = autenticacionToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || 'belu';
function autenticacionToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Token not provided' });
        return;
    }
    //jwt.verify(token, SECRET_KEY, (err: Error | null, user: any) => {
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err || !user) {
            res.status(403).json({ error: 'Token not valid' });
            return;
        }
        req.user = user;
        next();
    });
}
