import bcrypt from "bcryptjs";
import User from "../models/User";
import { createToken } from "@/backend/utils/auth";

export const signup = async (req: any, res: any) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ email, password: hashed });
  const token = createToken(user._id);
  res.json({ token });
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = createToken(user._id);
  res.json({ token });
};
