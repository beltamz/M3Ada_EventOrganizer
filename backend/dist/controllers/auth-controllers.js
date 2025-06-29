"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataBasePath = path_1.default.join(__dirname, '../database/users.json');
const SECRET_KEY = process.env.SECRET_KEY || 'belu';
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'The user didnt complete one or both field(s)' });
        return;
    }
    const database = JSON.parse(fs_1.default.readFileSync(dataBasePath, 'utf-8'));
    const userExists = database.find((user) => user.email === email);
    if (userExists) {
        res.status(400).json({ error: 'The user provided is already registered' });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword };
    database.push(newUser);
    fs_1.default.writeFileSync(dataBasePath, JSON.stringify(database, null, 2));
    res.status(201).json({ message: 'User registered successfully' });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'The user didnt complete one or both field(s)' });
        return;
    }
    const database = JSON.parse(fs_1.default.readFileSync(dataBasePath, 'utf-8'));
    const user = database.find((user) => user.email === email);
    if (!user) {
        res.status(400).json({ error: 'User not found' });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ error: 'Incorrect password' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Session started successfully.', token });
});
exports.loginUser = loginUser;
const getProfile = (req, res) => {
    res.json({ message: `Welcome ${req.user.email}`, user: req.user });
};
exports.getProfile = getProfile;
