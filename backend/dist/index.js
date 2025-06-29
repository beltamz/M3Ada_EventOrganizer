"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const events_routes_1 = __importDefault(require("./routes/events-routes"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const error_middleware_1 = require("./middlewares/error-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
app.use('/events', events_routes_1.default);
app.use('/users', auth_routes_1.default);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
});
app.use(error_middleware_1.errorMiddleware);
const PORT = process.env.PORT || 3000;
// DEBUG: Mostrar rutas registradas
const listRoutes = (prefix, router) => {
    router.stack.forEach((layer) => {
        if (layer.route && layer.route.path) {
            console.log(`${prefix}${layer.route.path}`);
        }
    });
};
console.log("📋 Rutas en /events:");
listRoutes('/events', events_routes_1.default);
console.log("📋 Rutas en /users:");
listRoutes('/users', auth_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
