"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key = process.env.JWT_SECRET || "123456";
const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ msg: "Authorization header not found" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(400).json({ msg: "Token Not Found" });
    }
    try {
        const verification = jsonwebtoken_1.default.verify(token, key);
        // @ts-ignore
        req.id = verification.id;
        next();
    }
    catch (e) {
        return res.status(400).json({ msg: "Jwt expired / Incorrect" });
    }
};
exports.default = authenticationMiddleware;
