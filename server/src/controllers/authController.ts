import type { Request, Response } from "express";
import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = 10;

// ---------------- REGISTER ----------------
export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Name is required." });
  }
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required." });
  }
    if ( !password) {
    return res
      .status(400)
      .json({ message: "Password is required." });
  }

  try {
    // check if user already exists
    const { rows } = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({
        message: "A user with this email already exists. Please log in.",
      });
    }

    // hash password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    console.log("Hashed password:", hash);
    

    // insert user
    const insert = await db.query(
      `INSERT INTO users (email, password, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, created_at`,
      [email, hash, name || null]
    );

    const user = insert.rows[0];

    return res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      message: "An error occurred while registering. Please try again later.",
    });
  }
}

// ---------------- LOGIN ----------------
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

 if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required." });
  }
    if ( !password) {
    return res
      .status(400)
      .json({ message: "Password is required." });
  }


  try {
    const { rows } = await db.query(
      "SELECT id, email,name, password FROM users WHERE email=$1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email does not exist." });
    }

    const user = rows[0];

    // check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server misconfiguration." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    

    return res.json({
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email, name: user.name},
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "An error occurred while logging in. Please try again later.",
    });
  }
}
