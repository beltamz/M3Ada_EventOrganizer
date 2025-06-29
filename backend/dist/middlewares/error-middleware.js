"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: "Ocurrio un error en el servidor" });
};
exports.errorMiddleware = errorMiddleware;
