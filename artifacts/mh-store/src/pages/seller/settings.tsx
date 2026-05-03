import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Megaphone, Timer, Image, Phone, Store, Star, Layout, Layers, Sparkles, GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, LayoutDashboard, CreditCard } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings-context";
import {
  saveSetting,
  BrandSettings, ContactSettings, HeroSlide, BannerItem,
  OccasionItem, EditorialItem, FeatureItem, Testimonial,
  AnnouncementSettings, SaleSettings, PageSection, PaymentSettings,
  DEFAULT_SETTINGS, SECTION_META,
} from "@/lib/site-settings";

const TABS = [
  { id: "brand",        icon: Store,           ar: "هوية المتجر",        en: "Brand" },
  { id: "contact",      icon: Phone,           ar: "التواصل",             en: "Contact" },
  { id: "payment",      icon: CreditCard,      ar: "طرق الدفع",          en: "Payments" },
  { id: "promo",        icon: Megaphone,       ar: "الإعلانات والعروض",  en: "Promotions" },
  { id: "pagebuilder",  icon: LayoutDashboard, ar: "مُنشئ الصفحة",       en: "Page Builder" },
  { id: "hero",         icon: Image,           ar: "الهيرو",              en: "Hero Slides" },
  { id: "banners",      icon: Layout,          ar: "البانرات",            en: "Banners" },
  { id: "occasions",    icon: Layers,          ar: "المناسبات",           en: "Occasions" },
  { id: "editorial",    icon: Image,           ar: "لوك بوك",             en: "Lookbook" },
  { id: "features",     icon: Sparkles,        ar: "مميزاتنا",            en: "Features" },
  { id: "testimonials", icon: Star,            ar: "آراء العملاء",        en: "Testimonials" },
] as const;

type TabId = typeof TABS[number]["id"];

function SectionCard({ icon: Icon, titleAr, titleEn, children, onSave, saving }: {
  icon: React.ElementType; titleAr: string; titleEn: string;
  children: React.ReactNode; onSave: () => void; saving: boolean;
}) {
  const { t, language } = useI18n();
  return (
    <div className="bg-card border border-border p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-serif font-bold">{language === "ar" ? titleAr : titleEn}</h2>
      </div>
      {children}
      <div className="pt-2">
        <Button onClick={onSave} disabled={saving} className="rounded-none h-11 px-8 font-bold uppercase tracking-wide">
          <Save className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {saving ? t("جاري الحفظ...", "Saving...") : t("حفظ", "Save")}
        </Button>
      </div>
    </div>
  );
}

function FieldRow({ labelAr, labelEn, value, onChange, dir = "rtl", type = "text", placeholder }: {
  labelAr: string; labelEn: string; value: string; onChange: (v: string) => void;
  dir?: "rtl" | "ltr"; type?: string; placeholder?: string;
}) {
  const { language } = useI18n();
  return (
    <div>
      <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
        {language === "ar" ? labelAr : labelEn}
      </Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-none h-11" dir={dir} type={type} placeholder={placeholder} />
    </div>
  );
}

function BilingualFields({ labelAr, labelEn, valAr, valEn, onAr, onEn }: {
  labelAr: string; labelEn: string; valAr: string; valEn: string;
  onAr: (v: string) => void; onEn: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FieldRow labelAr={`${labelAr} (عربي)`} labelEn={`${labelEn} (Arabic)`} value={valAr} onChange={onAr} dir="rtl" />
      <FieldRow labelAr={`${labelAr} (إنجليزي)`} labelEn={`${labelEn} (English)`} value={valEn} onChange={onEn} dir="ltr" />
    </div>
  );
}

function ImagePreview({ url, className = "h-32" }: { url: string; className?: string }) {
  if (!url) return null;
  return (
    <div className={`w-full bg-secondary overflow-hidden border border-border mt-2 ${className}`}>
      <img src={url} alt="" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    </div>
  );
}

export default function SellerSettings() {
  const { t, language } = useI18n();
  const { settings: ctxSettings, reload } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<TabId>("brand");
  const [loading, setLoading] = useState(true);

  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_SETTINGS.brand);
  const [contact, setContact] = useState<ContactSettings>(DEFAULT_SETTINGS.contact);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(DEFAULT_SETTINGS.announcement);
  const [sale, setSale] = useState<SaleSettings>(DEFAULT_SETTINGS.sale);
  const [hero, setHero] = useState<HeroSlide[]>(DEFAULT_SETTINGS.hero);
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_SETTINGS.banners);
  const [occasions, setOccasions] = useState<OccasionItem[]>(DEFAULT_SETTINGS.occasions);
  const [editorial, setEditorial] = useState<EditorialItem[]>(DEFAULT_SETTINGS.editorial);
  const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_SETTINGS.features);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_SETTINGS.testimonials);
  const [sections, setSections] = useState<PageSection[]>(DEFAULT_SETTINGS.sections);
  const [payment, setPayment] = useState<PaymentSettings>(DEFAULT_SETTINGS.payment);

  const [saving, setSaving] = useState<Partial<Record<string, boolean>>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBrand(ctxSettings.brand);
    setContact(ctxSettings.contact);
    setAnnouncement(ctxSettings.announcement);
    setSale(ctxSettings.sale);
    setHero(ctxSettings.hero);
    setBanners(ctxSettings.banners);
    setOccasions(ctxSettings.occasions);
    setEditorial(ctxSettings.editorial);
    setFeatures(ctxSettings.features);
    setTestimonials(ctxSettings.testimonials);
    setSections(ctxSettings.sections);
    setPayment(ctxSettings.payment);
    setLoading(false);
  }, [ctxSettings]);

  const save = async (tab: string, key: string, value: unknown) => {
    setSaving((s) => ({ ...s, [tab]: true }));
    const ok = await saveSetting(key, value);
    setSaving((s) => ({ ...s, [tab]: false }));
    if (ok) { toast.success(t("تم الحفظ بنجاح ✓", "Saved successfully ✓")); reload(); }
    else toast.error(t("حدث خطأ", "Error saving"));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setBrand((b) => ({ ...b, logoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const moveSectionUp = (i: number) => {
    if (i === 0) return;
    setSections((s) => {
      const next = [...s];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveSectionDown = (i: number) => {
    setSections((s) => {
      if (i >= s.length - 1) return s;
      const next = [...s];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const toggleSection = (i: number) => {
    setSections((s) => s.map((sec, idx) => idx === i ? { ...sec, enabled: !sec.enabled } : sec));
  };

  const updateHeroSlide = (i: number, field: keyof HeroSlide, val: string) =>
    setHero((h) => h.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const updateBanner = (i: number, field: keyof BannerItem, val: string) =>
    setBanners((b) => b.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const updateOccasion = (i: number, field: keyof OccasionItem, val: string) =>
    setOccasions((o) => o.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const updateEditorial = (i: number, field: keyof EditorialItem, val: string | boolean) =>
    setEditorial((e) => e.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const updateFeature = (i: number, field: keyof FeatureItem, val: string) =>
    setFeatures((f) => f.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const updateTestimonial = (i: number, field: keyof Testimonial, val: string | number) =>
    setTestimonials((ts) => ts.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="border-b border-border pb-6">
          <h1 className="text-4xl font-serif font-black tracking-tight mb-2">{t("إعدادات الموقع", "Site Settings")}</h1>
          <p className="text-muted-foreground">{t("تحكمي في كل شيء في موقعك بدون أي كود.", "Control everything on your site without any code.")}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors rounded-none border ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {language === "ar" ? tab.ar : tab.en}
              </button>
            );
          })}
        </div>

        {/* ── BRAND ── */}
        {activeTab === "brand" && (
          <SectionCard icon={Store} titleAr="هوية المتجر" titleEn="Brand Identity" onSave={() => save("brand", "brand", brand)} saving={!!saving.brand}>
            {/* Logo Upload */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("شعار المتجر (اللوجو)", "Store Logo")}
              </Label>
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 border border-border bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt="logo" className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <span className="text-2xl font-serif font-black text-foreground">{brand.storeName}</span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <Button type="button" variant="outline" className="rounded-none h-10 w-full text-sm font-bold" onClick={() => logoInputRef.current?.click()}>
                    {t("رفع صورة من جهازك", "Upload Image from Device")}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">{t("أو", "or")}</p>
                  <FieldRow labelAr="رابط الشعار (URL)" labelEn="Logo URL" value={brand.logoUrl} onChange={(v) => setBrand((b) => ({ ...b, logoUrl: v }))} dir="ltr" placeholder="https://..." />
                  <p className="text-xs text-muted-foreground">{t("إذا تركتِ هذا الحقل فارغاً، سيظهر اسم المتجر بدلاً من الشعار.", "If left empty, the store name will appear instead of a logo.")}</p>
                </div>
              </div>
            </div>

            <FieldRow labelAr="اسم المتجر" labelEn="Store Name" value={brand.storeName} onChange={(v) => setBrand((b) => ({ ...b, storeName: v }))} dir="ltr" />
            <BilingualFields labelAr="الشعار النصي" labelEn="Tagline" valAr={brand.taglineAr} valEn={brand.taglineEn} onAr={(v) => setBrand((b) => ({ ...b, taglineAr: v }))} onEn={(v) => setBrand((b) => ({ ...b, taglineEn: v }))} />
            <BilingualFields labelAr="وصف المتجر" labelEn="Store Description" valAr={brand.descriptionAr} valEn={brand.descriptionEn} onAr={(v) => setBrand((b) => ({ ...b, descriptionAr: v }))} onEn={(v) => setBrand((b) => ({ ...b, descriptionEn: v }))} />
          </SectionCard>
        )}

        {/* ── CONTACT ── */}
        {activeTab === "contact" && (
          <SectionCard icon={Phone} titleAr="معلومات التواصل" titleEn="Contact Information" onSave={() => save("contact", "contact", contact)} saving={!!saving.contact}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldRow labelAr="رقم الواتساب (بدون +)" labelEn="WhatsApp (no +)" value={contact.whatsapp} onChange={(v) => setContact((c) => ({ ...c, whatsapp: v }))} dir="ltr" placeholder="201552221286" />
              <FieldRow labelAr="رقم الهاتف الأول" labelEn="Phone 1" value={contact.phone1} onChange={(v) => setContact((c) => ({ ...c, phone1: v }))} dir="ltr" placeholder="01552221286" />
              <FieldRow labelAr="رقم الهاتف الثاني" labelEn="Phone 2" value={contact.phone2} onChange={(v) => setContact((c) => ({ ...c, phone2: v }))} dir="ltr" placeholder="01156773426" />
            </div>
            <div className="pt-2 border-t border-border space-y-4">
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{t("روابط السوشيال ميديا", "Social Media Links")}</p>
              <FieldRow labelAr="فيسبوك" labelEn="Facebook URL" value={contact.facebook} onChange={(v) => setContact((c) => ({ ...c, facebook: v }))} dir="ltr" placeholder="https://www.facebook.com/yourpage" />
              <FieldRow labelAr="إنستاجرام" labelEn="Instagram URL" value={contact.instagram} onChange={(v) => setContact((c) => ({ ...c, instagram: v }))} dir="ltr" placeholder="https://www.instagram.com/yourpage" />
              <FieldRow labelAr="تيك توك" labelEn="TikTok URL" value={contact.tiktok} onChange={(v) => setContact((c) => ({ ...c, tiktok: v }))} dir="ltr" placeholder="https://www.tiktok.com/@yourpage" />
            </div>
          </SectionCard>
        )}

        {/* ── PROMOTIONS ── */}
        {activeTab === "promo" && (
          <div className="space-y-6">
            <SectionCard icon={Megaphone} titleAr="شريط الإعلانات" titleEn="Announcement Bar" onSave={() => save("promo", "announcement", announcement)} saving={!!saving.promo}>
              <div className="flex items-center gap-3">
                <Switch checked={announcement.enabled} onCheckedChange={(v) => setAnnouncement((a) => ({ ...a, enabled: v }))} />
                <Label className="font-medium">{announcement.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
              </div>
              <FieldRow labelAr="النص بالعربي" labelEn="Arabic Text" value={announcement.ar} onChange={(v) => setAnnouncement((a) => ({ ...a, ar: v }))} dir="rtl" />
              <FieldRow labelAr="النص بالإنجليزي" labelEn="English Text" value={announcement.en} onChange={(v) => setAnnouncement((a) => ({ ...a, en: v }))} dir="ltr" />
            </SectionCard>

            <SectionCard icon={Timer} titleAr="عداد التخفيضات" titleEn="Sale Countdown" onSave={() => save("sale", "sale", sale)} saving={!!saving.sale}>
              <div className="flex items-center gap-3">
                <Switch checked={sale.enabled} onCheckedChange={(v) => setSale((s) => ({ ...s, enabled: v }))} />
                <Label className="font-medium">{sale.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
              </div>
              <BilingualFields labelAr="عنوان العرض" labelEn="Sale Title" valAr={sale.titleAr} valEn={sale.titleEn} onAr={(v) => setSale((s) => ({ ...s, titleAr: v }))} onEn={(v) => setSale((s) => ({ ...s, titleEn: v }))} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow labelAr="نسبة الخصم %" labelEn="Discount %" value={String(sale.discount)} onChange={(v) => setSale((s) => ({ ...s, discount: Number(v) }))} dir="ltr" type="number" />
                <FieldRow labelAr="تاريخ الانتهاء" labelEn="End Date & Time" value={sale.endDate.slice(0, 16)} onChange={(v) => setSale((s) => ({ ...s, endDate: v + ":00" }))} dir="ltr" type="datetime-local" />
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── PAGE BUILDER ── */}
        {activeTab === "pagebuilder" && (
          <div className="bg-card border border-border p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold">{t("مُنشئ الصفحة الرئيسية", "Homepage Page Builder")}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{t("رتّبي الأقسام وأظهريها أو أخفيها بضغطة واحدة", "Reorder sections and show/hide them with one click")}</p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 text-sm text-foreground/70">
              {t(
                "اسحبي الأقسام بالأسهم لتغيير الترتيب. الأقسام المخفية لن تظهر للزوار.",
                "Use the arrows to reorder sections. Hidden sections won't appear to visitors."
              )}
            </div>

            <div className="space-y-2">
              {sections.map((sec, i) => {
                const meta = SECTION_META[sec.id];
                return (
                  <div
                    key={sec.id}
                    className={`flex items-center gap-3 p-4 border transition-colors ${sec.enabled ? "border-border bg-card" : "border-border/50 bg-secondary/30"}`}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />

                    <div className="flex-1">
                      <p className={`font-bold text-sm ${sec.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                        {language === "ar" ? meta?.ar : meta?.en}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sec.enabled ? t("ظاهر للزوار", "Visible to visitors") : t("مخفي عن الزوار", "Hidden from visitors")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSectionUp(i)}
                        disabled={i === 0}
                        className="w-8 h-8 flex items-center justify-center border border-border hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveSectionDown(i)}
                        disabled={i === sections.length - 1}
                        className="w-8 h-8 flex items-center justify-center border border-border hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleSection(i)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors ${
                        sec.enabled
                          ? "border-primary/40 text-primary bg-primary/5 hover:bg-primary/10"
                          : "border-border text-muted-foreground bg-background hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {sec.enabled ? (
                        <><Eye className="h-3.5 w-3.5" />{t("ظاهر", "Visible")}</>
                      ) : (
                        <><EyeOff className="h-3.5 w-3.5" />{t("مخفي", "Hidden")}</>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Button onClick={() => save("pagebuilder", "sections", sections)} disabled={!!saving.pagebuilder} className="rounded-none h-11 px-8 font-bold uppercase tracking-wide">
                <Save className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {saving.pagebuilder ? t("جاري الحفظ...", "Saving...") : t("حفظ الترتيب والإعدادات", "Save Order & Settings")}
              </Button>
            </div>
          </div>
        )}

        {/* ── HERO SLIDES ── */}
        {activeTab === "hero" && (
          <SectionCard icon={Image} titleAr="شرائح الهيرو" titleEn="Hero Slides" onSave={() => save("hero", "hero", hero)} saving={!!saving.hero}>
            <p className="text-sm text-muted-foreground">{t("تظهر هذه الشرائح في الصورة الكبيرة في أعلى الصفحة الرئيسية.", "These slides appear in the large banner at the top of the homepage.")}</p>
            <div className="space-y-6">
              {hero.map((slide, i) => (
                <div key={i} className="border border-border p-5 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-primary">{t(`شريحة ${i + 1}`, `Slide ${i + 1}`)}</p>
                    <button onClick={() => setHero((h) => h.filter((_, idx) => idx !== i))} className="text-xs text-destructive hover:underline">{t("حذف", "Delete")}</button>
                  </div>
                  <div>
                    <FieldRow labelAr="رابط الصورة" labelEn="Image URL" value={slide.image} onChange={(v) => updateHeroSlide(i, "image", v)} dir="ltr" placeholder="https://..." />
                    <ImagePreview url={slide.image} />
                  </div>
                  <BilingualFields labelAr="التسمية الصغيرة" labelEn="Label" valAr={slide.labelAr} valEn={slide.labelEn} onAr={(v) => updateHeroSlide(i, "labelAr", v)} onEn={(v) => updateHeroSlide(i, "labelEn", v)} />
                  <BilingualFields labelAr="العنوان الكبير" labelEn="Headline" valAr={slide.headlineAr} valEn={slide.headlineEn} onAr={(v) => updateHeroSlide(i, "headlineAr", v)} onEn={(v) => updateHeroSlide(i, "headlineEn", v)} />
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-none h-10 text-sm" onClick={() => setHero((h) => [...h, { image: "", labelAr: "", labelEn: "", headlineAr: "", headlineEn: "" }])}>
              + {t("إضافة شريحة جديدة", "Add New Slide")}
            </Button>
          </SectionCard>
        )}

        {/* ── BANNERS ── */}
        {activeTab === "banners" && (
          <SectionCard icon={Layout} titleAr="بانرات الأقسام" titleEn="Category Banners" onSave={() => save("banners", "banners", banners)} saving={!!saving.banners}>
            <p className="text-sm text-muted-foreground">{t("البانرات الكبيرة التي تظهر تحت الهيرو مباشرة.", "Large banners shown just below the hero section.")}</p>
            <div className="space-y-6">
              {banners.map((banner, i) => (
                <div key={i} className="border border-border p-5 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-primary">{t(`بانر ${i + 1}`, `Banner ${i + 1}`)}</p>
                    <button onClick={() => setBanners((b) => b.filter((_, idx) => idx !== i))} className="text-xs text-destructive hover:underline">{t("حذف", "Delete")}</button>
                  </div>
                  <div>
                    <FieldRow labelAr="رابط الصورة" labelEn="Image URL" value={banner.image} onChange={(v) => updateBanner(i, "image", v)} dir="ltr" placeholder="https://..." />
                    <ImagePreview url={banner.image} />
                  </div>
                  <BilingualFields labelAr="العنوان" labelEn="Label" valAr={banner.labelAr} valEn={banner.labelEn} onAr={(v) => updateBanner(i, "labelAr", v)} onEn={(v) => updateBanner(i, "labelEn", v)} />
                  <FieldRow labelAr="الرابط عند الضغط" labelEn="Link URL" value={banner.href} onChange={(v) => updateBanner(i, "href", v)} dir="ltr" placeholder="/products" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-none h-10 text-sm" onClick={() => setBanners((b) => [...b, { image: "", labelAr: "", labelEn: "", href: "/products" }])}>
              + {t("إضافة بانر جديد", "Add New Banner")}
            </Button>
          </SectionCard>
        )}

        {/* ── OCCASIONS ── */}
        {activeTab === "occasions" && (
          <SectionCard icon={Layers} titleAr="تسوق حسب المناسبة" titleEn="Shop by Occasion" onSave={() => save("occasions", "occasions", occasions)} saving={!!saving.occasions}>
            <p className="text-sm text-muted-foreground">{t("الصور في قسم 'إطلالة لكل لحظة'.", "The tiles in the 'Shop by Occasion' section.")}</p>
            <div className="space-y-6">
              {occasions.map((occ, i) => (
                <div key={i} className="border border-border p-5 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-primary">{t(`مناسبة ${i + 1}`, `Occasion ${i + 1}`)}</p>
                    <button onClick={() => setOccasions((o) => o.filter((_, idx) => idx !== i))} className="text-xs text-destructive hover:underline">{t("حذف", "Delete")}</button>
                  </div>
                  <div>
                    <FieldRow labelAr="رابط الصورة" labelEn="Image URL" value={occ.image} onChange={(v) => updateOccasion(i, "image", v)} dir="ltr" placeholder="https://..." />
                    <ImagePreview url={occ.image} />
                  </div>
                  <BilingualFields labelAr="العنوان" labelEn="Label" valAr={occ.labelAr} valEn={occ.labelEn} onAr={(v) => updateOccasion(i, "labelAr", v)} onEn={(v) => updateOccasion(i, "labelEn", v)} />
                  <BilingualFields labelAr="العنوان الفرعي" labelEn="Subtitle" valAr={occ.subAr} valEn={occ.subEn} onAr={(v) => updateOccasion(i, "subAr", v)} onEn={(v) => updateOccasion(i, "subEn", v)} />
                  <FieldRow labelAr="الرابط عند الضغط" labelEn="Link URL" value={occ.href} onChange={(v) => updateOccasion(i, "href", v)} dir="ltr" placeholder="/products" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-none h-10 text-sm" onClick={() => setOccasions((o) => [...o, { image: "", labelAr: "", labelEn: "", subAr: "", subEn: "", href: "/products" }])}>
              + {t("إضافة مناسبة جديدة", "Add New Occasion")}
            </Button>
          </SectionCard>
        )}

        {/* ── EDITORIAL ── */}
        {activeTab === "editorial" && (
          <SectionCard icon={Image} titleAr="قسم اللوك بوك" titleEn="Lookbook Section" onSave={() => save("editorial", "editorial", editorial)} saving={!!saving.editorial}>
            <p className="text-sm text-muted-foreground">{t("الصور التحريرية الكبيرة قبل قسم آراء العملاء.", "The editorial images before the testimonials section.")}</p>
            <div className="space-y-6">
              {editorial.map((item, i) => (
                <div key={i} className="border border-border p-5 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-primary">{t(`صورة ${i + 1}`, `Image ${i + 1}`)}</p>
                    <button onClick={() => setEditorial((e) => e.filter((_, idx) => idx !== i))} className="text-xs text-destructive hover:underline">{t("حذف", "Delete")}</button>
                  </div>
                  <div>
                    <FieldRow labelAr="رابط الصورة" labelEn="Image URL" value={item.image} onChange={(v) => updateEditorial(i, "image", v)} dir="ltr" placeholder="https://..." />
                    <ImagePreview url={item.image} />
                  </div>
                  <BilingualFields labelAr="العنوان" labelEn="Label" valAr={item.labelAr} valEn={item.labelEn} onAr={(v) => updateEditorial(i, "labelAr", v)} onEn={(v) => updateEditorial(i, "labelEn", v)} />
                  <FieldRow labelAr="الرابط عند الضغط" labelEn="Link URL" value={item.href} onChange={(v) => updateEditorial(i, "href", v)} dir="ltr" placeholder="/products" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-none h-10 text-sm" onClick={() => setEditorial((e) => [...e, { image: "", labelAr: "", labelEn: "", href: "/products" }])}>
              + {t("إضافة صورة جديدة", "Add New Image")}
            </Button>
          </SectionCard>
        )}

        {/* ── FEATURES ── */}
        {activeTab === "features" && (
          <SectionCard icon={Sparkles} titleAr="مميزاتنا" titleEn="Our Features" onSave={() => save("features", "features", features)} saving={!!saving.features}>
            <p className="text-sm text-muted-foreground">{t("الصندوق الداكن في الصفحة الرئيسية (جودة فاخرة، توصيل سريع، إلخ).", "The dark box on the homepage (Premium Quality, Fast Delivery, etc.).")}</p>
            <div className="space-y-6">
              {features.map((feat, i) => (
                <div key={i} className="border border-border p-5 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-primary">{t(`ميزة ${i + 1}`, `Feature ${i + 1}`)}</p>
                    <button onClick={() => setFeatures((f) => f.filter((_, idx) => idx !== i))} className="text-xs text-destructive hover:underline">{t("حذف", "Delete")}</button>
                  </div>
                  <FieldRow labelAr="الرقم (01، 02...)" labelEn="Number (01, 02...)" value={feat.n} onChange={(v) => updateFeature(i, "n", v)} dir="ltr" placeholder="01" />
                  <BilingualFields labelAr="العنوان" labelEn="Title" valAr={feat.titleAr} valEn={feat.titleEn} onAr={(v) => updateFeature(i, "titleAr", v)} onEn={(v) => updateFeature(i, "titleEn", v)} />
                  <BilingualFields labelAr="الوصف" labelEn="Description" valAr={feat.textAr} valEn={feat.textEn} onAr={(v) => updateFeature(i, "textAr", v)} onEn={(v) => updateFeature(i, "textEn", v)} />
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-none h-10 text-sm" onClick={() => setFeatures((f) => [...f, { n: String(f.length + 1).padStart(2, "0"), titleAr: "", titleEn: "", textAr: "", textEn: "" }])}>
              + {t("إضافة ميزة جديدة", "Add New Feature")}
            </Button>
          </SectionCard>
        )}

        {/* ── PAYMENT ── */}
        {activeTab === "payment" && (
          <SectionCard icon={CreditCard} titleAr="طرق الدفع" titleEn="Payment Methods" onSave={() => save("payment", "payment", payment)} saving={!!saving.payment}>
            <p className="text-sm text-muted-foreground">{t("فعّلي أو عطّلي طرق الدفع وأضيفي بياناتها. تظهر للعملاء عند إتمام الطلب.", "Enable or disable payment methods and add their details. Shown to customers at checkout.")}</p>
            <div className="space-y-6">

              {/* COD */}
              <div className="border border-border p-5 space-y-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💵</span>
                    <p className="font-bold">{t("الدفع عند الاستلام", "Cash on Delivery")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={payment.cod.enabled} onCheckedChange={(v) => setPayment((p) => ({ ...p, cod: { enabled: v } }))} />
                    <Label>{payment.cod.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
                  </div>
                </div>
              </div>

              {/* Vodafone Cash */}
              <div className="border border-border p-5 space-y-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <p className="font-bold">{t("فودافون كاش", "Vodafone Cash")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={payment.vodafone_cash.enabled} onCheckedChange={(v) => setPayment((p) => ({ ...p, vodafone_cash: { ...p.vodafone_cash, enabled: v } }))} />
                    <Label>{payment.vodafone_cash.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
                  </div>
                </div>
                {payment.vodafone_cash.enabled && (
                  <FieldRow labelAr="رقم فودافون كاش" labelEn="Vodafone Cash Number" value={payment.vodafone_cash.phone} onChange={(v) => setPayment((p) => ({ ...p, vodafone_cash: { ...p.vodafone_cash, phone: v } }))} dir="ltr" placeholder="01XXXXXXXXX" />
                )}
              </div>

              {/* InstaPay */}
              <div className="border border-border p-5 space-y-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <p className="font-bold">{t("إنستا باي", "InstaPay")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={payment.instapay.enabled} onCheckedChange={(v) => setPayment((p) => ({ ...p, instapay: { ...p.instapay, enabled: v } }))} />
                    <Label>{payment.instapay.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
                  </div>
                </div>
                {payment.instapay.enabled && (
                  <FieldRow labelAr="معرّف إنستا باي (ID)" labelEn="InstaPay ID / Phone" value={payment.instapay.id} onChange={(v) => setPayment((p) => ({ ...p, instapay: { ...p.instapay, id: v } }))} dir="ltr" placeholder="01XXXXXXXXX" />
                )}
              </div>

              {/* Fawry */}
              <div className="border border-border p-5 space-y-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏪</span>
                    <p className="font-bold">{t("فوري", "Fawry")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={payment.fawry.enabled} onCheckedChange={(v) => setPayment((p) => ({ ...p, fawry: { ...p.fawry, enabled: v } }))} />
                    <Label>{payment.fawry.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
                  </div>
                </div>
                {payment.fawry.enabled && (
                  <FieldRow labelAr="رقم فوري / كود الدفع" labelEn="Fawry Number / Code" value={payment.fawry.phone} onChange={(v) => setPayment((p) => ({ ...p, fawry: { ...p.fawry, phone: v } }))} dir="ltr" placeholder="01XXXXXXXXX" />
                )}
              </div>

              {/* Bank Card */}
              <div className="border border-border p-5 space-y-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <p className="font-bold">{t("بطاقة بنكية (فيزا / ماستركارد / ميزة)", "Bank Card (Visa / Mastercard / Meeza)")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={payment.card.enabled} onCheckedChange={(v) => setPayment((p) => ({ ...p, card: { ...p.card, enabled: v } }))} />
                    <Label>{payment.card.enabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}</Label>
                  </div>
                </div>
                {payment.card.enabled && (
                  <FieldRow labelAr="رابط الدفع بالبطاقة" labelEn="Card Payment Link" value={payment.card.link} onChange={(v) => setPayment((p) => ({ ...p, card: { ...p.card, link: v } }))} dir="ltr" placeholder="https://..." />
                )}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── TESTIMONIALS ── */}
        {activeTab === "testimonials" && (
          <SectionCard icon={Star} titleAr="آراء العملاء" titleEn="Customer Testimonials" onSave={() => save("testimonials", "testimonials", testimonials)} saving={!!saving.testimonials}>
            <p className="text-sm text-muted-foreground">{t("التقييمات التي تظهر في القسم 'تجارب حقيقية' في الصفحة الرئيسية.", "Reviews shown in the 'Real Stories' section on the homepage.")}</p>
            <div className="space-y-6">
              {testimonials.map((tm, i) => (
                <div key={i} className="border border-border p-5 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-primary">{t(`تقييم ${i + 1}`, `Review ${i + 1}`)}</p>
                    <button onClick={() => setTestimonials((ts) => ts.filter((_, idx) => idx !== i))} className="text-xs text-destructive hover:underline">{t("حذف", "Delete")}</button>
                  </div>
                  <BilingualFields labelAr="الاسم" labelEn="Name" valAr={tm.nameAr} valEn={tm.nameEn} onAr={(v) => updateTestimonial(i, "nameAr", v)} onEn={(v) => updateTestimonial(i, "nameEn", v)} />
                  <BilingualFields labelAr="المدينة" labelEn="City" valAr={tm.cityAr} valEn={tm.cityEn} onAr={(v) => updateTestimonial(i, "cityAr", v)} onEn={(v) => updateTestimonial(i, "cityEn", v)} />
                  <BilingualFields labelAr="نص التقييم" labelEn="Review Text" valAr={tm.textAr} valEn={tm.textEn} onAr={(v) => updateTestimonial(i, "textAr", v)} onEn={(v) => updateTestimonial(i, "textEn", v)} />
                  <div>
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t("التقييم (1-5)", "Rating (1-5)")}</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => updateTestimonial(i, "rating", star)}>
                          <Star className={`h-6 w-6 transition-colors ${star <= tm.rating ? "text-primary fill-primary" : "text-border"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-none h-10 text-sm" onClick={() => setTestimonials((ts) => [...ts, { nameAr: "", nameEn: "", cityAr: "", cityEn: "", textAr: "", textEn: "", rating: 5 }])}>
              + {t("إضافة تقييم جديد", "Add New Review")}
            </Button>
          </SectionCard>
        )}
      </div>
    </SellerLayout>
  );
}
