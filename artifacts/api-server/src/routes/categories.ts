import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { CreateCategoryBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

function parseUpdateBody(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  return {
    nameAr: typeof b.nameAr === "string" && b.nameAr.trim() ? b.nameAr.trim() : undefined,
    nameEn: typeof b.nameEn === "string" && b.nameEn.trim() ? b.nameEn.trim() : undefined,
    imageUrl: typeof b.imageUrl === "string" ? b.imageUrl.trim() || undefined : undefined,
  };
}

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    res.json(categories);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const body = CreateCategoryBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }
    const [category] = await db
      .insert(categoriesTable)
      .values(body.data)
      .returning();
    res.status(201).json(category);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const body = parseUpdateBody(req.body);
    if (!body) { res.status(400).json({ error: "Invalid body" }); return; }
    const [updated] = await db
      .update(categoriesTable)
      .set(body)
      .where(eq(categoriesTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Category not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const [deleted] = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .returning();
    if (!deleted) { res.status(404).json({ error: "Category not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
