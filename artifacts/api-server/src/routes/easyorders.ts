import { Router } from "express";

const router = Router();

export async function syncOrderToEasyOrders(order: {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string | null;
  items: Array<{
    productNameAr: string;
    productNameEn: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  totalAmount: number;
  notes?: string | null;
}) {
  const apiKey = process.env.EASYORDERS_API_KEY;
  if (!apiKey) return;

  try {
    const payload = {
      reference_id: `MH-${order.id}`,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      customer_city: order.customerCity || "",
      notes: order.notes || "",
      items: order.items.map((item) => ({
        name: item.productNameAr || item.productNameEn,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "",
        color: item.color || "",
      })),
      total: order.totalAmount,
    };

    await fetch("https://api.easyorders.store/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("EasyOrders sync failed:", err);
  }
}

router.post("/easyorders/webhook", (req, res) => {
  const { reference_id, status } = req.body || {};
  if (!reference_id || !status) {
    res.status(400).json({ error: "Invalid webhook payload" });
    return;
  }
  req.log.info({ reference_id, status }, "EasyOrders webhook received");
  res.json({ received: true });
});

export default router;
