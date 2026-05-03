import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { Link } from "wouter";

type FAQ = { q: { ar: string; en: string }; a: { ar: string; en: string } };

const FAQS: { category: { ar: string; en: string }; items: FAQ[] }[] = [
  {
    category: { ar: "الطلبات", en: "Orders" },
    items: [
      {
        q: { ar: "كيف أضع طلباً؟", en: "How do I place an order?" },
        a: { ar: "اختاري المنتج الذي يعجبك، أضيفيه للسلة، ثم اكملي بيانات التوصيل وطريقة الدفع، وستصلك رسالة تأكيد.", en: "Choose the product you like, add it to the cart, then complete your delivery details and payment method, and you'll receive a confirmation message." },
      },
      {
        q: { ar: "هل يمكنني تعديل أو إلغاء طلبي؟", en: "Can I modify or cancel my order?" },
        a: { ar: "يمكنك تعديل أو إلغاء طلبك خلال ساعتين من تقديمه فقط. بعد ذلك، يبدأ تجهيز الطلب وقد لا يكون الإلغاء ممكناً. تواصلي معنا فوراً عبر واتساب.", en: "You can modify or cancel your order within 2 hours of placing it only. After that, order preparation begins and cancellation may not be possible. Contact us immediately via WhatsApp." },
      },
      {
        q: { ar: "هل يمكنني تتبع حالة طلبي؟", en: "Can I track the status of my order?" },
        a: { ar: "نعم، يمكنك تتبع طلبك في أي وقت عبر صفحة 'تتبع الطلب' على موقعنا باستخدام رقم هاتفك المسجل.", en: "Yes, you can track your order at any time through the 'Track Order' page on our site using your registered phone number." },
      },
      {
        q: { ar: "ماذا يحدث إذا لم أكن متاحة عند التوصيل؟", en: "What happens if I'm not available at delivery?" },
        a: { ar: "سيحاول المندوب التواصل معك. إذا لم يتمكن من التوصيل، سيتم إعادة جدولة التوصيل مرة أخرى. قد تُطبَّق رسوم إعادة شحن.", en: "The courier will try to contact you. If delivery is not possible, it will be rescheduled. Reshipping fees may apply." },
      },
    ],
  },
  {
    category: { ar: "الدفع", en: "Payment" },
    items: [
      {
        q: { ar: "ما طرق الدفع المتاحة؟", en: "What payment methods are available?" },
        a: { ar: "نقبل الدفع عند الاستلام (كاش)، فودافون كاش، إنستا باي، فوري، والبطاقات البنكية. اختاري طريقة الدفع المناسبة لك عند إتمام الطلب.", en: "We accept Cash on Delivery (COD), Vodafone Cash, InstaPay, Fawry, and bank cards. Choose the payment method that suits you when completing your order." },
      },
      {
        q: { ar: "هل الدفع آمن على موقعك؟", en: "Is payment safe on your site?" },
        a: { ar: "نعم، جميع وسائل الدفع الإلكتروني مؤمّنة بالكامل. للدفع عند الاستلام، لن تدفعي أي شيء حتى تستلمي طلبك.", en: "Yes, all electronic payment methods are fully secured. For cash on delivery, you won't pay anything until you receive your order." },
      },
      {
        q: { ar: "هل يمكنني الدفع بالتقسيط؟", en: "Can I pay in installments?" },
        a: { ar: "حالياً لا نقدم خدمة التقسيط المباشر، لكن يمكنك الاستفادة من خدمة التقسيط المتاحة عبر بطاقتك البنكية.", en: "Currently we don't offer direct installment service, but you can benefit from installment services available through your bank card." },
      },
    ],
  },
  {
    category: { ar: "الشحن والتوصيل", en: "Shipping & Delivery" },
    items: [
      {
        q: { ar: "كم يستغرق التوصيل؟", en: "How long does delivery take?" },
        a: { ar: "2-3 أيام عمل للقاهرة والجيزة، و3-5 أيام عمل لباقي المحافظات. الأيام قد تزيد في الأعياد والمواسم.", en: "2-3 business days for Cairo and Giza, and 3-5 business days for other governorates. Days may increase during holidays and seasons." },
      },
      {
        q: { ar: "كم تكلفة الشحن؟", en: "What is the shipping cost?" },
        a: { ar: "الشحن مجاني للطلبات فوق 500 جنيه. أما الطلبات الأقل فتكلفة الشحن 50 جنيه.", en: "Shipping is free for orders over 500 EGP. For orders below that, the shipping cost is 50 EGP." },
      },
      {
        q: { ar: "هل توصلون لجميع المحافظات؟", en: "Do you deliver to all governorates?" },
        a: { ar: "نعم، نوصّل لجميع محافظات مصر.", en: "Yes, we deliver to all Egyptian governorates." },
      },
    ],
  },
  {
    category: { ar: "المنتجات والمقاسات", en: "Products & Sizes" },
    items: [
      {
        q: { ar: "كيف أعرف المقاس المناسب؟", en: "How do I find the right size?" },
        a: { ar: "كل منتج يحتوي على جدول مقاسات مفصّل في صفحته. إذا كنت بين مقاسين، ننصح باختيار المقاس الأكبر. يمكنك أيضاً التواصل معنا للمساعدة.", en: "Each product has a detailed size chart on its page. If you're between two sizes, we recommend choosing the larger size. You can also contact us for help." },
      },
      {
        q: { ar: "هل المنتجات أصلية وعالية الجودة؟", en: "Are the products authentic and high quality?" },
        a: { ar: "نعم، نختار كل منتج بعناية ونتحقق من جودته قبل إضافته للمتجر. جودة المنتج مضمونة 100%.", en: "Yes, we carefully select every product and verify its quality before adding it to the store. Product quality is 100% guaranteed." },
      },
      {
        q: { ar: "هل يمكنني مقارنة المنتجات؟", en: "Can I compare products?" },
        a: { ar: "نعم! موقعنا يدعم خاصية مقارنة المنتجات. أضيفي المنتجات التي تريدين مقارنتها وستظهر جنباً إلى جنب.", en: "Yes! Our site supports product comparison. Add the products you want to compare and they will appear side by side." },
      },
    ],
  },
  {
    category: { ar: "الاسترجاع والاستبدال", en: "Returns & Exchanges" },
    items: [
      {
        q: { ar: "هل يمكنني استرجاع المنتج؟", en: "Can I return a product?" },
        a: { ar: "نعم، نقبل الاسترجاع خلال 14 يوماً من الاستلام للمنتجات غير المستخدمة والمحتفظة بعلاماتها الأصلية.", en: "Yes, we accept returns within 14 days of receipt for unused products that retain their original tags." },
      },
      {
        q: { ar: "كيف أطلب الاستبدال؟", en: "How do I request an exchange?" },
        a: { ar: "تواصلي معنا عبر واتساب مع صور للمنتج، وسنرتب لك عملية الاستبدال في أقرب وقت.", en: "Contact us via WhatsApp with photos of the product and we will arrange the exchange process for you as soon as possible." },
      },
    ],
  },
];

function FAQItem({ item }: { item: FAQ }) {
  const [open, setOpen] = useState(false);
  const { language } = useI18n();
  return (
    <div className={`border border-border transition-colors ${open ? "bg-primary/5 border-primary/30" : "bg-card hover:border-border/80"}`}>
      <button
        className="w-full flex items-center justify-between p-5 text-start gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-base">{language === "ar" ? item.q.ar : item.q.en}</span>
        {open ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-foreground/40 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-foreground/70 leading-relaxed text-sm border-t border-border/30 pt-4">
          {language === "ar" ? item.a.ar : item.a.en}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { contact } = settings;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("المساعدة والدعم", "HELP & SUPPORT")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("الأسئلة الشائعة", "Frequently Asked Questions")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t("إجابات على أكثر الأسئلة شيوعاً. لم تجدي إجابتك؟ تواصلي معنا مباشرة.", "Answers to the most common questions. Didn't find your answer? Contact us directly.")}
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <div className="space-y-12">
          {FAQS.map((section) => (
            <div key={section.category.ar}>
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-0.5 bg-primary inline-block" />
                {language === "ar" ? section.category.ar : section.category.en}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <FAQItem key={i} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-16 bg-secondary/40 border border-border p-10 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">{t("لم تجدي إجابتك؟", "Didn't find your answer?")}</h2>
          <p className="text-foreground/60 mb-8">
            {t("فريقنا متاح للمساعدة. تواصلي معنا عبر واتساب أو الهاتف.", "Our team is available to help. Contact us via WhatsApp or phone.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 font-bold hover:bg-green-700 transition-colors"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/></svg>
                WhatsApp
              </a>
            )}
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3 font-bold hover:bg-primary transition-colors"
            >
              {t("نموذج التواصل", "Contact Form")}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
