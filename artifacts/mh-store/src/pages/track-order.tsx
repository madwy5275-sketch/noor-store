import { useState } from "react";
import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2, Package, Search, CheckCircle2, Circle,
  Truck, MapPin, ClipboardCheck, ShoppingBag, Phone,
  Calendar, CreditCard, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const STEPS = [
  {
    key: "pending",
    iconAr: "تم استلام الطلب",
    iconEn: "Order Received",
    subAr: "تم تأكيد استلام طلبك",
    subEn: "We've received your order",
    Icon: ShoppingBag,
  },
  {
    key: "confirmed",
    iconAr: "تم تأكيد الطلب",
    iconEn: "Order Confirmed",
    subAr: "جاري تحضير طلبك",
    subEn: "Your order is being prepared",
    Icon: ClipboardCheck,
  },
  {
    key: "shipped",
    iconAr: "تم الشحن",
    iconEn: "Shipped",
    subAr: "طلبك في الطريق إليكِ",
    subEn: "Your order is on the way",
    Icon: Truck,
  },
  {
    key: "delivered",
    iconAr: "تم التسليم",
    iconEn: "Delivered",
    subAr: "تم توصيل طلبك بنجاح",
    subEn: "Your order has been delivered",
    Icon: MapPin,
  },
];

const STATUS_ORDER = ["pending", "confirmed", "shipped", "delivered"];

function getStepIndex(status: string) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function OrderTimeline({ status }: { status: string }) {
  const { t, language } = useI18n();
  const activeIdx = status === "cancelled" ? -1 : getStepIndex(status);

  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-3 py-6 text-red-500">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold">{t("تم إلغاء الطلب", "Order Cancelled")}</p>
          <p className="text-xs text-foreground/50">{t("تواصل معنا إذا كان لديك أي استفسار", "Contact us if you have any questions")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Desktop timeline */}
      <div className="hidden sm:flex items-center">
        {STEPS.map((step, idx) => {
          const done = idx <= activeIdx;
          const active = idx === activeIdx;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 relative">
                <div className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-500 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                } ${active ? "ring-4 ring-primary/20" : ""}`}>
                  {done && idx < activeIdx ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <step.Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-center min-w-[80px]">
                  <p className={`text-xs font-bold leading-tight ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    {language === "ar" ? step.iconAr : step.iconEn}
                  </p>
                  {active && (
                    <p className="text-[10px] text-primary mt-0.5 leading-tight">
                      {language === "ar" ? step.subAr : step.subEn}
                    </p>
                  )}
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-3 mb-8 relative">
                  <div className="h-0.5 bg-border w-full absolute top-0" />
                  <div
                    className="h-0.5 bg-primary absolute top-0 transition-all duration-700"
                    style={{ width: idx < activeIdx ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile timeline */}
      <div className="flex sm:hidden flex-col gap-0">
        {STEPS.map((step, idx) => {
          const done = idx <= activeIdx;
          const active = idx === activeIdx;
          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                }`}>
                  {done && idx < activeIdx ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <step.Icon className="h-4 w-4" />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 transition-all ${idx < activeIdx ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
              <div className={`pt-2.5 pb-4 ${idx < STEPS.length - 1 ? "" : ""}`}>
                <p className={`text-sm font-bold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                  {language === "ar" ? step.iconAr : step.iconEn}
                </p>
                {active && (
                  <p className="text-xs text-primary mt-0.5">
                    {language === "ar" ? step.subAr : step.subEn}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStatusBg(status: string) {
  switch (status) {
    case "pending": return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
    case "confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300";
    case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300";
    case "delivered": return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300";
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300";
    default: return "bg-secondary text-foreground";
  }
}

function getStatusLabel(status: string, t: (ar: string, en: string) => string) {
  switch (status) {
    case "pending": return t("قيد الانتظار", "Pending");
    case "confirmed": return t("مؤكد", "Confirmed");
    case "shipped": return t("تم الشحن", "Shipped");
    case "delivered": return t("تم التسليم", "Delivered");
    case "cancelled": return t("ملغي", "Cancelled");
    default: return status;
  }
}

function getPaymentLabel(method: string, t: (ar: string, en: string) => string) {
  switch (method) {
    case "cod": return t("الدفع عند الاستلام", "Cash on Delivery");
    case "vodafone_cash": return t("فودافون كاش", "Vodafone Cash");
    case "instapay": return t("انستاباي", "InstaPay");
    case "fawry": return t("فوري", "Fawry");
    case "card": return t("بطاقة بنكية", "Bank Card");
    default: return method || t("الدفع عند الاستلام", "Cash on Delivery");
  }
}

function OrderCard({ order }: { order: any }) {
  const { t, language } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Status timeline */}
      <div className="bg-secondary/30 border-b border-border px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{t("طلب رقم", "Order")} <span className="font-bold text-foreground">#{order.id}</span></span>
            <span className={`text-xs font-bold px-2.5 py-1 ${getStatusBg(order.status)}`}>
              {getStatusLabel(order.status, t)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(order.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </div>
        </div>
        <OrderTimeline status={order.status} />
      </div>

      {/* Summary row */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{t("الإجمالي", "Total")}</p>
            <p className="font-bold text-lg text-primary">{order.totalAmount} {t("ج.م", "EGP")}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{t("طريقة الدفع", "Payment")}</p>
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="font-medium text-sm">{getPaymentLabel(order.paymentMethod, t)}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{t("المنتجات", "Items")}</p>
            <p className="font-medium text-sm">{order.items?.length ?? 0} {t("قطعة", "items")}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-70 transition-opacity self-start sm:self-auto"
        >
          {expanded ? t("إخفاء التفاصيل", "Hide Details") : t("عرض التفاصيل", "View Details")}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 py-5 space-y-5 bg-background/50">
          {/* Items */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("المنتجات المطلوبة", "Ordered Items")}</p>
            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-full bg-primary/30 self-stretch flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{language === "ar" ? item.productNameAr : item.productNameEn}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                        <span>{t("الكمية", "Qty")}: <span className="font-bold text-foreground">{item.quantity}</span></span>
                        {item.size && <span>{t("المقاس", "Size")}: <span className="font-bold text-foreground">{item.size}</span></span>}
                        {item.color && <span>{t("اللون", "Color")}: <span className="font-bold text-foreground">{item.color}</span></span>}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-sm whitespace-nowrap">{item.price * item.quantity} {t("ج.م", "EGP")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-secondary/40 border border-border p-4 flex items-start gap-3">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">{t("عنوان التوصيل", "Delivery Address")}</p>
              <p className="text-sm font-medium">{order.shippingAddress}</p>
              <p className="text-sm text-muted-foreground">{order.city}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span dir="ltr">{order.phone}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrder() {
  const { t } = useI18n();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setOrders(null);
    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error(t("حدث خطأ أثناء البحث عن الطلبات", "An error occurred while searching for orders"));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-16 md:py-24 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("خدمة العملاء", "CUSTOMER SERVICE")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("تتبع طلبك", "Track Your Order")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t("أدخلي رقم هاتفك لمعرفة حالة طلبك لحظة بلحظة", "Enter your phone number to track your order in real time")}
        </p>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        {/* Search box */}
        <div className="bg-card border border-border p-6 md:p-8 mb-10">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Phone className="absolute right-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder={t("01xxxxxxxxx", "01xxxxxxxxx")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 rounded-none pr-12 rtl:pl-12 rtl:pr-4 text-lg border-border focus-visible:ring-primary bg-secondary/30 text-left ltr"
                dir="ltr"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !phone.trim()}
              className="h-14 px-8 rounded-none font-bold text-base uppercase tracking-wider bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all min-w-[160px]"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : (
                  <>
                    <Search className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t("تتبع", "Track")}
                  </>
                )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {t("أدخلي نفس رقم الهاتف المستخدم عند الطلب", "Use the same phone number you provided when ordering")}
          </p>
        </div>

        {/* Results */}
        {orders !== null && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-secondary/30 border border-border">
                <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-serif font-bold mb-3">{t("لا توجد طلبات", "No Orders Found")}</h3>
                <p className="text-muted-foreground font-light mb-8">
                  {t("لم نجد أي طلبات مرتبطة بهذا الرقم", "We couldn't find any orders linked to this number")}
                </p>
                <Link href="/products">
                  <Button className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-primary hover:text-primary-foreground">
                    {t("تسوقي الآن", "Shop Now")}
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-serif font-bold">
                    {orders.length === 1
                      ? t("طلب واحد", "1 Order")
                      : t(`${orders.length} طلبات`, `${orders.length} Orders`)}
                  </h2>
                </div>
                {orders.map((order: any) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Help section */}
        {orders === null && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                titleAr: "استغرق وقتاً أطول من المعتاد؟",
                titleEn: "Taking longer than expected?",
                textAr: "يمكنك التواصل معنا مباشرة عبر واتساب لمتابعة طلبك",
                textEn: "Contact us directly via WhatsApp to follow up",
                link: "/contact",
                linkAr: "تواصل معنا",
                linkEn: "Contact Us",
              },
              {
                titleAr: "تريدين الاسترجاع؟",
                titleEn: "Want to return?",
                textAr: "اقرأي سياسة الاسترجاع لمعرفة كيفية إعادة المنتج",
                textEn: "Read our return policy to know how to return",
                link: "/returns",
                linkAr: "سياسة الاسترجاع",
                linkEn: "Return Policy",
              },
              {
                titleAr: "طلب مفقود؟",
                titleEn: "Missing order?",
                textAr: "تأكدي من رقم الهاتف وتواصلي معنا إذا استمر المشكلة",
                textEn: "Verify your phone number and contact us if issue persists",
                link: "/faq",
                linkAr: "الأسئلة الشائعة",
                linkEn: "FAQ",
              },
            ].map((item) => (
              <div key={item.linkEn} className="bg-secondary/30 border border-border p-5">
                <p className="font-bold text-sm mb-2">{t(item.titleAr, item.titleEn)}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t(item.textAr, item.textEn)}</p>
                <Link href={item.link} className="text-primary text-xs font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">
                  {t(item.linkAr, item.linkEn)} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
