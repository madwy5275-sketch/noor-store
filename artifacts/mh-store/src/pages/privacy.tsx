import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { Link } from "wouter";
import { Shield, Eye, Lock, Trash2, Bell } from "lucide-react";

function Section({ icon: Icon, n, titleAr, titleEn, children }: {
  icon: React.ElementType; n: string; titleAr: string; titleEn: string; children: React.ReactNode;
}) {
  const { language } = useI18n();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">{n}</span>
          <h2 className="text-xl font-serif font-bold">{language === "ar" ? titleAr : titleEn}</h2>
        </div>
      </div>
      <div className="text-foreground/70 leading-relaxed space-y-3 text-sm pr-16 rtl:pl-16 rtl:pr-0">
        {children}
      </div>
    </div>
  );
}

export default function Privacy() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { brand } = settings;
  const storeName = brand.storeName;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-primary/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("وثيقة قانونية", "LEGAL DOCUMENT")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("سياسة الخصوصية", "Privacy Policy")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t(
            `خصوصيتك تهمنا. تعرفي على كيفية جمع واستخدام وحماية بياناتك في ${storeName}.`,
            `Your privacy matters to us. Learn how ${storeName} collects, uses, and protects your data.`
          )}
        </p>
        <p className="text-background/40 text-xs mt-4">{t("آخر تحديث: مايو 2026", "Last updated: May 2026")}</p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        {/* Summary boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Shield, ar: "لا نبيع بياناتك", en: "We never sell your data", textAr: "بياناتك تبقى ملكك وحدك.", textEn: "Your data remains yours alone." },
            { icon: Lock, ar: "تشفير كامل", en: "Full Encryption", textAr: "جميع البيانات محمية.", textEn: "All data is fully protected." },
            { icon: Trash2, ar: "حقك في الحذف", en: "Right to Delete", textAr: "يمكنك طلب حذف بياناتك.", textEn: "You can request data deletion." },
          ].map((item) => (
            <div key={item.ar} className="bg-card border border-border p-5 text-center">
              <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="font-bold mb-1">{language === "ar" ? item.ar : item.en}</p>
              <p className="text-xs text-foreground/50">{language === "ar" ? item.textAr : item.textEn}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12 divide-y divide-border">
          <Section icon={Eye} n="01" titleAr="المعلومات التي نجمعها" titleEn="Information We Collect">
            <p>{t("عند تفاعلك مع موقعنا، قد نجمع المعلومات التالية:", "When you interact with our website, we may collect the following information:")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {[
                { ar: "معلومات التسجيل", en: "Registration information", textAr: "الاسم، رقم الهاتف عند الطلب", textEn: "Name, phone number when ordering" },
                { ar: "معلومات التوصيل", en: "Delivery information", textAr: "العنوان والمحافظة", textEn: "Address and governorate" },
                { ar: "بيانات الطلبات", en: "Order data", textAr: "تاريخ الطلبات والمنتجات المشتراة", textEn: "Order history and purchased products" },
                { ar: "بيانات التصفح", en: "Browsing data", textAr: "الصفحات المزارة ووقت الزيارة", textEn: "Pages visited and visit time" },
              ].map((item) => (
                <div key={item.ar} className="bg-secondary/30 border border-border p-3">
                  <p className="font-bold text-xs uppercase tracking-wide text-foreground mb-1">{language === "ar" ? item.ar : item.en}</p>
                  <p className="text-xs text-foreground/60">{language === "ar" ? item.textAr : item.textEn}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="pt-12">
            <Section icon={Lock} n="02" titleAr="كيف نستخدم بياناتك" titleEn="How We Use Your Data">
              <p>{t("نستخدم المعلومات التي نجمعها للأغراض التالية فقط:", "We use the information we collect for the following purposes only:")}</p>
              <ul className="space-y-2">
                {[
                  t("معالجة وتأكيد طلباتك وتنظيم عمليات الشحن", "Processing and confirming your orders and organizing shipping operations"),
                  t("التواصل معك بشأن طلباتك واستفساراتك", "Communicating with you regarding your orders and inquiries"),
                  t("إرسال التحديثات والعروض إذا اخترت الاشتراك في النشرة البريدية", "Sending updates and offers if you chose to subscribe to the newsletter"),
                  t("تحسين تجربة التسوق وتطوير خدماتنا", "Improving the shopping experience and developing our services"),
                  t("منع الاحتيال وضمان أمان المعاملات", "Preventing fraud and ensuring transaction security"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="pt-12">
            <Section icon={Shield} n="03" titleAr="حماية بياناتك" titleEn="Data Protection">
              <p>{t(
                "نتخذ تدابير أمنية متعددة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو التدمير.",
                "We take multiple security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction."
              )}</p>
              <ul className="space-y-2">
                {[
                  t("تشفير SSL لجميع البيانات المنقولة", "SSL encryption for all transmitted data"),
                  t("تخزين آمن للبيانات في قواعد بيانات مشفرة", "Secure data storage in encrypted databases"),
                  t("وصول محدود لفريق العمل المخول فقط", "Limited access to authorized team members only"),
                  t("مراجعات أمنية دورية للأنظمة", "Periodic security reviews of systems"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="pt-12">
            <Section icon={Eye} n="04" titleAr="مشاركة البيانات مع أطراف ثالثة" titleEn="Sharing Data with Third Parties">
              <p className="font-bold text-foreground">{t("لا نبيع بياناتك الشخصية أبداً.", "We never sell your personal data.")}</p>
              <p>{t(
                "قد نشارك بعض البيانات الضرورية مع شركاء موثوقين لإتمام طلباتك فقط:",
                "We may share some necessary data with trusted partners only to complete your orders:"
              )}</p>
              <ul className="space-y-2">
                {[
                  t("شركات الشحن والتوصيل — للتوصيل وتتبع الطلبات فقط", "Shipping and delivery companies — for delivery and order tracking only"),
                  t("بوابات الدفع الإلكتروني — لمعالجة المدفوعات بأمان", "Electronic payment gateways — for securely processing payments"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-3 text-xs rounded-sm">
                {t(
                  "جميع شركائنا ملزمون بالحفاظ على سرية بياناتك وعدم استخدامها لأي غرض آخر.",
                  "All our partners are bound to maintain the confidentiality of your data and not use it for any other purpose."
                )}
              </p>
            </Section>
          </div>

          <div className="pt-12">
            <Section icon={Bell} n="05" titleAr="الكوكيز (ملفات الارتباط)" titleEn="Cookies">
              <p>{t(
                "يستخدم موقعنا ملفات الارتباط (Cookies) لتحسين تجربة التصفح وتذكر تفضيلاتك. هذه الملفات لا تحتوي على معلومات شخصية حساسة.",
                "Our website uses cookies to improve the browsing experience and remember your preferences. These files do not contain sensitive personal information."
              )}</p>
              <p>{t(
                "يمكنك التحكم في ملفات الارتباط من خلال إعدادات متصفحك. حذف ملفات الارتباط قد يؤثر على بعض وظائف الموقع.",
                "You can control cookies through your browser settings. Deleting cookies may affect some website functions."
              )}</p>
            </Section>
          </div>

          <div className="pt-12">
            <Section icon={Trash2} n="06" titleAr="حقوقك في بياناتك" titleEn="Your Data Rights">
              <p>{t("تتمتعين بالحقوق التالية فيما يتعلق ببياناتك الشخصية:", "You have the following rights regarding your personal data:")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { ar: "حق الوصول", en: "Right of Access", textAr: "الاطلاع على البيانات التي نحتفظ بها عنك", textEn: "View the data we hold about you" },
                  { ar: "حق التصحيح", en: "Right to Rectify", textAr: "تصحيح أي بيانات غير دقيقة", textEn: "Correct any inaccurate data" },
                  { ar: "حق الحذف", en: "Right to Delete", textAr: "طلب حذف بياناتك الشخصية", textEn: "Request deletion of your personal data" },
                  { ar: "حق الاعتراض", en: "Right to Object", textAr: "الاعتراض على معالجة بياناتك", textEn: "Object to the processing of your data" },
                ].map((item) => (
                  <div key={item.ar} className="bg-secondary/40 border border-border p-4">
                    <p className="font-bold text-sm mb-1">{language === "ar" ? item.ar : item.en}</p>
                    <p className="text-xs text-foreground/60">{language === "ar" ? item.textAr : item.textEn}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2">{t(
                "لممارسة أي من هذه الحقوق، يُرجى التواصل معنا مباشرة.",
                "To exercise any of these rights, please contact us directly."
              )}</p>
              <Link href="/contact" className="inline-block text-primary text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">
                {t("← تواصلي معنا", "Contact Us →")}
              </Link>
            </Section>
          </div>

          <div className="pt-12">
            <Section icon={Bell} n="07" titleAr="تغييرات على سياسة الخصوصية" titleEn="Changes to Privacy Policy">
              <p>{t(
                "نحتفظ بالحق في تعديل هذه السياسة في أي وقت. سنُخطرك بأي تغييرات جوهرية عبر نشر السياسة الجديدة على الموقع مع تحديث تاريخ 'آخر تحديث'.",
                "We reserve the right to modify this policy at any time. We will notify you of any material changes by publishing the new policy on the website and updating the 'Last updated' date."
              )}</p>
              <p>{t(
                "استمرار استخدامك للموقع بعد نشر أي تغييرات يُعتبر قبولاً منك للسياسة المعدلة.",
                "Your continued use of the website after posting any changes constitutes your acceptance of the revised policy."
              )}</p>
            </Section>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
          <p>{t("آخر تحديث: مايو 2026", "Last updated: May 2026")}</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-primary transition-colors">{t("الشروط والأحكام", "Terms & Conditions")}</Link>
            <span>·</span>
            <Link href="/returns" className="hover:text-primary transition-colors">{t("سياسة الاسترجاع", "Return Policy")}</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
