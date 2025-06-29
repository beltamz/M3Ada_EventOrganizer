"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvent = void 0;
const validateEvent = (req, res, next) => {
    const { name, place, date, hour } = req.body;
    if (!name || typeof name !== 'string') {
        res.status(400).json({ error: "Field 'name' is required. It must be a string type" });
        return;
    }
    if (!place || typeof place !== 'string') {
        res.status(400).json({ error: "Field 'place' is required. It must be a string type" });
        return;
    }
    if (!date || typeof date !== 'string') {
        res.status(400).json({ error: "Field 'date' is required. It must be a string type" });
        return;
    }
    if (!hour || typeof hour !== 'string') {
        res.status(400).json({ error: "Field 'hour'  is required. It must be a string type" });
        return;
    }
    next();
};
exports.validateEvent = validateEvent;
