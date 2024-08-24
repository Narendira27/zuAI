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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const middleware_1 = __importDefault(require("./middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const key = process.env.JWT_SECRET || "123456";
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// auth routes
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.name || !body.email || !body.password) {
        return res.status(400).json({ msg: "Required Inputs not found" });
    }
    const registerSchema = zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    });
    const parseSchema = registerSchema.safeParse(body);
    if (!parseSchema.success) {
        return res.status(400).json({ msg: parseSchema.error.issues[0].message });
    }
    const hash = bcrypt_1.default.hashSync(body.password, 10);
    try {
        const response = yield prisma.user.create({
            data: { name: body.name, email: body.email, password: hash },
        });
        return res.status(200).json({ msg: "User Registered, Login to Continue" });
    }
    catch (e) {
        return res
            .status(400)
            .json({ msg: "Something Went Wrong Try Again Later" });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.email || !body.password) {
        return res.status(400).json({ msg: "Required Inputs not found" });
    }
    const loginSchema = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    });
    const parseSchema = loginSchema.safeParse(body);
    if (!parseSchema.success) {
        return res.status(400).json({ msg: parseSchema.error.issues[0].message });
    }
    try {
        const response = yield prisma.user.findUnique({
            where: { email: body.email },
        });
        if (response) {
            const passwordCheck = bcrypt_1.default.compareSync(body.password, response.password);
            if (passwordCheck) {
                const token = jsonwebtoken_1.default.sign({ id: response.id }, key);
                return res.json({ token });
            }
            return res.status(400).send("Incorrect Password");
        }
        return res.status(200).json({ msg: "User Not found" });
    }
    catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ msg: "Something Went Wrong Try Again Later" });
    }
}));
// protected routes
app.get("/posts", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.post.findMany({});
        return res.status(200).json({ data: response });
    }
    catch (e) {
        return res.status(400).json({ msg: e.message });
    }
}));
app.get("/posts/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield prisma.post.findFirst({ where: { id } });
        return res.status(200).json({ data: Object.assign({}, response) });
    }
    catch (e) {
        return res.status(400).json({ msg: e.message });
    }
}));
app.post("/posts", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.title || !body.description || !body.category) {
        return res.status(400).json({ msg: "Required Inputs not Found" });
    }
    const requestSchema = zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        category: zod_1.z.string(),
    });
    const parseSchema = requestSchema.safeParse(body);
    if (!parseSchema.success) {
        return res.status(400).json({ msg: parseSchema.error.issues[0].message });
    }
    try {
        const response = yield prisma.post.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                // @ts-ignore
                authorId: req.id,
            },
        });
        return res.status(200).json({ msg: "Post Created Successfully" });
    }
    catch (e) {
        return res.status(400).json({ msg: e.message });
    }
}));
app.put("/posts/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    if (!body.title || !body.description || !body.category) {
        return res.status(400).json({ msg: "Required Inputs not Found" });
    }
    const requestSchema = zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        category: zod_1.z.string(),
    });
    const parseSchema = requestSchema.safeParse(body);
    if (!parseSchema.success) {
        return res.status(400).json({ msg: parseSchema.error.issues[0].message });
    }
    try {
        const response = yield prisma.post.update({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
            },
            where: {
                id,
                // @ts-ignore
                authorId: req.id,
            },
        });
        return res.status(200).json({ msg: "Post Updated Successfully" });
    }
    catch (e) {
        return res.status(400).json({
            msg: "Incorrect id / You are not authorized to update the post, only author can update the post",
        });
    }
}));
app.delete("/posts/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield prisma.post.delete({
            where: {
                id,
                // @ts-ignore
                authorId: req.id,
            },
        });
        return res.status(200).json({ msg: "Post Deleted Successfully" });
    }
    catch (e) {
        return res.status(400).json({
            msg: "Incorrect id / You are not authorized to delete the post, only author can delete the post",
        });
    }
}));
app.listen(54321, () => console.log("Server Running in Port 54321"));
