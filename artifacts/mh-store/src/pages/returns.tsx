import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { RefreshCw, CheckCircle, XCircle, Phone, AlertCircle } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings-context";

export default function Returns() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { contact } = settings;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("خدمة ما بعد البيع", "AFTER SALES SERVICE")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("سياسة الاسترجاع والاستبدال", "Returns & Exchange Policy")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t("نضمن رضاك التام. تعرفي على سياستنا الشاملة للاسترجاع والاستبدال.", "We guarantee your complete satisfaction. Learn about our comprehensive returns and exchange policy.")}
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl space-y-6">

        {/* Main Policy */}
        <div className="bg-primary text-primary-foreground p-8 text-center">
          <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-serif font-black mb-3">
            {t("ضمان الاسترجاع لمدة 14 يوماً", "14-Day Return Guarantee")}
          </h2>
          <p className="text-primary-foreground/80 text-lg font-light max-w-lg mx-auto">
            {t(
              "إذا لم تكوني راضية عن منتجك لأي سبب، يمكنك استرجاعه خلال 14 يوماً من تاريخ الاستلام.",
              "If you are not satisfied with your product for any reason, you can return it within 14 days of receiving it."
            )}
          </p>
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accepted */}
          <div className="bg-card border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-7 w-7 text-green-500" />
              <h2 className="text-xl font-serif font-bold">{t("حالات الاسترجاع المقبولة ✓", "Accepted Return Cases ✓")}</h2>
            </div>
            <ul className="space-y-3">
              {[
                t("المنتج وصل تالفاً أو به عيب مصنعي", "Product arrived damaged or with a manufacturing defect"),
                t("المنتج مختلف عن الصورة أو الوصف بشكل واضح", "Product is clearly different from the image or description"),
                t("المقاس خاطئ رغم اختياره بشكل صحيح", "Wrong size despite being correctly selected"),
                t("المنتج لم يُستخدم ومحتفظاً بعلاماته الأصلية", "Product unused and retains original tags"),
                t("التغليف الأصلي سليم وغير مفتوح", "Original packaging intact and unopened"),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Accepted */}
          <div className="bg-card border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-7 w-7 text-red-500" />
              <h2 className="text-xl font-serif font-bold">{t("حالات لا يمكن الاسترجاع فيها ✗", "Non-Returnable Cases ✗")}</h2>
            </div>
            <ul className="space-y-3">
              {[
                t("تغيير الرأي أو عدم الإعجاب بالتصميم بعد الاستخدام", "Change of mind or disliking the design after use"),
                t("المنتج المستخدم أو المغسول", "Used or washed product"),
                t("إزالة علامات المنتج أو غلافه الأصلي", "Removal of product tags or original packaging"),
                t("مرور أكثر من 14 يوماً من تاريخ الاستلام", "More than 14 days have passed since receipt"),
                t("المنتجات المخفضة أو عروض التصفية", "Discounted or clearance sale products"),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-card border border-border p-8">
          <h2 className="text-2xl font-serif font-bold mb-8">{t("كيفية طلب الاسترجاع أو الاستبدال", "How to Request a Return or Exchange")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                ar: "تواصلي معنا",
                en: "Contact Us",
                textAr: "تواصلي معنا عبر واتساب أو الهاتف خلال 14 يوم من استلام طلبك.",
                textEn: "Contact us via WhatsApp or phone within 14 days of receiving your order.",
              },
              {
                step: "02",
                ar: "أرسلي صور المنتج",
                en: "Send Product Photos",
                textAr: "أرسلي صوراً واضحة للمنتج والعيب أو المشكلة لتقييم طلبك.",
                textEn: "Send clear photos of the product and defect or issue for evaluation.",
              },
              {
                step: "03",
                ar: "ستصلك التعليمات",
                en: "Receive Instructions",
                textAr: "سنوافيك بالتعليمات الكاملة لإعادة المنتج واسترداد قيمته أو استبداله.",
                textEn: "We will provide you with full instructions to return the product and get a refund or replacement.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-serif font-black text-primary/20 mb-4">{s.step}</div>
                <h3 className="font-bold text-lg mb-3">{language === "ar" ? s.ar : s.en}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{language === "ar" ? s.textAr : s.textEn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Methods */}
        <div className="bg-card border border-border p-8">
          <h2 className="text-2xl font-serif font-bold mb-6">{t("طرق رد المبلغ", "Refund Methods")}</h2>
          <div className="space-y-4 text-foreground/70">
            <div className="flex items-start gap-4 p-4 bg-secondary/40 border border-border">
              <div className="text-2xl">💵</div>
              <div>
                <p className="font-bold text-foreground">{t("الدفع عند الاستلام (COD)", "Cash on Delivery (COD)")}</p>
                <p className="text-sm mt-1">{t("يتم رد المبلغ نقداً مع مندوب الاستلام أو عبر واتساب/فوري خلال 3–5 أيام عمل.", "Amount refunded in cash with the pickup courier or via WhatsApp/Fawry within 3–5 business days.")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/40 border border-border">
              <div className="text-2xl">📱</div>
              <div>
                <p className="font-bold text-foreground">{t("فودافون كاش / إنستا باي", "Vodafone Cash / InstaPay")}</p>
                <p className="text-sm mt-1">{t("يتم رد المبلغ على رقمك المسجل خلال 1–3 أيام عمل.", "Amount refunded to your registered number within 1–3 business days.")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="flex items-start gap-4 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-2">{t("تذكيري:", "Reminder:")}</p>
            <p className="text-sm leading-relaxed">
              {t(
                "في حالة وصول منتج تالف أو غير مطابق، يُرجى التقاط صور فور الاستلام قبل فتح التغليف. سيساعد ذلك في تسريع معالجة طلبك.",
                "In case a damaged or non-conforming product arrives, please take photos immediately upon receipt before opening the packaging. This will help speed up processing your request."
              )}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-foreground text-background p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">{t("هل لديك سؤال؟", "Have a Question?")}</h2>
            <p className="text-background/60">{t("فريقنا جاهز لمساعدتك على مدار الساعة.", "Our team is ready to help you around the clock.")}</p>
          </div>
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-bold transition-colors whitespace-nowrap"
            >
              <Phone className="h-5 w-5" />
              {t("تواصل عبر واتساب", "Contact via WhatsApp")}
            </a>
          )}
        </div>
      </div>
    </Layout>
  );
}
