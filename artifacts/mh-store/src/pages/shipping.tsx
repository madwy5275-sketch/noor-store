import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { Truck, Clock, MapPin, Package, CheckCircle, Phone } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings-context";

function Section({ icon: Icon, titleAr, titleEn, children }: {
  icon: React.ElementType; titleAr: string; titleEn: string; children: React.ReactNode;
}) {
  const { language } = useI18n();
  return (
    <div className="bg-card border border-border p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold">{language === "ar" ? titleAr : titleEn}</h2>
      </div>
      {children}
    </div>
  );
}

export default function Shipping() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { contact } = settings;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("معلومات التوصيل", "DELIVERY INFO")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("سياسة الشحن والتوصيل", "Shipping & Delivery Policy")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t("كل ما تحتاجين معرفته عن شحن طلبك وتوصيله إليك.", "Everything you need to know about shipping and delivering your order.")}
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl space-y-6">

        {/* Delivery Areas */}
        <Section icon={MapPin} titleAr="مناطق التوصيل" titleEn="Delivery Areas">
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p className="text-foreground font-medium">
              {t("نوصّل لجميع محافظات مصر 🇪🇬", "We deliver to all governorates in Egypt 🇪🇬")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {[
                t("القاهرة", "Cairo"),
                t("الجيزة", "Giza"),
                t("الإسكندرية", "Alexandria"),
                t("المنصورة", "Mansoura"),
                t("طنطا", "Tanta"),
                t("الإسماعيلية", "Ismailia"),
                t("بورسعيد", "Port Said"),
                t("السويس", "Suez"),
                t("أسوان", "Aswan"),
                t("الأقصر", "Luxor"),
                t("شرم الشيخ", "Sharm El-Sheikh"),
                t("وجميع المحافظات", "& All Governorates"),
              ].map((city) => (
                <div key={city} className="flex items-center gap-2 text-sm bg-secondary/50 px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Delivery Times */}
        <Section icon={Clock} titleAr="مواعيد التوصيل" titleEn="Delivery Timeframes">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/20 p-5">
                <p className="font-bold text-primary mb-2 text-lg">{t("القاهرة والجيزة", "Cairo & Giza")}</p>
                <p className="text-3xl font-serif font-black mb-1">2–3</p>
                <p className="text-sm text-foreground/60">{t("أيام عمل", "Business Days")}</p>
              </div>
              <div className="bg-secondary/50 border border-border p-5">
                <p className="font-bold mb-2 text-lg">{t("باقي المحافظات", "Other Governorates")}</p>
                <p className="text-3xl font-serif font-black mb-1">3–5</p>
                <p className="text-sm text-foreground/60">{t("أيام عمل", "Business Days")}</p>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-300">
              <strong>{t("ملاحظة:", "Note:")}</strong>{" "}
              {t(
                "المواعيد المذكورة تقديرية وقد تتأخر في المواسم والأعياد. سنتواصل معك لتأكيد الطلب ومتابعة التوصيل.",
                "The mentioned timeframes are estimates and may be delayed during seasons and holidays. We will contact you to confirm the order and follow up on delivery."
              )}
            </div>
          </div>
        </Section>

        {/* Shipping Fees */}
        <Section icon={Package} titleAr="تكاليف الشحن" titleEn="Shipping Fees">
          <div className="space-y-4">
            <div className="overflow-hidden border border-border">
              <table className="w-full text-sm">
                <thead className="bg-foreground text-background">
                  <tr>
                    <th className="p-4 text-start font-bold">{t("قيمة الطلب", "Order Value")}</th>
                    <th className="p-4 text-start font-bold">{t("تكلفة الشحن", "Shipping Cost")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 text-foreground/70">{t("أقل من 500 ج.م", "Under 500 EGP")}</td>
                    <td className="p-4 font-bold">50 {t("ج.م", "EGP")}</td>
                  </tr>
                  <tr className="bg-primary/5 border-b border-border">
                    <td className="p-4 text-foreground/70">{t("500 ج.م فأكثر", "500 EGP or more")}</td>
                    <td className="p-4 font-bold text-primary text-lg">{t("مجاني 🎉", "FREE 🎉")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-foreground/60">
              {t(
                "* الشحن المجاني ينطبق على جميع المحافظات بعد بلوغ الحد الأدنى من قيمة الطلب.",
                "* Free shipping applies to all governorates once the minimum order value is reached."
              )}
            </p>
          </div>
        </Section>

        {/* Order Tracking */}
        <Section icon={Truck} titleAr="تتبع الطلب" titleEn="Order Tracking">
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              {t(
                "بعد تأكيد طلبك، ستتلقى رسالة واتساب تتضمن تفاصيل طلبك وموعد التوصيل المتوقع.",
                "After confirming your order, you will receive a WhatsApp message with your order details and expected delivery date."
              )}
            </p>
            <p>
              {t(
                "يمكنك أيضاً تتبع طلبك في أي وقت عبر صفحة تتبع الطلبات على موقعنا باستخدام رقم هاتفك.",
                "You can also track your order at any time through our order tracking page using your phone number."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/track-order"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-bold text-sm hover:bg-primary transition-colors"
              >
                <Package className="h-4 w-4" />
                {t("تتبع طلبي الآن", "Track My Order Now")}
              </a>
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-bold text-sm hover:bg-green-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {t("تواصل عبر واتساب", "Contact via WhatsApp")}
                </a>
              )}
            </div>
          </div>
        </Section>

        {/* Important Notes */}
        <div className="bg-secondary/40 border border-border p-8">
          <h2 className="text-xl font-serif font-bold mb-6">{t("ملاحظات مهمة", "Important Notes")}</h2>
          <ul className="space-y-3 text-foreground/70 text-sm leading-relaxed">
            {[
              t("تأكدي من صحة العنوان ورقم الهاتف عند إتمام الطلب لضمان سرعة التوصيل.", "Make sure your address and phone number are correct when placing your order to ensure fast delivery."),
              t("في حالة غياب المستلم عند التوصيل، سيحاول المندوب التواصل معك. في حالة عدم الوصول، سيتم إعادة الطلب وإعادة جدولة التوصيل.", "If the recipient is absent during delivery, the courier will try to contact you. If unreachable, the order will be returned and delivery rescheduled."),
              t("مواعيد التوصيل أيام عمل رسمية (الأحد - الخميس)، ولا تشمل الجمعة والسبت وأيام الإجازات الرسمية.", "Delivery times are official working days (Sunday - Thursday) and do not include Friday, Saturday, or official holidays."),
              t("للطلبات الكبيرة أو خارج نطاق التغطية، يُرجى التواصل معنا مباشرة.", "For large orders or coverage edge cases, please contact us directly."),
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">{i + 1}</span>
                </div>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
