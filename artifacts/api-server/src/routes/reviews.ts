import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "./auth";

const router = Router();

// Public: get approved reviews for a product
router.get("/reviews", async (req, res) => {
  try {
    const productId = parseInt(String(req.query.productId ?? ""), 10);
    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({ error: "Valid productId required" });
      return;
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId))
      .orderBy(reviewsTable.createdAt);

    // Only return approved reviews to the public
    const approved = reviews.filter((r) => r.approved);
    const avg =
      approved.length > 0
        ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
        : 0;

    res.json({
      reviews: approved,
      averageRating: Math.round(avg * 10) / 10,
      count: approved.length,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public: submit a new review (goes into pending state)
router.post("/reviews", async (req, res) => {
  try {
    const { productId, customerName, rating, comment } = req.body ?? {};

    if (!productId || typeof productId !== "number" || productId <= 0) {
      res.status(400).json({ error: "Valid productId required" });
      return;
    }
    if (!customerName || typeof customerName !== "string" || customerName.trim().length === 0) {
      res.status(400).json({ error: "customerName required" });
      return;
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      res.status(400).json({ error: "rating must be 1-5" });
      return;
    }

    const [review] = await db
      .insert(reviewsTable)
      .values({
        productId,
        customerName: customerName.trim().slice(0, 100),
        rating: Math.round(rating),
        comment: comment ? String(comment).slice(0, 1000) : undefined,
        approved: false,
      })
      .returning();

    res.status(201).json(review);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: get all reviews with product names
router.get("/reviews/all", requireAuth, async (req, res) => {
  try {
    const rows = await db
      .select({
        id: reviewsTable.id,
        productId: reviewsTable.productId,
        productNameAr: productsTable.nameAr,
        productNameEn: productsTable.nameEn,
        customerName: reviewsTable.customerName,
        rating: reviewsTable.rating,
        comment: reviewsTable.comment,
        approved: reviewsTable.approved,
        createdAt: reviewsTable.createdAt,
      })
      .from(reviewsTable)
      .leftJoin(productsTable, eq(reviewsTable.productId, productsTable.id))
      .orderBy(desc(reviewsTable.createdAt));

    res.json(
      rows.map((r) => ({
        ...r,
        productNameAr: r.productNameAr ?? "",
        productNameEn: r.productNameEn ?? "",
        createdAt: r.createdAt?.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: approve a review
router.put("/reviews/:id/approve", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const [review] = await db
      .update(reviewsTable)
      .set({ approved: true })
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!review) { res.status(404).json({ error: "Review not found" }); return; }
    res.json({ ...review, createdAt: review.createdAt?.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: reject / unapprove a review
router.put("/reviews/:id/reject", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const [review] = await db
      .update(reviewsTable)
      .set({ approved: false })
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!review) { res.status(404).json({ error: "Review not found" }); return; }
    res.json({ ...review, createdAt: review.createdAt?.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete a review
router.delete("/reviews/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const [deleted] = await db
      .delete(reviewsTable)
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!deleted) { res.status(404).json({ error: "Review not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
