import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder, useValidateCoupon } from "@workspace/api-client-react";
import type { CouponValidation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, ShoppingBag, CheckCircle, ArrowRight, ArrowLeft, Copy, ExternalLink, PackageSearch, Plus, Check, Tag, X, Loader2 } from "lucide-react";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { useListProducts } from "@workspace/api-client-react";

const PAYMENT_METHODS = [
  {
    id: "cod",
    labelAr: "الدفع عند الاستلام",
    labelEn: "Cash on Delivery",
    descAr: "ادفع نقداً عند استلام طلبك",
    descEn: "Pay cash when you receive your order",
    icon: "💵",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-500",
  },
  {
    id: "vodafone_cash",
    labelAr: "فودافون كاش",
    labelEn: "Vodafone Cash",
    descAr: "محفظة فودافون كاش",
    descEn: "Vodafone Cash wallet",
    icon: "📱",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-500",
  },
  {
    id: "instapay",
    labelAr: "إنستا باي",
    labelEn: "InstaPay",
    descAr: "التحويل الفوري البنكي",
    descEn: "Instant bank transfer",
    icon: "⚡",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-500",
  },
  {
    id: "fawry",
    labelAr: "فوري",
    labelEn: "Fawry",
    descAr: "ادفع في أي فرع فوري",
    descEn: "Pay at any Fawry branch",
    icon: "🏪",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-500",
  },
  {
    id: "card",
    labelAr: "بطاقة بنكية",
    labelEn: "Bank Card",
    descAr: "فيزا / ماستركارد / ميزة",
    descEn: "Visa / Mastercard / Meeza",
    icon: "💳",
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-500",
  },
];

export default function Cart() {
  const { t, language } = useI18n();
  const { items, addItem, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { settings } = useSiteSettings();

  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [justAdded, setJustAdded] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const validateCoupon = useValidateCoupon();

  const { data: allProducts } = useListProducts({});
  const upsellProducts = (allProducts || [])
    .filter((p) => p.stock > 0 && !items.some((i) => i.productId === p.id))
    .slice(0, 8);

  const handleUpsellAdd = (p: typeof upsellProducts[0]) => {
    addItem({
      productId: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      price: p.price,
      quantity: 1,
      imageUrl: p.imageUrl,
    });
    setJustAdded((prev) => [...prev, p.id]);
    toast.success(t("تمت الإضافة إلى السلة", "Added to bag!"));
    setTimeout(() => setJustAdded((prev) => prev.filter((id) => id !== p.id)), 2000);
  };

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    notes: ""
  });

  const paymentConfig = settings.payment;

  const availableMethods = PAYMENT_METHODS.filter((m) => {
    if (m.id === "cod") return paymentConfig.cod.enabled;
    if (m.id === "vodafone_cash") return paymentConfig.vodafone_cash.enabled;
    if (m.id === "instapay") return paymentConfig.instapay.enabled;
    if (m.id === "fawry") return paymentConfig.fawry.enabled;
    if (m.id === "card") return paymentConfig.card.enabled;
    return false;
  });

  const getPaymentDetails = (id: string) => {
    if (id === "vodafone_cash") return paymentConfig.vodafone_cash;
    if (id === "instapay") return paymentConfig.instapay;
    if (id === "fawry") return paymentConfig.fawry;
    if (id === "card") return paymentConfig.card;
    return null;
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment);
  const selectedDetails = getPaymentDetails(selectedPayment);

  const discountAmount = appliedCoupon
    ? Math.round((totalPrice * appliedCoupon.discountPercentage) / 100)
    : 0;
  const finalTotal = totalPrice - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    validateCoupon.mutate(
      { data: { code } },
      {
        onSuccess: (data) => {
          setAppliedCoupon(data);
          toast.success(
            t(
              `كوبون مفعّل! خصم ${data.discountPercentage}٪`,
              `Coupon applied! ${data.discountPercentage}% off`
            )
          );
        },
        onError: () => {
          toast.error(t("كود الخصم غير صالح أو منتهي", "Invalid or expired coupon code"));
        },
      }
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("تم النسخ", "Copied!"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    createOrder.mutate({
      data: {
        ...formData,
        paymentMethod: selectedPayment,
        couponCode: appliedCoupon?.code ?? null,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
      }
    }, {
      onSuccess: (data) => {
        setOrderId(data.id);
        setIsSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      },
      onError: () => {
        toast.error(t("حدث خطأ أثناء إتمام الطلب", "Failed to place order"));
      }
    });
  };

  if (isSuccess) {
    const trackUrl = `/track-order?phone=${encodeURIComponent(formData.customerPhone)}`;
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl min-h-[70vh] flex flex-col justify-center">
          {/* Success icon */}
          <div className="relative mx-auto mb-10">
            <div className="w-28 h-28 bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
              <CheckCircle className="h-14 w-14 text-primary" />
            </div>
          </div>

          <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("تم بنجاح", "SUCCESS")}</p>
          <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">{t("تم استلام طلبك", "Order Placed!")}</h1>
          <p className="text-3xl text-foreground mb-6 font-light">
            {t("رقم الطلب", "Order")} <span className="font-black text-primary font-serif">#{orderId}</span>
          </p>

          <div className="bg-secondary/50 border border-border p-6 mb-10 text-sm text-foreground/70 leading-relaxed">
            {t(
              "شكراً لتسوقك معنا! سنتواصل معك قريباً على رقم هاتفك لتأكيد الطلب وتحديد موعد التوصيل.",
              "Thank you for shopping with us! We will contact you shortly on your phone number to confirm the order and arrange the delivery time."
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={trackUrl}>
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold rounded-none bg-foreground text-background hover:bg-primary hover:text-primary-foreground w-full sm:w-auto transition-all"
              >
                <PackageSearch className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {t("تتبع طلبي", "Track My Order")}
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base font-bold rounded-none border-foreground hover:bg-foreground hover:text-background w-full sm:w-auto transition-all"
              >
                {t("متابعة التسوق", "Continue Shopping")}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            {t("يمكنك تتبع حالة طلبك في أي وقت عبر رقم هاتفك", "You can track your order status anytime using your phone number")}
          </p>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-2xl flex flex-col items-center min-h-[60vh] justify-center">
          <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mb-10">
            <ShoppingBag className="h-12 w-12 text-foreground/40" />
          </div>
          <h1 className="text-4xl font-serif font-black mb-6">{t("حقيبة التسوق فارغة", "Your shopping bag is empty")}</h1>
          <p className="text-foreground/70 mb-10 text-lg font-light">
            {t("لم تقم بإضافة أي منتجات لحقيبتك بعد. اكتشف أحدث مجموعاتنا الآن.", "You haven't added any products to your bag yet. Discover our latest collections now.")}
          </p>
          <Link href="/products">
            <Button size="lg" className="h-16 px-12 text-xl font-serif font-bold rounded-none">
              {t("تصفح المجموعات", "Browse Collections")}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/products" className="text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2 font-medium">
            {language === "ar" ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            {t("العودة للتسوق", "Back to shopping")}
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-black mb-12 pb-6 border-b border-border text-foreground">
          {t("إتمام الطلب", "Checkout")}
        </h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Order Form */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <div className="bg-background">
              <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-wide">{t("بيانات التوصيل", "Delivery Details")}</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wide text-foreground/80">{t("الاسم بالكامل", "Full Name")}</Label>
                  <Input
                    id="name"
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="h-14 rounded-none bg-background border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wide text-foreground/80">{t("رقم الهاتف", "Phone Number")}</Label>
                    <Input
                      id="phone"
                      required
                      type="tel"
                      dir="ltr"
                      value={formData.customerPhone}
                      onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="h-14 rounded-none bg-background border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-left text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-sm font-bold uppercase tracking-wide text-foreground/80">{t("المدينة / المحافظة", "City / Governorate")}</Label>
                    <Input
                      id="city"
                      required
                      value={formData.customerCity}
                      onChange={e => setFormData({ ...formData, customerCity: e.target.value })}
                      className="h-14 rounded-none bg-background border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-sm font-bold uppercase tracking-wide text-foreground/80">{t("العنوان بالتفصيل", "Detailed Address")}</Label>
                  <Textarea
                    id="address"
                    required
                    rows={4}
                    value={formData.customerAddress}
                    onChange={e => setFormData({ ...formData, customerAddress: e.target.value })}
                    className="rounded-none bg-background border-border resize-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-lg p-4"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-sm font-bold uppercase tracking-wide text-foreground/80">
                    {t("ملاحظات إضافية (اختياري)", "Additional Notes (Optional)")}
                  </Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="rounded-none bg-background border-border resize-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-lg p-4"
                  />
                </div>

                {/* ── Payment Method ── */}
                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-wide text-foreground/80 block">
                    {t("طريقة الدفع", "Payment Method")}
                  </Label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableMethods.map((method) => {
                      const isSelected = selectedPayment === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          className={`flex items-center gap-4 p-4 border-2 transition-all text-start ${
                            isSelected
                              ? `${method.border} ${method.bg}`
                              : "border-border bg-background hover:border-foreground/30"
                          }`}
                        >
                          <span className="text-3xl leading-none flex-shrink-0">{method.icon}</span>
                          <div className="min-w-0">
                            <p className={`font-bold text-base leading-tight ${isSelected ? method.color : "text-foreground"}`}>
                              {language === "ar" ? method.labelAr : method.labelEn}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {language === "ar" ? method.descAr : method.descEn}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-auto rtl:mr-auto rtl:ml-0 flex items-center justify-center ${
                            isSelected ? `${method.border} bg-white dark:bg-background` : "border-border"
                          }`}>
                            {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${method.bg.replace("bg-", "bg-").replace("/30", "")} ${method.color.replace("text-", "bg-")}`} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Payment instructions for non-COD */}
                  {selectedPayment !== "cod" && selectedDetails && (
                    <div className={`p-5 border ${selectedMethod?.border} ${selectedMethod?.bg} space-y-3`}>
                      <p className={`text-sm font-bold ${selectedMethod?.color}`}>
                        {language === "ar" ? selectedDetails.instructionsAr : selectedDetails.instructionsEn}
                      </p>
                      {(selectedDetails.phone || selectedDetails.id) && (
                        <div className="flex items-center gap-3 bg-white/60 dark:bg-black/20 px-4 py-3 border border-white/40 dark:border-white/10">
                          <span dir="ltr" className="font-mono font-bold text-xl tracking-widest flex-1 text-foreground">
                            {selectedDetails.phone || selectedDetails.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(selectedDetails.phone || selectedDetails.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold uppercase ${selectedMethod?.color} hover:opacity-70 transition-opacity`}
                          >
                            <Copy className="h-4 w-4" />
                            {t("نسخ", "Copy")}
                          </button>
                        </div>
                      )}
                      {selectedDetails.link && (
                        <a
                          href={selectedDetails.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-sm font-bold ${selectedMethod?.color} underline underline-offset-4`}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t("رابط الدفع", "Payment Link")}
                        </a>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "بعد إتمام التحويل، اضغط على 'تأكيد الطلب' وسنتحقق من الدفع خلال دقائق.",
                          "After completing the transfer, press 'Confirm Order' and we will verify the payment within minutes."
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-16 text-xl font-serif font-bold rounded-none tracking-wide"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending
                      ? t("جاري إرسال الطلب...", "Placing Order...")
                      : selectedPayment === "cod"
                        ? t("تأكيد الطلب — الدفع عند الاستلام", "Confirm Order — Cash on Delivery")
                        : t("تأكيد الطلب", "Confirm Order")}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <div className="bg-secondary/50 p-8 md:p-10 sticky top-28">
              <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-wide border-b border-border/50 pb-4">{t("ملخص الطلب", "Order Summary")}</h2>
              <FreeShippingBar total={totalPrice} />

              <div className="space-y-8 mb-10 max-h-[50vh] overflow-y-auto pr-4 scrollbar-hide">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex gap-6 relative group">
                    <div className="w-24 aspect-[3/4] bg-background flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-lg leading-tight">
                            {language === "ar" ? item.nameAr : item.nameEn}
                          </h3>
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="p-1 text-foreground/40 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="text-sm text-foreground/60 mt-2 space-x-3 rtl:space-x-reverse font-medium">
                          {item.size && <span>{t("مقاس", "Size")}: {item.size}</span>}
                          {item.size && item.color && <span>|</span>}
                          {item.color && <span>{t("لون", "Color")}: {item.color}</span>}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-border bg-background h-10">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="w-10 h-full flex items-center justify-center hover:bg-secondary text-lg"
                          >-</button>
                          <span className="w-10 h-full flex items-center justify-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="w-10 h-full flex items-center justify-center hover:bg-secondary text-lg"
                          >+</button>
                        </div>
                        <span className="font-bold text-lg whitespace-nowrap">
                          {item.price} <span className="text-sm font-normal text-foreground/60">{t("ج.م", "EGP")}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Coupon Code ── */}
              <div className="border-t border-border/50 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-3 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" />
                  {t("كود الخصم", "Discount Code")}
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-500 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-black text-green-700 dark:text-green-400 tracking-widest">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500">
                        {t(`خصم ${appliedCoupon.discountPercentage}٪ مفعّل`, `${appliedCoupon.discountPercentage}% discount applied`)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                      placeholder={t("أدخلي الكود", "Enter code")}
                      className="h-12 rounded-none font-mono uppercase tracking-widest bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || validateCoupon.isPending}
                      className="h-12 px-5 rounded-none font-bold border-foreground hover:bg-foreground hover:text-background whitespace-nowrap"
                    >
                      {validateCoupon.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : t("تطبيق", "Apply")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-border/50 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-foreground/70">{t("المجموع", "Subtotal")}</span>
                  <span className="font-bold">{totalPrice} {t("ج.م", "EGP")}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-lg text-green-600 dark:text-green-400">
                    <span className="font-bold flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {t(`خصم ${appliedCoupon.discountPercentage}٪`, `${appliedCoupon.discountPercentage}% Off`)}
                    </span>
                    <span className="font-bold">- {discountAmount} {t("ج.م", "EGP")}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span className="text-foreground/70">{t("الشحن", "Shipping")}</span>
                  <span className="text-primary font-bold">{t("مجاني", "Free")}</span>
                </div>
                <div className="flex justify-between text-2xl font-serif font-black pt-6 mt-4 border-t border-border/50">
                  <span>{t("الإجمالي", "Total")}</span>
                  <span>{finalTotal} <span className="text-lg font-sans font-normal text-foreground/60">{t("ج.م", "EGP")}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Customers Also Bought ── */}
        {upsellProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-2">
                  {t("أضيفي معها", "Complete Your Look")}
                </p>
                <h2 className="text-3xl font-serif font-black text-foreground">
                  {t("العملاء اشتروا أيضاً", "Customers Also Bought")}
                </h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-foreground/50 hover:text-foreground transition-colors hidden md:block">
                {t("عرض الكل", "View all")} →
              </Link>
            </div>

            {/* Horizontal scroll strip */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-4 md:overflow-visible scrollbar-hide snap-x snap-mandatory">
              {upsellProducts.map((p) => {
                const name = language === "ar" ? p.nameAr : p.nameEn;
                const isDiscounted = p.originalPrice && p.originalPrice > p.price;
                const discountPct = isDiscounted ? Math.round((1 - p.price / p.originalPrice!) * 100) : 0;
                const added = justAdded.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="group flex-shrink-0 w-52 md:w-auto snap-start flex flex-col bg-background border border-border hover:border-foreground/30 transition-all duration-200"
                  >
                    {/* Image */}
                    <Link href={`/products/${p.id}`} className="block relative overflow-hidden">
                      <div className="aspect-[3/4] bg-secondary overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {isDiscounted && (
                        <span className="absolute top-2 left-2 rtl:right-2 rtl:left-auto bg-[#e63b2e] text-white text-xs font-bold px-2 py-1">
                          -{discountPct}%
                        </span>
                      )}
                    </Link>

                    {/* Info + Add button */}
                    <div className="p-3 flex flex-col gap-3 flex-1">
                      <div className="flex-1">
                        <Link href={`/products/${p.id}`}>
                          <h3 className="text-sm font-bold leading-snug line-clamp-2 hover:text-primary transition-colors">
                            {name}
                          </h3>
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="font-black text-base text-foreground">
                            {p.price}
                            <span className="text-xs font-normal text-foreground/50 mr-0.5 rtl:ml-0.5 rtl:mr-0">
                              {t(" ج.م", " EGP")}
                            </span>
                          </span>
                          {isDiscounted && (
                            <span className="text-xs text-muted-foreground line-through">
                              {p.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpsellAdd(p)}
                        disabled={added}
                        className={`w-full h-10 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                          added
                            ? "bg-green-600 border-green-600 text-white"
                            : "bg-foreground border-foreground text-background hover:bg-primary hover:border-primary"
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            {t("تمت الإضافة", "Added!")}
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            {t(`أضفي — ${p.price} ج.م`, `Add — ${p.price} EGP`)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
