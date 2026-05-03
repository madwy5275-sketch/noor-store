import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_SETTINGS: Record<string, unknown> = {
  announcement: {
    enabled: true,
    ar: "الشحن مجاناً على الطلبات فوق 500 جنيه | اتصل بنا: 01552221286",
    en: "Free shipping on orders over 500 EGP | Call us: 01552221286",
  },
  sale: {
    enabled: true,
    endDate: "2026-05-10T23:59:59",
    discount: 30,
    titleAr: "تخفيضات العيد — خصم يصل إلى ٣٠٪",
    titleEn: "Eid Sale — Up to 30% Off",
  },
};

router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, unknown> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.get("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const rows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
    if (rows.length === 0) {
      const def = DEFAULT_SETTINGS[key];
      if (def !== undefined) { res.json({ key, value: def }); return; }
      res.status(404).json({ error: "Setting not found" }); return;
    }
    res.json({ key: rows[0].key, value: rows[0].value });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

router.put("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) { res.status(400).json({ error: "value is required" }); return; }

    await db
      .insert(siteSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettingsTable.key,
        set: { value, updatedAt: new Date() },
      });

    res.json({ key, value });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

export default router;
