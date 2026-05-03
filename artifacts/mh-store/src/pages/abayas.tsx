import { useI18n } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ArrowLeft, ArrowRight, Sparkles, Shield, Star } from "lucide-react";
import { useState } from "react";
import { QuickViewModal } from "@/components/quick-view-modal";
import { Product } from "@workspace/api-client-react";

const ABAYA_FEATURES = [
  {
    icon: Sparkles,
    titleAr: "خامات فاخرة",
    titleEn: "Premium Fabrics",
    textAr: "كريب، جورجيت، وشيفون من أرقى المصادر",
    textEn: "Crepe, georgette, and chiffon from the finest sources",
  },
  {
    icon: Shield,
    titleAr: "تصميم محتشم",
    titleEn: "Modest Design",
    textAr: "كل عباية مصممة لتعكس أناقتك وقيمك",
    textEn: "Every abaya designed to reflect your elegance and values",
  },
  {
    icon: Star,
    titleAr: "مجموعات حصرية",
    titleEn: "Exclusive Collections",
    textAr: "تصاميم موسمية بلمسات خليجية ومصرية",
    textEn: "Seasonal designs with Gulf and Egyptian touches",
  },
];

const EDITORIAL_IMAGES = [
  {
    src: "https://i.pinimg.com/originals/d4/11/1b/d4111b15f617122b089e51954b3ac07f.jpg",
    captionAr: "العباية الكلاسيكية",
    captionEn: "The Classic Abaya",
  },
  {
    src: "https://www.glamourousgrace.com/cdn/shop/articles/elegant-abaya-collection-your-essential-guide-to-this-seasons-modest-fashion3a4b5fa6_515ee2d0-f960-454d-bca6-8908d7a2297a-6346700.jpg?v=1758822922&width=800",
    captionAr: "أناقة كل يوم",
    captionEn: "Everyday Elegance",
  },
  {
    src: "https://hikmahboutique.com.au/cdn/shop/files/rn-image_picker_lib_temp_60009d32-9b67-4c80-8a96-4b38e5f44113.jpg?v=1747557969&width=533",
    captionAr: "لمسة عصرية",
    captionEn: "Modern Touch",
  },
];

export default function Abayas() {
  const { t, language } = useI18n();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: allProducts, isLoading } = useListProducts();
  const abayas = allProducts?.filter((p) => p.categoryId === 4) ?? [];

  return (
    <Layout>
      {/* ── HERO BANNER ── */}
      <section className="relative w-full h-[75vh] min-h-[520px] overflow-hidden bg-black">
        <img
          src="https://www.glamourousgrace.com/cdn/shop/articles/elegant-abaya-collection-your-essential-guide-to-this-seasons-modest-fashion3a4b5fa6_515ee2d0-f960-454d-bca6-8908d7a2297a-6346700.jpg?v=1758822922&width=3000"
          alt="Abayas Collection"
          className="w-full h-full object-cover object-top animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-4 text-center">
          <span className="text-primary font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-5 px-5 py-2 border border-primary/60 backdrop-blur-sm bg-black/20">
            {t("تشكيلة نور للعبايات", "Noor Abayas Collection")}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white max-w-4xl mb-6 leading-tight drop-shadow-2xl">
            {t("أناقة تنبع من الداخل", "Elegance from Within")}
          </h1>
          <p className="text-lg text-white/70 max-w-lg mb-10 font-light">
            {t(
              "عبايات مصممة للمرأة المعاصرة — بخامات فاخرة وتصاميم محتشمة",
              "Abayas designed for the modern woman — premium fabrics, modest elegance"
            )}
          </p>
          <Link href="#collection">
            <Button
              size="lg"
              className="h-14 px-12 text-lg font-serif font-bold rounded-none bg-primary text-primary-foreground hover:bg-white hover:text-black transition-all duration-300"
            >
              {t("اكتشفي المجموعة", "Explore Collection")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x md:rtl:divide-x-reverse divide-background/20">
            {ABAYA_FEATURES.map((f) => (
              <div key={f.titleEn} className="p-10 text-center group">
                <f.icon className="h-8 w-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-serif font-bold mb-2">
                  {language === "ar" ? f.titleAr : f.titleEn}
                </h3>
                <p className="text-background/60 font-light text-sm">
                  {language === "ar" ? f.textAr : f.textEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL GRID ── */}
      <section className="py-0 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {EDITORIAL_IMAGES.map((item) => (
            <div key={item.captionEn} className="group relative overflow-hidden aspect-[4/5]">
              <img
                src={item.src}
                alt={language === "ar" ? item.captionAr : item.captionEn}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-2">
                  {t("تشكيلة نور", "Noor Collection")}
                </p>
                <h3 className="text-2xl font-serif font-black text-white">
                  {language === "ar" ? item.captionAr : item.captionEn}
                </h3>
                <div className="mt-3 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COLLECTION GRID ── */}
      <section id="collection" className="py-20 bg-[#f7f5f2]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-14">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3">
              {t("مجموعتنا الكاملة", "Full Collection")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground mb-4">
              {t("عبايات نور", "Noor Abayas")}
            </h2>
            <div className="h-1 w-16 bg-primary mt-2" />
            <p className="text-foreground/60 max-w-xl font-light mt-6">
              {t(
                "كل عباية قطعة فنية — من التطريز الخليجي إلى البساطة الأنيقة",
                "Every abaya is a work of art — from Gulf embroidery to elegant simplicity"
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
              ))}
            </div>
          ) : abayas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {abayas.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-foreground/50 text-lg">
                {t("قريباً — تشكيلة عبايات حصرية", "Coming Soon — Exclusive Abaya Collection")}
              </p>
            </div>
          )}

          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 font-bold text-sm uppercase tracking-wider rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                {t("كل المنتجات", "All Products")}
                {language === "ar" ? (
                  <ArrowLeft className="ms-2 h-4 w-4" />
                ) : (
                  <ArrowRight className="ms-2 h-4 w-4" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STYLING TIPS ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="https://www.mymodefa.com/cdn/shop/files/modefa-abaya-modest-muslim-woman-elegant-evening-pearl-embellished-abaya-3153-black-1160939272_400x.jpg?v=1746482675"
                alt="Abaya Styling"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 start-6 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest">
                {t("نصيحة ستايل", "Style Tip")}
              </div>
            </div>
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
                {t("دليل الاختيار", "Style Guide")}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground mb-8 leading-tight">
                {t("كيف تختارين عبايتك؟", "How to Choose Your Abaya?")}
              </h2>
              <div className="space-y-6">
                {[
                  {
                    n: "01",
                    titleAr: "المناسبة",
                    titleEn: "The Occasion",
                    textAr: "عبايات السهرة بتطريز فاخر، وعبايات الكاجوال للإطلالة اليومية المريحة.",
                    textEn: "Evening abayas with luxury embroidery, casual abayas for comfortable everyday wear.",
                  },
                  {
                    n: "02",
                    titleAr: "الخامة",
                    titleEn: "The Fabric",
                    textAr: "الكريب مثالي للصيف، والشيفون أنيق ورشيق لكل المواسم.",
                    textEn: "Crepe is perfect for summer, while chiffon is elegant for all seasons.",
                  },
                  {
                    n: "03",
                    titleAr: "المقاس الصح",
                    titleEn: "The Right Fit",
                    textAr: "قيسي طولك وعرض كتافك لتختاري مقاسك بدقة — راجعي دليل المقاسات.",
                    textEn: "Measure your height and shoulder width for the perfect fit — check our size guide.",
                  },
                ].map((step) => (
                  <div key={step.n} className="flex gap-6 items-start">
                    <span className="text-3xl font-serif font-black text-primary/30 shrink-0 w-12">
                      {step.n}
                    </span>
                    <div>
                      <h4 className="font-bold font-serif text-lg mb-1">
                        {language === "ar" ? step.titleAr : step.titleEn}
                      </h4>
                      <p className="text-foreground/60 font-light text-sm leading-relaxed">
                        {language === "ar" ? step.textAr : step.textEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a
                  href="https://wa.me/201552221286"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="h-14 px-10 font-serif font-bold rounded-none bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    {t("تواصلي مع المختصة", "Talk to a Stylist")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Layout>
  );
}
