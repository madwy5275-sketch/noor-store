import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable, couponsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderParams,
  UpdateOrderBody,
} from "@workspace/api-zod";
import { syncOrderToEasyOrders } from "./easyorders";
import { notifyNewOrder } from "../lib/notify";

const router = Router();

// Egyptian female names and cities pool for realistic synthetic entries
const EG_NAMES = [
  "نور","فاطمة","مريم","سارة","هناء","رنا","منى","إيمان","دينا","هبة",
  "ريم","سلمى","ياسمين","أميرة","شروق","رحمة","نهى","لمياء","علا","غادة",
  "نادية","سمر","أسماء","ولاء","ميار","شيماء","إسراء","هدى","رشا","لمى",
];
const EG_CITIES = [
  "القاهرة","الجيزة","الإسكندرية","المنصورة","طنطا","الزقازيق","بورسعيد",
  "السويس","أسيوط","المنيا","سوهاج","الفيوم","قنا","الأقصر","أسوان",
  "دمياط","شبرا الخيمة","المحلة الكبرى","بنها","شرم الشيخ","الغردقة",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Public: recent purchases for social proof (anonymized)
router.get("/orders/recent-purchases", async (req, res) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || "20"), 50);

    // 1. Fetch real orders (last 60 days)
    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit);

    const realPurchases = orders
      .flatMap((o) => {
        const items = (o.items as Array<{ productNameAr: string; productNameEn: string; productImage?: string }>) || [];
        const firstName = o.customerName.trim().split(/\s+/)[0] || "عميل";
        const city = o.customerCity || o.customerAddress.trim().split(/[,،]/)[0] || "مصر";
        return items.map((item) => ({
          firstName,
          city,
          productNameAr: item.productNameAr,
          productNameEn: item.productNameEn,
          productImage: item.productImage ?? null,
          createdAt: o.createdAt?.toISOString() ?? new Date().toISOString(),
          synthetic: false,
        }));
      })
      .filter((p) => p.productNameAr && p.productNameEn);

    // 2. If fewer than 12 real entries, supplement with synthetic ones using real products
    const THRESHOLD = 12;
    let result = [...realPurchases];

    if (realPurchases.length < THRESHOLD) {
      const products = await db
        .select({ nameAr: productsTable.nameAr, nameEn: productsTable.nameEn, images: productsTable.images })
        .from(productsTable)
        .limit(50);

      if (products.length > 0) {
        const needed = THRESHOLD - realPurchases.length;
        const syntheticEntries = [];
        const now = Date.now();

        for (let i = 0; i < needed; i++) {
          const seed = i * 37 + products.length * 13;
          const nameIdx = Math.floor(seededRandom(seed) * EG_NAMES.length);
          const cityIdx = Math.floor(seededRandom(seed + 7) * EG_CITIES.length);
          const prodIdx = Math.floor(seededRandom(seed + 13) * products.length);
          // Spread timestamps over the past 48 hours
          const offsetMs = Math.floor(seededRandom(seed + 19) * 48 * 3600 * 1000);
          const imgs = products[prodIdx].images as string[] | null;
          syntheticEntries.push({
            firstName: EG_NAMES[nameIdx],
            city: EG_CITIES[cityIdx],
            productNameAr: products[prodIdx].nameAr,
            productNameEn: products[prodIdx].nameEn,
            productImage: (Array.isArray(imgs) && imgs.length > 0) ? imgs[0] : null,
            createdAt: new Date(now - offsetMs).toISOString(),
            synthetic: true,
          });
        }

        // Interleave: real first, then synthetic
        result = [...realPurchases, ...syntheticEntries];
      }
    }

    // Shuffle for variety (deterministic shuffle based on hour so it's stable per session)
    const hourSeed = Math.floor(Date.now() / 3600000);
    result.sort((a, b) => seededRandom(result.indexOf(a) + hourSeed) - 0.5 + (a.synthetic ? 0.1 : -0.1));

    // Strip the synthetic flag before sending
    res.json(result.map(({ synthetic: _s, ...rest }) => rest).slice(0, limit));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public order tracking by phone number
router.get("/orders/track", async (req, res) => {
  try {
    const phone = req.query.phone as string;
    if (!phone || phone.trim().length < 7) {
      res.status(400).json({ error: "Valid phone number required" });
      return;
    }

    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(ordersTable.createdAt);

    const matched = orders
      .filter((o) => o.customerPhone.replace(/\s/g, "") === phone.replace(/\s/g, ""))
      .map((o) => ({
        id: o.id,
        status: o.status,
        totalAmount: parseFloat(o.totalAmount as string),
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerCity: o.customerCity,
        customerAddress: o.customerAddress,
        paymentMethod: o.paymentMethod ?? "cod",
        items: o.items,
        notes: o.notes,
        createdAt: o.createdAt?.toISOString(),
        updatedAt: o.updatedAt?.toISOString(),
      }));

    res.json(matched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const query = ListOrdersQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query params" });
      return;
    }

    let orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);

    if (query.data.status) {
      orders = orders.filter((o) => o.status === query.data.status);
    }

    res.json(
      orders.map((o) => ({
        ...o,
        totalAmount: parseFloat(o.totalAmount as string),
        createdAt: o.createdAt?.toISOString(),
        updatedAt: o.updatedAt?.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const body = CreateOrderBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }

    const { customerName, customerPhone, customerAddress, customerCity, items, notes, paymentMethod, couponCode, discountAmount } = body.data;

    // Validate coupon if provided
    let validCoupon = null;
    if (couponCode) {
      const [found] = await db
        .select()
        .from(couponsTable)
        .where(eq(couponsTable.code, couponCode.trim().toUpperCase()));
      if (found && found.active) {
        validCoupon = found;
      }
    }

    // Fetch products to get prices and names
    const productIds = items.map((i: { productId: number }) => i.productId);
    const products = productIds.length > 0
      ? await db.select().from(productsTable).where(sql`${productsTable.id} = ANY(ARRAY[${sql.join(productIds.map((id: number) => sql`${id}`), sql`, `)}]::int[])`)
      : [];

    const productMap = new Map(products.map((p) => [p.id, p]));

    const orderItems = items.map((item: { productId: number; quantity: number; size?: string; color?: string }) => {
      const product = productMap.get(item.productId);
      return {
        productId: item.productId,
        productNameAr: product?.nameAr ?? "",
        productNameEn: product?.nameEn ?? "",
        quantity: item.quantity,
        price: product ? parseFloat(product.price as string) : 0,
        size: item.size,
        color: item.color,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const discount = discountAmount ?? 0;
    const totalAmount = Math.max(0, subtotal - discount);

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerName,
        customerPhone,
        customerAddress,
        customerCity,
        status: "pending",
        items: orderItems,
        totalAmount: String(totalAmount),
        discountAmount: String(discount),
        couponCode: validCoupon ? validCoupon.code : null,
        notes,
        paymentMethod: paymentMethod ?? "cod",
      })
      .returning();

    // Increment coupon usedCount
    if (validCoupon) {
      await db
        .update(couponsTable)
        .set({ usedCount: validCoupon.usedCount + 1 })
        .where(eq(couponsTable.id, validCoupon.id));
    }

    // Sync to EasyOrders in background (non-blocking)
    syncOrderToEasyOrders({
      id: order.id,
      customerName,
      customerPhone,
      customerAddress,
      customerCity,
      items: orderItems,
      totalAmount,
      notes,
    }).catch(() => {});

    // Send order notification (Telegram + Email) — non-blocking
    notifyNewOrder({
      orderId: order.id,
      customerName,
      customerPhone,
      customerCity,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod ?? "cod",
      notes,
    });

    res.status(201).json({
      ...order,
      totalAmount: parseFloat(order.totalAmount as string),
      discountAmount: parseFloat((order.discountAmount ?? "0") as string),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const params = GetOrderParams.safeParse({ id: parseInt(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, params.data.id));

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({
      ...order,
      totalAmount: parseFloat(order.totalAmount as string),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const params = UpdateOrderParams.safeParse({ id: parseInt(req.params.id) });
    const body = UpdateOrderBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const [order] = await db
      .update(ordersTable)
      .set({
        status: body.data.status,
        notes: body.data.notes,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, params.data.id))
      .returning();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({
      ...order,
      totalAmount: parseFloat(order.totalAmount as string),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
