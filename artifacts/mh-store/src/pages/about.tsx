import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/site-settings-context";

export default function About() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { brand } = settings;

  return (
    <Layout>
      {/* Hero */}
      <div className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-32 md:py-40 text-center">
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6">{t("من نحن", "ABOUT US")}</p>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 leading-tight">
            {brand.storeName}
          </h1>
          <p className="text-xl md:text-2xl font-light text-background/70 max-w-2xl mx-auto leading-relaxed">
            {language === "ar" ? brand.taglineAr : brand.taglineEn}
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6">{t("قصتنا", "OUR STORY")}</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black mb-8 leading-tight">
              {t("بُنيت بشغف للمرأة المصرية", "Built with Passion for Egyptian Women")}
            </h2>
            <div className="space-y-5 text-foreground/70 font-light text-lg leading-relaxed">
              <p>
                {t(
                  "نور وُلدت من حب حقيقي للموضة وإيمان راسخ بأن كل امرأة مصرية تستحق أن تبدو رائعة بأسعار عادلة.",
                  "Noor was born from a genuine love of fashion and a firm belief that every Egyptian woman deserves to look incredible at fair prices."
                )}
              </p>
              <p>
                {t(
                  "بدأنا بسؤال بسيط: لماذا لا توجد وجهة أزياء موثوقة تجمع بين الجمال والجودة والأسعار المناسبة للسوق المصري؟ كانت الإجابة هي نور.",
                  "We started with a simple question: why isn't there a trusted fashion destination that combines beauty, quality, and prices suited to the Egyptian market? The answer was Noor."
                )}
              </p>
              <p>
                {t(
                  "نقدم تشكيلات مختارة بعناية من أجمل صيحات الموضة — من الفساتين الأنيقة للمناسبات، إلى الملابس اليومية المريحة، إلى العبايات الراقية والشنط الفاخرة.",
                  "We offer carefully curated collections from the finest fashion trends — from elegant occasion dresses, to comfortable everyday wear, to sophisticated abayas and luxury bags."
                )}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80" alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="aspect-[3/4] overflow-hidden mt-12">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-secondary/40 py-24">
        <div className="container mx-auto px-4">
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 text-center">{t("قيمنا", "OUR VALUES")}</p>
          <h2 className="text-4xl font-serif font-black text-center mb-16">{t("لماذا تختارين نور؟", "Why Choose Noor?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                n: "01",
                ar: "جودة لا تُضاهى",
                en: "Unmatched Quality",
                textAr: "نختار كل قطعة بعين ناقدة وذوق رفيع. كل خامة، كل تفصيلة، كل لون يمر بمعايير صارمة قبل أن يصل إليك.",
                textEn: "We select every piece with a critical eye and refined taste. Every fabric, detail, and color passes strict standards before reaching you.",
              },
              {
                n: "02",
                ar: "أسعار عادلة دائماً",
                en: "Always Fair Prices",
                textAr: "نؤمن أن الموضة الراقية لا يجب أن تكون حكراً على أحد. أسعارنا عادلة لأننا نريدك أن تعودي.",
                textEn: "We believe premium fashion shouldn't be exclusive to anyone. Our prices are fair because we want you to come back.",
              },
              {
                n: "03",
                ar: "تجربة تسوق استثنائية",
                en: "Exceptional Shopping Experience",
                textAr: "من اللحظة التي تفتحين فيها الموقع حتى لحظة استلام طلبك، كل تفصيلة مصممة لراحتك وسعادتك.",
                textEn: "From the moment you open the site to the moment you receive your order, every detail is designed for your comfort and happiness.",
              },
            ].map((v) => (
              <div key={v.n} className="bg-background p-8 border border-border">
                <div className="text-4xl font-serif font-black text-primary/30 mb-6">{v.n}</div>
                <h3 className="text-xl font-serif font-bold mb-4">{language === "ar" ? v.ar : v.en}</h3>
                <p className="text-foreground/60 leading-relaxed font-light">{language === "ar" ? v.textAr : v.textEn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { num: "+500", ar: "منتج مختار", en: "Curated Products" },
              { num: "+10K", ar: "عميلة سعيدة", en: "Happy Customers" },
              { num: "100%", ar: "أصالة مضمونة", en: "Authenticity Guaranteed" },
              { num: "14", ar: "يوم استرجاع", en: "Day Returns" },
            ].map((s) => (
              <div key={s.num}>
                <div className="text-4xl md:text-5xl font-serif font-black text-primary mb-3">{s.num}</div>
                <div className="text-background/60 font-light text-sm uppercase tracking-wide">{language === "ar" ? s.ar : s.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-black mb-6">
          {t("مستعدة للبدء؟", "Ready to Start?")}
        </h2>
        <p className="text-foreground/60 mb-10 text-lg font-light max-w-lg mx-auto">
          {t("اكتشفي أحدث مجموعاتنا وأضيفي أناقتك الخاصة.", "Discover our latest collections and add your own elegance.")}
        </p>
        <Link href="/products">
          <Button size="lg" className="h-14 px-12 text-lg font-serif font-bold rounded-none">
            {t("تسوق الآن", "Shop Now")}
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
