import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import authenticationMiddleware from "./middleware";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.JWT_SECRET || "123456";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

// auth routes
app.post("/register", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.email || !body.password) {
    return res.status(400).json({ msg: "Required Inputs not found" });
  }
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });
  const parseSchema = registerSchema.safeParse(body);
  if (!parseSchema.success) {
    return res.status(400).json({ msg: parseSchema.error.issues[0].message });
  }
  const hash = bcrypt.hashSync(body.password, 10);
  try {
    const response = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hash },
    });
    return res.status(200).json({ msg: "User Registered, Login to Continue" });
  } catch (e: any) {
    return res
      .status(400)
      .json({ msg: "Something Went Wrong Try Again Later" });
  }
});
app.post("/login", async (req, res) => {
  const body = req.body;
  if (!body.email || !body.password) {
    return res.status(400).json({ msg: "Required Inputs not found" });
  }
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const parseSchema = loginSchema.safeParse(body);

  if (!parseSchema.success) {
    return res.status(400).json({ msg: parseSchema.error.issues[0].message });
  }
  try {
    const response = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (response) {
      const passwordCheck = bcrypt.compareSync(
        body.password,
        response.password
      );
      if (passwordCheck) {
        const token = jwt.sign({ id: response.id }, key);
        return res.json({ token });
      }
      return res.status(400).send("Incorrect Password");
    }
    return res.status(200).json({ msg: "User Not found" });
  } catch (e: any) {
    console.log(e);
    return res
      .status(400)
      .json({ msg: "Something Went Wrong Try Again Later" });
  }
});

// check auth status
app.get("/me", authenticationMiddleware, (req, res) => {
  // @ts-ignore
  res.status(200).json({ msg: "ok", id: req.id });
});

// protected routes
app.get("/posts", authenticationMiddleware, async (req, res) => {
  try {
    const response = await prisma.post.findMany({});
    return res.status(200).json({ data: response });
  } catch (e: any) {
    return res.status(400).json({ msg: e.message });
  }
});
app.get("/posts/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await prisma.post.findFirst({ where: { id } });
    return res.status(200).json({ data: { ...response } });
  } catch (e: any) {
    return res.status(400).json({ msg: e.message });
  }
});
app.post("/posts", authenticationMiddleware, async (req, res) => {
  const body = req.body;
  if (!body.title || !body.description || !body.category) {
    return res.status(400).json({ msg: "Required Inputs not Found" });
  }
  const requestSchema = z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
  });
  const parseSchema = requestSchema.safeParse(body);
  if (!parseSchema.success) {
    return res.status(400).json({ msg: parseSchema.error.issues[0].message });
  }
  try {
    const response = await prisma.post.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        // @ts-ignore
        authorId: req.id,
      },
    });
    return res.status(200).json({ msg: "Post Created Successfully" });
  } catch (e: any) {
    return res.status(400).json({ msg: e.message });
  }
});
app.put("/posts/:id", authenticationMiddleware, async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  if (!body.title || !body.description || !body.category) {
    return res.status(400).json({ msg: "Required Inputs not Found" });
  }
  const requestSchema = z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
  });
  const parseSchema = requestSchema.safeParse(body);
  if (!parseSchema.success) {
    return res.status(400).json({ msg: parseSchema.error.issues[0].message });
  }
  try {
    const response = await prisma.post.update({
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
  } catch (e: any) {
    return res.status(400).json({
      msg: "Incorrect id / You are not authorized to update the post, only author can update the post",
    });
  }
});
app.delete("/posts/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await prisma.post.delete({
      where: {
        id,
        // @ts-ignore
        authorId: req.id,
      },
    });
    return res.status(200).json({ msg: "Post Deleted Successfully" });
  } catch (e: any) {
    return res.status(400).json({
      msg: "Incorrect id / You are not authorized to delete the post, only author can delete the post",
    });
  }
});

app.listen(54321, () => console.log("Server Running in Port 54321"));
