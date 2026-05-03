import { useI18n } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { QuickViewModal } from "@/components/quick-view-modal";
import { Product } from "@workspace/api-client-react";
import { useSiteSettings } from "@/contexts/site-settings-context";

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function Home() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { hero, banners, occasions, editorial, features, testimonials, sale, sections } = settings;

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const countdown = useCountdown(new Date(sale.endDate));

  const { data: featuredProducts, isLoading: loadingFeatured } = useListProducts({ featured: true });
  const { data: newArrivals, isLoading: loadingNewArrivals } = useListProducts();
  const { data: _categories } = useListCategories();

  useEffect(() => {
    const interval = setInterval(() => setTestimonialIdx((p) => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    if (hero.length < 2) return;
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % hero.length);
        setTransitioning(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [hero.length]);

  const slide = hero[current] ?? hero[0];

  const isSectionEnabled = (id: string) => {
    const found = sections.find((s) => s.id === id);
    return found ? found.enabled : true;
  };

  const SaleSection = () => (
    <section className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="font-serif font-black text-xl md:text-2xl mb-4">
          {language === "ar" ? sale.titleAr : sale.titleEn}
        </p>
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {[
            { v: countdown.days, labelAr: "يوم", labelEn: "Days" },
            { v: countdown.hours, labelAr: "ساعة", labelEn: "Hours" },
            { v: countdown.minutes, labelAr: "دقيقة", labelEn: "Min" },
            { v: countdown.seconds, labelAr: "ثانية", labelEn: "Sec" },
          ].map((item) => (
            <div key={item.labelEn} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-mono font-black tabular-nums leading-none">
                {String(item.v).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-80">
                {language === "ar" ? item.labelAr : item.labelEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const BannersSection = () => (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 gap-4 ${banners.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {banners.map((cat) => (
            <Link key={cat.labelEn + cat.href} href={cat.href} className="group relative overflow-hidden block aspect-[4/5]">
              <img src={cat.image} alt={language === "ar" ? cat.labelAr : cat.labelEn} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-4xl font-serif font-black text-white mb-3">
                  {language === "ar" ? cat.labelAr : cat.labelEn}
                </h3>
                <span className="text-white/80 text-sm uppercase tracking-widest font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {t("تسوق الآن", "Shop Now")}
                  {language === "ar" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  const NewArrivalsSection = () => (
    <section className="py-20 bg-[#f7f5f2]">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">{t("أحدث ما وصل", "Just In")}</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground">{t("وصل حديثاً", "New Arrivals")}</h2>
            <div className="h-1 w-16 bg-primary mt-4" />
          </div>
          <Link href="/products">
            <Button variant="ghost" className="hidden sm:flex group font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-primary">
              {t("عرض الكل", "View All")}
              {language === "ar" ? <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </Button>
          </Link>
        </div>
        {loadingNewArrivals ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {newArrivals?.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />)}
          </div>
        )}
      </div>
    </section>
  );

  const FeaturedSection = () => (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3">{t("حصري", "Exclusive")}</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground mb-4">{t("القطع المميزة", "Featured Pieces")}</h2>
          <p className="text-foreground/60 max-w-xl font-light">{t("تشكيلة مختارة بعناية من أفضل قطعنا", "A carefully curated selection of our best pieces")}</p>
        </div>
        {loadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {featuredProducts?.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />)}
          </div>
        )}
        <div className="mt-14 flex justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg" className="h-13 font-bold text-sm uppercase tracking-wider rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background min-w-[220px] transition-colors">
              {t("كل المنتجات", "View All Products")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );

  const FeaturesSection = () => (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 gap-0 divide-y md:divide-y-0 md:divide-x md:rtl:divide-x-reverse divide-background/20 ${features.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {features.map((item) => (
            <div key={item.n} className="p-12 text-center group">
              <span className="text-5xl font-serif font-black text-primary/30 block mb-6 group-hover:text-primary transition-colors duration-500">{item.n}</span>
              <h3 className="text-xl font-serif font-bold mb-3">{language === "ar" ? item.titleAr : item.titleEn}</h3>
              <p className="text-background/60 font-light text-sm">{language === "ar" ? item.textAr : item.textEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const OccasionsSection = () => (
    <section className="py-20 bg-[#f7f5f2]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">{t("تسوقي حسب المناسبة", "Shop by Occasion")}</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground">{t("إطلالة لكل لحظة", "A Look for Every Moment")}</h2>
          <div className="h-1 w-16 bg-primary mt-4 mx-auto" />
        </div>
        <div className={`grid grid-cols-2 gap-4 ${occasions.length >= 4 ? "md:grid-cols-4" : occasions.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {occasions.map((occasion) => (
            <Link key={occasion.labelEn + occasion.href} href={occasion.href} className="group relative overflow-hidden block aspect-[3/4] rounded-none">
              <img src={occasion.image} alt={language === "ar" ? occasion.labelAr : occasion.labelEn} className="w-full h-full object-cover object-top transition-transform duration-[1.8s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-serif font-black text-white mb-1 drop-shadow-lg">
                  {language === "ar" ? occasion.labelAr : occasion.labelEn}
                </h3>
                <p className="text-white/70 text-xs uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {language === "ar" ? occasion.subAr : occasion.subEn}
                </p>
                <div className="mt-3 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  const EditorialSection = () => (
    <section className="py-0 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {editorial.map((item) => (
          <Link key={item.labelEn + item.href} href={item.href} className={`group relative overflow-hidden block aspect-[4/5] ${item.featured ? "md:col-span-2 lg:col-span-1" : ""}`}>
            <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-2">{t("تسوق الآن", "Shop Now")}</p>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-white leading-tight">
                {language === "ar" ? item.labelAr : item.labelEn}
              </h3>
              <div className="mt-3 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section className="py-24 bg-[#f7f5f2] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">{t("ماذا يقول عملاؤنا", "CUSTOMER LOVE")}</p>
          <h2 className="text-4xl md:text-5xl font-serif font-black">{t("تجارب حقيقية", "Real Stories")}</h2>
        </div>
        <div className="relative max-w-3xl mx-auto">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`transition-all duration-700 ${idx === testimonialIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"}`}
            >
              <div className="bg-background p-10 md:p-14 text-center shadow-sm">
                <Quote className="h-10 w-10 text-primary/20 mx-auto mb-6 fill-current" />
                <p className="text-lg md:text-xl font-light leading-relaxed text-foreground/80 mb-8">
                  {language === "ar" ? item.textAr : item.textEn}
                </p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="font-serif font-bold text-foreground">{language === "ar" ? item.nameAr : item.nameEn}</p>
                <p className="text-sm text-muted-foreground mt-1">{language === "ar" ? item.cityAr : item.cityEn}</p>
              </div>
            </div>
          ))}
        </div>
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-foreground/20 hover:bg-foreground/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  const SECTION_COMPONENTS: Record<string, React.FC> = {
    sale: SaleSection,
    banners: BannersSection,
    new_arrivals: NewArrivalsSection,
    featured: FeaturedSection,
    features: FeaturesSection,
    occasions: OccasionsSection,
    editorial: EditorialSection,
    testimonials: TestimonialsSection,
  };

  return (
    <Layout>
      {/* ── HERO (always shown, not in sections) ── */}
      {slide && (
        <section className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-black">
          {hero.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              <img src={s.image} alt="" className={`w-full h-full object-cover object-center ${i === current ? "animate-kenburns" : ""}`} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

          <div className={`absolute inset-0 flex flex-col items-center justify-end pb-24 px-4 text-center transition-all duration-700 ${transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <span className="text-primary font-semibold tracking-[0.25em] uppercase text-xs md:text-sm mb-5 px-5 py-2 border border-primary/60 backdrop-blur-sm bg-black/20">
              {language === "ar" ? slide.labelAr : slide.labelEn}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white max-w-5xl mb-7 leading-[1.05] drop-shadow-2xl">
              {language === "ar" ? slide.headlineAr : slide.headlineEn}
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-xl mb-10 font-light tracking-wide">
              {t("نسائي · بنات · شنط — تشكيلات حصرية من أفضل الخامات", "Women · Girls · Bags — Exclusive collections in premium fabrics")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/products">
                <Button size="lg" className="h-14 px-12 text-lg font-serif font-bold rounded-none bg-primary text-primary-foreground hover:bg-white hover:text-black transition-all duration-300">
                  {t("تسوق الآن", "Shop Now")}
                </Button>
              </Link>
              <Link href="/products?category=1">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-serif font-bold rounded-none border-white text-white hover:bg-white hover:text-black transition-all duration-300 bg-transparent">
                  {t("اكتشف المجموعات", "Explore Collections")}
                </Button>
              </Link>
            </div>
          </div>

          {hero.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {hero.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-6 right-8 flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs tracking-[0.2em] uppercase rotate-90 origin-center translate-y-4">Scroll</span>
            <div className="w-[1px] h-12 bg-white/30" />
          </div>
        </section>
      )}

      {/* ── DYNAMIC SECTIONS in configured order ── */}
      {sections.map((sec) => {
        if (!sec.enabled) return null;
        const Comp = SECTION_COMPONENTS[sec.id];
        if (!Comp) return null;
        return <Comp key={sec.id} />;
      })}

      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </Layout>
  );
}
