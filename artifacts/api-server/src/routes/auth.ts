import { Router, type Request, type Response, type NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.mh_admin_token;
  if (token) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const parts = decoded.split(":");
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      if (parts.length >= 2 && parts[0] === adminUsername) {
        next();
        return;
      }
    } catch {}
  }
  res.status(401).json({ error: "Unauthorized" });
}

const router = Router();

router.post("/auth/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "MH@Store2024";

    if (username === adminUsername && password === adminPassword) {
      const token = Buffer.from(
        `${adminUsername}:${Date.now()}:${process.env.SESSION_SECRET || "mh-secret"}`
      ).toString("base64");

      res.cookie("mh_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ success: true, username: adminUsername });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie("mh_admin_token");
  res.json({ success: true });
});

router.get("/auth/me", (req, res) => {
  const token = req.cookies?.mh_admin_token;
  if (token) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const parts = decoded.split(":");
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      if (parts.length >= 2 && parts[0] === adminUsername) {
        res.json({ loggedIn: true, username: parts[0] });
        return;
      }
    } catch {}
  }
  res.json({ loggedIn: false });
});

export default router;
