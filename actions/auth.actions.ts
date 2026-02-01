"use server";

import connectDB from "@/lib/db";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { signJWT, setAuthCookie, removeAuthCookie } from "@/lib/auth";

export async function register(formData: FormData) {
  await connectDB();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("Missing fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user", // Default role
  });

  const token = await signJWT({ id: user._id, role: user.role });
  await setAuthCookie(token);

  return { success: true };
}

export async function login(formData: FormData) {
  await connectDB();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Missing fields");
  }

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = await signJWT({ id: user._id, role: user.role });
  await setAuthCookie(token);

  return { success: true, role: user.role };
}

export async function logout() {
  await removeAuthCookie();
  return { success: true };
}
