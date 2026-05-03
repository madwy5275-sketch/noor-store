import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { Link } from "wouter";

const METHODS = [
  {
    id: "cod",
    icon: "💵",
    labelAr: "الدفع عند الاستلام",
    labelEn: "Cash on Delivery (COD)",
    color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    headingColor: "text-green-800 dark:text-green-400",
    stepsAr: [
      "اختاري منتجاتك وأكملي الطلب",
      "ستصلك رسالة تأكيد من فريقنا",
      "ادفعي نقداً للمندوب عند الاستلام",
    ],
    stepsEn: [
      "Choose your products and complete the order",
      "You'll receive a confirmation from our team",
      "Pay cash to the courier upon delivery",
    ],
    noteAr: "لا يلزمك دفع أي مبلغ مقدم. ادفعي فقط عند استلام طلبك.",
    noteEn: "No upfront payment required. Pay only when you receive your order.",
  },
  {
    id: "vodafone_cash",
    icon: "📱",
    labelAr: "فودافون كاش",
    labelEn: "Vodafone Cash",
    color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    headingColor: "text-red-800 dark:text-red-400",
    stepsAr: [
      "اختاري فودافون كاش كطريقة دفع عند الطلب",
      "حوّلي المبلغ على الرقم الظاهر في صفحة الطلب",
      "اضغطي تأكيد الطلب بعد إتمام التحويل",
    ],
    stepsEn: [
      "Choose Vodafone Cash as payment method at checkout",
      "Transfer the amount to the number shown on the order page",
      "Press confirm order after completing the transfer",
    ],
    noteAr: "يُعالج التحويل فورياً. سيتأكد فريقنا من الدفع خلال دقائق.",
    noteEn: "Transfer is processed instantly. Our team will verify payment within minutes.",
  },
  {
    id: "instapay",
    icon: "⚡",
    labelAr: "إنستا باي",
    labelEn: "InstaPay",
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    headingColor: "text-blue-800 dark:text-blue-400",
    stepsAr: [
      "اختاري إنستا باي كطريقة دفع",
      "افتحي تطبيق البنك أو محفظتك الرقمية",
      "حوّلي المبلغ على المعرّف الظاهر في صفحة الطلب",
      "اضغطي تأكيد الطلب بعد إتمام التحويل",
    ],
    stepsEn: [
      "Choose InstaPay as payment method",
      "Open your bank app or digital wallet",
      "Transfer the amount to the ID shown on the order page",
      "Press confirm order after completing the transfer",
    ],
    noteAr: "التحويل فوري بين جميع البنوك المصرية المشتركة في الشبكة.",
    noteEn: "Transfer is instant between all Egyptian banks on the network.",
  },
  {
    id: "fawry",
    icon: "🏪",
    labelAr: "فوري",
    labelEn: "Fawry",
    color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    headingColor: "text-orange-800 dark:text-orange-400",
    stepsAr: [
      "اختاري فوري كطريقة دفع",
      "اذهبي لأقرب نقطة فوري أو استخدمي تطبيق MyFawry",
      "ادفعي المبلغ باستخدام الرقم الظاهر في صفحة الطلب",
      "اضغطي تأكيد الطلب بعد إتمام الدفع",
    ],
    stepsEn: [
      "Choose Fawry as payment method",
      "Go to the nearest Fawry point or use the MyFawry app",
      "Pay the amount using the number shown on the order page",
      "Press confirm order after completing the payment",
    ],
    noteAr: "فوري متاح في أكثر من 300,000 نقطة في مصر.",
    noteEn: "Fawry is available at more than 300,000 points across Egypt.",
  },
  {
    id: "card",
    icon: "💳",
    labelAr: "بطاقة بنكية",
    labelEn: "Bank Card (Visa / Mastercard / Meeza)",
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
    headingColor: "text-purple-800 dark:text-purple-400",
    stepsAr: [
      "اختاري البطاقة البنكية كطريقة دفع",
      "انتقلي لرابط الدفع الآمن الظاهر في صفحة الطلب",
      "أدخلي بيانات بطاقتك وأكملي الدفع",
      "اضغطي تأكيد الطلب بعد إتمام الدفع",
    ],
    stepsEn: [
      "Choose bank card as payment method",
      "Navigate to the secure payment link shown on the order page",
      "Enter your card details and complete the payment",
      "Press confirm order after completing the payment",
    ],
    noteAr: "جميع المعاملات مشفرة ومحمية بأحدث معايير الأمان.",
    noteEn: "All transactions are encrypted and protected by the latest security standards.",
  },
];

export default function PaymentMethods() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const payment = settings.payment;

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success(t("تم نسخ الرقم!", "Number copied!"));
  };

  const getDetail = (id: string) => {
    if (id === "vodafone_cash") return payment.vodafone_cash;
    if (id === "instapay") return payment.instapay;
    if (id === "fawry") return payment.fawry;
    if (id === "card") return payment.card;
    return null;
  };

  const enabledMethods = METHODS.filter(m => {
    if (m.id === "cod") return payment.cod.enabled;
    const d = getDetail(m.id);
    return d?.enabled;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("الدفع آمن وسهل", "SAFE & EASY PAYMENT")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("طرق الدفع المتاحة", "Available Payment Methods")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t("نوفر لك أكثر من طريقة دفع لراحتك. اختاري ما يناسبك.", "We offer more than one payment method for your convenience. Choose what suits you.")}
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">

        {/* Quick overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
          {enabledMethods.map(m => (
            <div key={m.id} className={`p-4 border text-center ${m.color}`}>
              <div className="text-3xl mb-2">{m.icon}</div>
              <p className={`text-xs font-bold ${m.headingColor}`}>{language === "ar" ? m.labelAr : m.labelEn}</p>
            </div>
          ))}
        </div>

        {/* Detailed cards */}
        <div className="space-y-6">
          {enabledMethods.map(m => {
            const detail = getDetail(m.id);
            const displayNum = detail?.phone || detail?.id || "";
            const steps = language === "ar" ? m.stepsAr : m.stepsEn;
            const note = language === "ar" ? m.noteAr : m.noteEn;
            return (
              <div key={m.id} className={`border p-8 ${m.color}`}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{m.icon}</span>
                  <h2 className={`text-2xl font-serif font-bold ${m.headingColor}`}>
                    {language === "ar" ? m.labelAr : m.labelEn}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-foreground/60 mb-4">{t("كيفية الدفع:", "How to Pay:")}</p>
                    <ol className="space-y-3">
                      {steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                          <div className={`w-6 h-6 rounded-full ${m.headingColor.replace("text-", "bg-").replace("800", "100").replace("400", "900/20")} border flex items-center justify-center flex-shrink-0 font-bold text-xs ${m.headingColor}`}>
                            {i + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4">
                    {displayNum && (
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider text-foreground/60 mb-3">
                          {m.id === "instapay" ? t("معرّف الحساب:", "Account ID:") : t("رقم الحساب:", "Account Number:")}
                        </p>
                        <div className="flex items-center gap-3 bg-white/60 dark:bg-black/20 border border-white/40 dark:border-white/10 px-4 py-3">
                          <span dir="ltr" className="font-mono font-bold text-xl tracking-widest flex-1 text-foreground">{displayNum}</span>
                          <button
                            type="button"
                            onClick={() => copyNumber(displayNum)}
                            className={`flex items-center gap-1.5 text-xs font-bold uppercase ${m.headingColor} hover:opacity-70 transition-opacity`}
                          >
                            <Copy className="h-4 w-4" />
                            {t("نسخ", "Copy")}
                          </button>
                        </div>
                      </div>
                    )}
                    {detail?.link && (
                      <a
                        href={detail.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm font-bold ${m.headingColor} underline underline-offset-4`}
                      >
                        {t("رابط الدفع الآمن ←", "Secure Payment Link →")}
                      </a>
                    )}
                    <div className={`p-4 bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10`}>
                      <div className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${m.headingColor}`} />
                        <p className="text-sm text-foreground/70">{note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ link */}
        <div className="mt-16 bg-secondary/40 border border-border p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-serif font-bold mb-2">{t("هل لديك سؤال عن الدفع؟", "Have a question about payment?")}</h3>
            <p className="text-foreground/60">{t("تصفحي الأسئلة الشائعة أو تواصلي معنا مباشرة.", "Browse the FAQ or contact us directly.")}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/faq" className="px-6 py-3 bg-foreground text-background font-bold text-sm hover:bg-primary transition-colors">
              {t("الأسئلة الشائعة", "FAQ")}
            </Link>
            <Link href="/contact" className="px-6 py-3 border border-border font-bold text-sm hover:border-primary transition-colors">
              {t("تواصل معنا", "Contact Us")}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
