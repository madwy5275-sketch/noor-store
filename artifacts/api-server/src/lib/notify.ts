/**
 * Order notification service — supports Telegram and Email.
 * All sends are fire-and-forget (non-blocking).
 * Configure via environment variables (see RAILWAY_ENV_VARIABLES.txt).
 */

interface OrderNotification {
  orderId: number;
  customerName: string;
  customerPhone: string;
  customerCity?: string | null;
  items: Array<{
    productNameAr: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod?: string | null;
  notes?: string | null;
}

function buildMessage(order: OrderNotification): string {
  const itemLines = order.items
    .map((i) => `  • ${i.productNameAr} × ${i.quantity} — ${i.price * i.quantity} ج.م`)
    .join("\n");

  const method = order.paymentMethod === "cod" ? "الدفع عند الاستلام" : order.paymentMethod ?? "الدفع عند الاستلام";
  const city = order.customerCity ? ` | ${order.customerCity}` : "";

  return [
    `🛍️ طلب جديد #${order.orderId}`,
    ``,
    `👤 ${order.customerName}${city}`,
    `📞 ${order.customerPhone}`,
    `💳 ${method}`,
    ``,
    `المنتجات:`,
    itemLines,
    ``,
    `💰 الإجمالي: ${order.totalAmount} ج.م`,
    order.notes ? `📝 ملاحظات: ${order.notes}` : "",
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n")
    .trim();
}

// ── Telegram ──────────────────────────────────────────────────────────────────

async function sendTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[notify] Telegram error:", err);
  }
}

// ── Email via nodemailer ───────────────────────────────────────────────────────

async function sendEmail(message: string, orderId: number): Promise<void> {
  const email = process.env.NOTIFY_EMAIL;
  const password = process.env.NOTIFY_EMAIL_APP_PASSWORD;

  if (!email || !password) return;

  // Dynamic import so nodemailer is optional
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    service: "gmail",
    auth: { user: email, pass: password },
  });

  await transporter.sendMail({
    from: `"Noor Store" <${email}>`,
    to: email,
    subject: `🛍️ طلب جديد #${orderId} — نور ستور`,
    text: message,
  });
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function notifyNewOrder(order: OrderNotification): void {
  const message = buildMessage(order);

  // Fire and forget — never block the HTTP response
  sendTelegram(message).catch((err) =>
    console.error("[notify] Telegram failed:", err)
  );

  sendEmail(message, order.orderId).catch((err) =>
    console.error("[notify] Email failed:", err)
  );
}
