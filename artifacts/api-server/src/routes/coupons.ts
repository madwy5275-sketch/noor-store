import { Router } from "express";
import { db } from "@workspace/db";
import { couponsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

const router = Router();

// ── Public: validate a coupon code ──────────────────────────────────────────
router.post("/coupons/validate", async (req, res) => {
  try {
    const { code } = req.body as { code?: string };
    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Coupon code is required" });
      return;
    }

    const [coupon] = await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.code, code.trim().toUpperCase()));

    if (!coupon) {
      res.status(404).json({ error: "Invalid coupon code" });
      return;
    }

    if (!coupon.active) {
      res.status(400).json({ error: "Coupon is not active" });
      return;
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ error: "Coupon has expired" });
      return;
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ error: "Coupon usage limit reached" });
      return;
    }

    res.json({
      id: coupon.id,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Protected: list all coupons ──────────────────────────────────────────────
router.get("/coupons", requireAuth, async (req, res) => {
  try {
    const coupons = await db
      .select()
      .from(couponsTable)
      .orderBy(couponsTable.createdAt);

    res.json(
      coupons.map((c) => ({
        ...c,
        expiresAt: c.expiresAt?.toISOString() ?? null,
        createdAt: c.createdAt?.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Protected: create coupon ─────────────────────────────────────────────────
router.post("/coupons", requireAuth, async (req, res) => {
  try {
    const { code, discountPercentage, active, expiresAt, usageLimit, description } =
      req.body as {
        code: string;
        discountPercentage: number;
        active?: boolean;
        expiresAt?: string | null;
        usageLimit?: number | null;
        description?: string;
      };

    if (!code || !discountPercentage) {
      res.status(400).json({ error: "code and discountPercentage are required" });
      return;
    }

    if (discountPercentage < 1 || discountPercentage > 100) {
      res.status(400).json({ error: "discountPercentage must be between 1 and 100" });
      return;
    }

    const [coupon] = await db
      .insert(couponsTable)
      .values({
        code: code.trim().toUpperCase(),
        discountPercentage,
        active: active ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ?? null,
        description: description ?? null,
      })
      .returning();

    res.status(201).json({
      ...coupon,
      expiresAt: coupon.expiresAt?.toISOString() ?? null,
      createdAt: coupon.createdAt?.toISOString(),
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
      res.status(409).json({ error: "Coupon code already exists" });
      return;
    }
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Protected: update coupon ─────────────────────────────────────────────────
router.put("/coupons/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const { code, discountPercentage, active, expiresAt, usageLimit, description } =
      req.body as {
        code?: string;
        discountPercentage?: number;
        active?: boolean;
        expiresAt?: string | null;
        usageLimit?: number | null;
        description?: string;
      };

    const [coupon] = await db
      .update(couponsTable)
      .set({
        ...(code !== undefined ? { code: code.trim().toUpperCase() } : {}),
        ...(discountPercentage !== undefined ? { discountPercentage } : {}),
        ...(active !== undefined ? { active } : {}),
        ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
        ...(usageLimit !== undefined ? { usageLimit } : {}),
        ...(description !== undefined ? { description } : {}),
      })
      .where(eq(couponsTable.id, id))
      .returning();

    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }

    res.json({
      ...coupon,
      expiresAt: coupon.expiresAt?.toISOString() ?? null,
      createdAt: coupon.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Protected: delete coupon ─────────────────────────────────────────────────
router.delete("/coupons/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [deleted] = await db
      .delete(couponsTable)
      .where(eq(couponsTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
