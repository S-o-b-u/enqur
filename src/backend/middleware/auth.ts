import { verifyToken } from "../utils/jwt";

export const requireAuth = async (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
};
