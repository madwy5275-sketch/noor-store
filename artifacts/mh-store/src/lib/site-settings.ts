export type BrandSettings = {
  storeName: string;
  logoUrl: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type ContactSettings = {
  whatsapp: string;
  phone1: string;
  phone2: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export type HeroSlide = {
  image: string;
  labelAr: string;
  labelEn: string;
  headlineAr: string;
  headlineEn: string;
};

export type BannerItem = {
  image: string;
  labelAr: string;
  labelEn: string;
  href: string;
};

export type OccasionItem = {
  image: string;
  labelAr: string;
  labelEn: string;
  subAr: string;
  subEn: string;
  href: string;
};

export type EditorialItem = {
  image: string;
  labelAr: string;
  labelEn: string;
  href: string;
  featured?: boolean;
};

export type FeatureItem = {
  n: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
};

export type Testimonial = {
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  textAr: string;
  textEn: string;
  rating: number;
};

export type AnnouncementSettings = { enabled: boolean; ar: string; en: string };
export type SaleSettings = { enabled: boolean; endDate: string; discount: number; titleAr: string; titleEn: string };

export type PaymentMethodConfig = {
  enabled: boolean;
  phone: string;
  id: string;
  link: string;
  instructionsAr: string;
  instructionsEn: string;
};

export type PaymentSettings = {
  cod: { enabled: boolean };
  vodafone_cash: PaymentMethodConfig;
  instapay: PaymentMethodConfig;
  fawry: PaymentMethodConfig;
  card: PaymentMethodConfig;
};

export type PageSection = {
  id: string;
  enabled: boolean;
};

export const SECTION_META: Record<string, { ar: string; en: string }> = {
  sale:         { ar: "عداد التخفيضات",     en: "Sale Countdown" },
  banners:      { ar: "بانرات الأقسام",     en: "Category Banners" },
  new_arrivals: { ar: "وصل حديثاً",         en: "New Arrivals" },
  featured:     { ar: "القطع المميزة",       en: "Featured Pieces" },
  features:     { ar: "مميزاتنا",           en: "Our Features" },
  occasions:    { ar: "تسوق حسب المناسبة",  en: "Shop by Occasion" },
  editorial:    { ar: "لوك بوك",            en: "Lookbook" },
  testimonials: { ar: "آراء العملاء",       en: "Testimonials" },
};

export const DEFAULT_SECTIONS: PageSection[] = [
  { id: "sale",         enabled: true },
  { id: "banners",      enabled: true },
  { id: "new_arrivals", enabled: true },
  { id: "featured",     enabled: true },
  { id: "features",     enabled: true },
  { id: "occasions",    enabled: true },
  { id: "editorial",    enabled: true },
  { id: "testimonials", enabled: true },
];

export type SiteSettings = {
  brand: BrandSettings;
  contact: ContactSettings;
  hero: HeroSlide[];
  banners: BannerItem[];
  occasions: OccasionItem[];
  editorial: EditorialItem[];
  features: FeatureItem[];
  testimonials: Testimonial[];
  announcement: AnnouncementSettings;
  sale: SaleSettings;
  sections: PageSection[];
  payment: PaymentSettings;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    storeName: "Noor",
    logoUrl: "",
    taglineAr: "البسي الحياة التي تريدينها",
    taglineEn: "Dress the Life You Want",
    descriptionAr: "وجهتك الأولى لأحدث صيحات الموضة والأزياء العصرية. تسوق بثقة وتميز.",
    descriptionEn: "Your premier destination for the latest fashion trends and modern apparel. Shop with confidence.",
  },
  contact: {
    whatsapp: "201552221286",
    phone1: "01552221286",
    phone2: "01156773426",
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    tiktok: "https://www.tiktok.com",
  },
  hero: [
    { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80", labelAr: "الموضة المحتشمة", labelEn: "Modest Fashion", headlineAr: "هي لا تتبع الموضة. هي تصنعها.", headlineEn: "She Doesn't Follow Trends. She Sets Them." },
    { image: "https://plus.unsplash.com/premium_photo-1681492164528-71e8a8fdd51b?fm=jpg&q=80&w=1920&fit=crop", labelAr: "أزياء نسائية", labelEn: "Women's Fashion", headlineAr: "الصيف حالة روح", headlineEn: "Summer Is a State of Mind" },
    { image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=80", labelAr: "شنط نسائية فاخرة", labelEn: "Luxury Women's Bags", headlineAr: "التفصيلة الصح تغيّر كل شيء", headlineEn: "The Right Detail Changes Everything" },
    { image: "https://thumbs.dreamstime.com/b/beautiful-little-fashion-model-white-studio-background-portrait-cute-girl-posing-studio-blonde-bright-summer-98623965.jpg", labelAr: "بنات صغار", labelEn: "Girls' Collection", headlineAr: "صغار، أحلام كبيرة", headlineEn: "Little Ones, Big Dreams" },
    { image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1920&q=80", labelAr: "عبايات راقية", labelEn: "Elegant Abayas", headlineAr: "أناقة تنبع من الداخل", headlineEn: "Elegance from Within" },
  ],
  banners: [
    { image: "https://plus.unsplash.com/premium_photo-1681492164528-71e8a8fdd51b?fm=jpg&q=80&w=800&fit=crop", labelAr: "نسائي", labelEn: "Women", href: "/products?category=women" },
    { image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", labelAr: "شنط", labelEn: "Bags", href: "/products?category=bags" },
    { image: "https://thumbs.dreamstime.com/b/beautiful-little-fashion-model-white-background-portrait-cute-smiling-girl-posing-studio-96572021.jpg", labelAr: "بنات", labelEn: "Girls", href: "/products?category=kids" },
  ],
  occasions: [
    { image: "https://www.masarishop.com/media/wysiwyg/Newsroom/Dress_for_Eid__Stylish_and_Elegant_Outfit_Ideas_for_a_Festive_Celebration_resized.jpg", labelAr: "العيد", labelEn: "Eid", subAr: "إطلالات احتفالية", subEn: "Festive looks", href: "/products?category=women" },
    { image: "https://www.tanyabridal.com/cdn/shop/files/il_794xN_7479500144_1xij_avif_394x.jpg?v=1774322532", labelAr: "الأفراح", labelEn: "Weddings", subAr: "فساتين سهرة راقية", subEn: "Elegant evening dresses", href: "/products?category=women" },
    { image: "https://i.pinimg.com/originals/bb/b0/ea/bbb0ead0213c1ec0f4da840f72d899ce.jpg", labelAr: "العمل", labelEn: "Work", subAr: "أناقة يومية محتشمة", subEn: "Modest daily elegance", href: "/products?category=women" },
    { image: "https://i.pinimg.com/originals/e3/06/11/e3061140af5bd6fe7df6d7fe64c9ca22.jpg", labelAr: "كاجوال", labelEn: "Casual", subAr: "راحة وستايل", subEn: "Comfort meets style", href: "/products?category=women" },
  ],
  editorial: [
    { image: "https://www.deenista.com/content/images/2026/03/how-to-style-a-modest-floral-dress-for-hijabis.jpg", labelAr: "إطلالة الربيع المحتشمة", labelEn: "Modest Spring Look", href: "/products?category=women" },
    { image: "https://www.glamourousgrace.com/cdn/shop/articles/elegant-abaya-collection-your-essential-guide-to-this-seasons-modest-fashion3a4b5fa6_515ee2d0-f960-454d-bca6-8908d7a2297a-6346700.jpg?v=1758822922&width=800", labelAr: "اكتشفي العبايات", labelEn: "Discover Abayas", href: "/abayas", featured: true },
    { image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", labelAr: "شنطنا الفاخرة", labelEn: "Luxury Bags", href: "/products?category=bags" },
  ],
  features: [
    { n: "01", titleAr: "جودة فاخرة", titleEn: "Premium Quality", textAr: "نختار خاماتنا بعناية فائقة", textEn: "Every piece is crafted with premium materials" },
    { n: "02", titleAr: "توصيل سريع", titleEn: "Fast Delivery", textAr: "شحن لجميع المحافظات", textEn: "Nationwide delivery with care" },
    { n: "03", titleAr: "الدفع عند الاستلام", titleEn: "Cash on Delivery", textAr: "ادفع عند استلام طلبك بأمان", textEn: "Pay safely when you receive your order" },
  ],
  testimonials: [
    { nameAr: "سارة أحمد", nameEn: "Sara Ahmed", cityAr: "القاهرة", cityEn: "Cairo", textAr: "جودة خرافية وشحن سريع جداً! اشتريت فستان سهرة وجاء تحفة. بالتأكيد هتشتري تاني من Noor.", textEn: "Amazing quality and super fast shipping! Definitely ordering again from Noor.", rating: 5 },
    { nameAr: "نور محمد", nameEn: "Nour Mohamed", cityAr: "الإسكندرية", cityEn: "Alexandria", textAr: "أفضل تجربة تسوق أون لاين. الملابس بالضبط زي الصور والمقاسات دقيقة. موصي بيهم جداً!", textEn: "Best online shopping experience. Clothes are exactly like photos and sizes are accurate.", rating: 5 },
    { nameAr: "منى السيد", nameEn: "Mona El-Sayed", cityAr: "الجيزة", cityEn: "Giza", textAr: "اشتريت فستان وشنطة من Noor وجاء كل شيء تحفة. الذوق والجودة من غير كلام. هشتري تاني!", textEn: "Ordered a dress and a bag — everything came perfect. Taste and quality are unmatched!", rating: 5 },
    { nameAr: "هدى إبراهيم", nameEn: "Hoda Ibrahim", cityAr: "المنصورة", cityEn: "Mansoura", textAr: "بسيطة الطلب وسريعة التوصيل. الموظفين متعاونين وردوا على كل أسئلتي. سعيدة جداً بالشراء!", textEn: "Easy ordering and fast delivery. The team was cooperative and answered all my questions.", rating: 5 },
  ],
  announcement: {
    enabled: true,
    ar: "الشحن مجاناً على الطلبات فوق 500 جنيه | اتصل بنا: 01552221286",
    en: "Free shipping on orders over 500 EGP | Contact us: 01552221286",
  },
  sale: {
    enabled: true,
    endDate: "2026-05-10T23:59:59",
    discount: 30,
    titleAr: "تخفيضات العيد — خصم يصل إلى ٣٠٪",
    titleEn: "Eid Sale — Up to 30% Off",
  },
  sections: DEFAULT_SECTIONS,
  payment: {
    cod: { enabled: true },
    vodafone_cash: {
      enabled: true,
      phone: "01552221286",
      id: "",
      link: "",
      instructionsAr: "حوّل المبلغ على رقم فودافون كاش التالي ثم اضغط تأكيد الطلب",
      instructionsEn: "Transfer the amount to the Vodafone Cash number below then confirm your order",
    },
    instapay: {
      enabled: true,
      phone: "",
      id: "01552221286",
      link: "",
      instructionsAr: "حوّل المبلغ على حساب إنستا باي التالي ثم اضغط تأكيد الطلب",
      instructionsEn: "Transfer the amount to the InstaPay account below then confirm your order",
    },
    fawry: {
      enabled: true,
      phone: "01552221286",
      id: "",
      link: "",
      instructionsAr: "ادفع في أقرب فرع فوري أو من خلال التطبيق باستخدام الرقم التالي",
      instructionsEn: "Pay at any Fawry branch or through the app using the number below",
    },
    card: {
      enabled: false,
      phone: "",
      id: "",
      link: "",
      instructionsAr: "ادفع بالبطاقة البنكية عبر الرابط الآمن التالي",
      instructionsEn: "Pay securely by card using the link below",
    },
  },
};

export async function fetchSetting<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/settings/${key}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.value as T;
  } catch {
    return null;
  }
}

export async function saveSetting(key: string, value: unknown): Promise<boolean> {
  try {
    const res = await fetch(`/api/settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
