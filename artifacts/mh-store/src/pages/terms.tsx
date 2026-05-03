import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { Link } from "wouter";

function Section({ n, titleAr, titleEn, children }: {
  n: string; titleAr: string; titleEn: string; children: React.ReactNode;
}) {
  const { language } = useI18n();
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <span className="text-3xl font-serif font-black text-primary/30 leading-none">{n}</span>
        <h2 className="text-xl font-serif font-bold pt-1">{language === "ar" ? titleAr : titleEn}</h2>
      </div>
      <div className="text-foreground/70 leading-relaxed space-y-3 text-sm pr-10 rtl:pl-10 rtl:pr-0">
        {children}
      </div>
    </div>
  );
}

export default function Terms() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { brand } = settings;
  const storeName = brand.storeName;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("وثيقة قانونية", "LEGAL DOCUMENT")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("الشروط والأحكام", "Terms & Conditions")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t(
            `يُرجى قراءة هذه الشروط بعناية قبل استخدام موقع ${storeName}.`,
            `Please read these terms carefully before using the ${storeName} website.`
          )}
        </p>
        <p className="text-background/40 text-xs mt-4">{t("آخر تحديث: مايو 2026", "Last updated: May 2026")}</p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        {/* Intro */}
        <div className="bg-primary/5 border-r-4 border-primary rtl:border-l-4 rtl:border-r-0 p-6 mb-12 text-sm text-foreground/70 leading-relaxed">
          {t(
            `باستخدامك لموقع ${storeName} الإلكتروني أو إجراء أي عملية شراء، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يُرجى عدم استخدام الموقع.`,
            `By using the ${storeName} website or making any purchase, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the website.`
          )}
        </div>

        <div className="space-y-12 divide-y divide-border">
          <Section n="01" titleAr="قبول الشروط" titleEn="Acceptance of Terms">
            <p>{t(
              `يُعتبر وصولك واستخدامك لموقع ${storeName} الإلكتروني موافقةً منك على هذه الشروط والأحكام وسياسة الخصوصية الخاصة بنا.`,
              `Your access and use of the ${storeName} website constitutes your agreement to these Terms and Conditions and our Privacy Policy.`
            )}</p>
            <p>{t(
              "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيُشير تاريخ 'آخر تحديث' إلى تاريخ آخر مراجعة.",
              "We reserve the right to modify these terms at any time. The 'Last updated' date will indicate the date of the last revision."
            )}</p>
          </Section>

          <div className="pt-12">
            <Section n="02" titleAr="استخدام الموقع" titleEn="Use of the Website">
              <p>{t("أنت توافق على استخدام الموقع فقط للأغراض المشروعة وبما يتوافق مع القوانين المعمول بها في جمهورية مصر العربية.", "You agree to use the website only for lawful purposes and in compliance with the laws of the Arab Republic of Egypt.")}</p>
              <ul className="list-none space-y-2">
                {[
                  t("لا يجوز نسخ أو إعادة نشر أي محتوى من الموقع دون إذن كتابي مسبق.", "You may not copy or republish any content from the website without prior written permission."),
                  t("لا يجوز استخدام الموقع لأي أنشطة غير مشروعة أو احتيالية.", "You may not use the website for any illegal or fraudulent activities."),
                  t("يُحظر محاولة الوصول غير المصرح به إلى أي جزء من الموقع أو أنظمته.", "Attempting unauthorized access to any part of the website or its systems is prohibited."),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="03" titleAr="الطلبات والدفع" titleEn="Orders & Payment">
              <p>{t(
                `عند تقديم طلب عبر ${storeName}، فإنك تقدم عرضاً لشراء المنتجات المختارة. يحق لنا قبول الطلب أو رفضه في أي وقت.`,
                `When you place an order through ${storeName}, you are making an offer to purchase the selected products. We reserve the right to accept or reject any order at any time.`
              )}</p>
              <p>{t(
                "أسعار المنتجات محددة بالجنيه المصري (ج.م) وقابلة للتغيير دون إشعار مسبق. سعر الطلب المؤكد لن يتغير.",
                "Product prices are specified in Egyptian Pounds (EGP) and are subject to change without prior notice. The price of a confirmed order will not change."
              )}</p>
              <p>{t(
                "نحتفظ بالحق في إلغاء أي طلب في حالة وجود خطأ في السعر أو نقص في المخزون.",
                "We reserve the right to cancel any order in the event of a pricing error or stock shortage."
              )}</p>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="04" titleAr="الشحن والتوصيل" titleEn="Shipping & Delivery">
              <p>{t(
                "مواعيد التوصيل المذكورة تقديرية وغير مضمونة. لا نتحمل مسؤولية التأخيرات الناجمة عن ظروف خارجة عن إرادتنا مثل الكوارث الطبيعية أو الاضطرابات.",
                "Mentioned delivery timeframes are estimates and are not guaranteed. We are not responsible for delays caused by circumstances beyond our control such as natural disasters or disruptions."
              )}</p>
              <p>{t(
                "للاطلاع على التفاصيل الكاملة لسياسة الشحن والتوصيل، يُرجى زيارة صفحة سياسة الشحن.",
                "For full details on our shipping and delivery policy, please visit the Shipping Policy page."
              )}</p>
              <Link href="/shipping" className="inline-block text-primary text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">
                {t("← سياسة الشحن والتوصيل", "Shipping & Delivery Policy →")}
              </Link>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="05" titleAr="سياسة الاسترجاع والاستبدال" titleEn="Returns & Exchange Policy">
              <p>{t(
                "نقبل استرجاع المنتجات التي تستوفي شروط سياسة الاسترجاع خلال 14 يوماً من تاريخ الاستلام.",
                "We accept returns for products that meet the return policy conditions within 14 days of receipt."
              )}</p>
              <p>{t(
                "المنتجات المستخدمة أو المغسولة أو التي أُزيلت منها العلامات الأصلية غير مؤهلة للاسترجاع.",
                "Used, washed, or products with removed original tags are not eligible for return."
              )}</p>
              <Link href="/returns" className="inline-block text-primary text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">
                {t("← سياسة الاسترجاع الكاملة", "Full Returns Policy →")}
              </Link>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="06" titleAr="الملكية الفكرية" titleEn="Intellectual Property">
              <p>{t(
                `جميع محتويات هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصميمات، هي ملك لـ ${storeName} ومحمية بموجب قوانين الملكية الفكرية المصرية والدولية.`,
                `All content on this website, including texts, images, logos, and designs, is the property of ${storeName} and is protected by Egyptian and international intellectual property laws.`
              )}</p>
              <p>{t(
                "لا يُسمح بإعادة استخدام أي محتوى لأغراض تجارية دون الحصول على إذن خطي مسبق.",
                "Re-use of any content for commercial purposes is not permitted without obtaining prior written permission."
              )}</p>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="07" titleAr="إخلاء المسؤولية" titleEn="Disclaimer of Liability">
              <p>{t(
                `يتم توفير خدمات ${storeName} 'كما هي' دون أي ضمانات صريحة أو ضمنية. لا نضمن أن الموقع سيكون خالياً من الأخطاء أو متاحاً في جميع الأوقات.`,
                `${storeName} services are provided 'as is' without any express or implied warranties. We do not guarantee that the website will be error-free or available at all times.`
              )}</p>
              <p>{t(
                "لن نكون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة ناجمة عن استخدام خدماتنا.",
                "We will not be liable for any indirect, incidental, or special damages arising from the use of our services."
              )}</p>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="08" titleAr="القانون الحاكم" titleEn="Governing Law">
              <p>{t(
                "تخضع هذه الشروط والأحكام وتُفسَّر وفقاً لقوانين جمهورية مصر العربية. أي نزاعات تنشأ من هذه الشروط تخضع للاختصاص القضائي الحصري للمحاكم المصرية.",
                "These Terms and Conditions are governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any disputes arising from these terms are subject to the exclusive jurisdiction of Egyptian courts."
              )}</p>
            </Section>
          </div>

          <div className="pt-12">
            <Section n="09" titleAr="التواصل معنا" titleEn="Contact Us">
              <p>{t(
                "إذا كان لديك أي استفسارات حول هذه الشروط والأحكام، يُرجى التواصل معنا:",
                "If you have any questions about these Terms and Conditions, please contact us:"
              )}</p>
              <div className="bg-secondary/40 border border-border p-4 space-y-2 mt-3">
                <p className="font-bold">{storeName}</p>
                <Link href="/contact" className="text-primary text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity block">
                  {t("صفحة التواصل معنا", "Contact Us Page")}
                </Link>
              </div>
            </Section>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
          <p>{t("آخر تحديث: مايو 2026", "Last updated: May 2026")}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">{t("سياسة الخصوصية", "Privacy Policy")}</Link>
            <span>·</span>
            <Link href="/returns" className="hover:text-primary transition-colors">{t("سياسة الاسترجاع", "Return Policy")}</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
