import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable, categoriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats/dashboard", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable);
    const products = await db.select().from(productsTable);
    const categories = await db.select().from(categoriesTable);

    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount as string), 0);

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      confirmedOrders: orders.filter((o) => o.status === "confirmed").length,
      shippedOrders: orders.filter((o) => o.status === "shipped").length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
      totalRevenue,
      totalProducts: products.length,
      totalCategories: categories.length,
    };

    res.json(stats);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/top-products", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable);
    const products = await db.select().from(productsTable);

    const productSales = new Map<
      number,
      { totalSold: number; revenue: number }
    >();

    for (const order of orders) {
      const items = order.items as Array<{
        productId: number;
        quantity: number;
        price: number;
      }>;
      for (const item of items) {
        const existing = productSales.get(item.productId) ?? {
          totalSold: 0,
          revenue: 0,
        };
        productSales.set(item.productId, {
          totalSold: existing.totalSold + item.quantity,
          revenue: existing.revenue + item.price * item.quantity,
        });
      }
    }

    const topProducts = products
      .map((p) => ({
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        imageUrl: p.imageUrl,
        totalSold: productSales.get(p.id)?.totalSold ?? 0,
        revenue: productSales.get(p.id)?.revenue ?? 0,
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);

    res.json(topProducts);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
