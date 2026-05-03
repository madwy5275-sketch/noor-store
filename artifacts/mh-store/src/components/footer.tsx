import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { useState } from "react";
import { useSiteSettings } from "@/contexts/site-settings-context";

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 border border-background/20 flex items-center justify-center text-background/60 hover:text-background hover:border-background/60 transition-all duration-200"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { brand, contact } = settings;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); }
  };

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">{t("النشرة البريدية", "NEWSLETTER")}</p>
              <h3 className="text-2xl font-serif font-black text-background">
                {t("اشترك واحصل على خصم 10%", "Subscribe & Get 10% Off")}
              </h3>
              <p className="text-background/50 text-sm mt-1 font-light">
                {t("أحدث المنتجات والعروض مباشرة إلى بريدك", "Latest products and offers straight to your inbox")}
              </p>
            </div>
            {subscribed ? (
              <div className="bg-primary/20 border border-primary/40 px-8 py-4 text-center">
                <p className="text-background font-bold">{t("🎉 تم الاشتراك! كودك: MH10", "🎉 Subscribed! Your code: MH10")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto min-w-[340px]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("بريدك الإلكتروني...", "Your email address...")}
                  className="flex-1 h-12 bg-background/10 border border-background/20 px-4 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  {t("اشترك", "Subscribe")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-4xl font-serif font-black tracking-tight text-background">
              {brand.storeName}
            </Link>
            <p className="mt-3 text-xs font-light tracking-[0.2em] uppercase text-primary/80">
              {language === "ar" ? brand.taglineAr : brand.taglineEn}
            </p>
            <p className="mt-5 text-sm text-background/70 leading-relaxed max-w-xs font-light">
              {language === "ar" ? brand.descriptionAr : brand.descriptionEn}
            </p>
            <div className="flex items-center gap-2 mt-6">
              <SocialIcon href={contact.facebook}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </SocialIcon>
              <SocialIcon href={contact.instagram}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </SocialIcon>
              <SocialIcon href={contact.tiktok}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif font-bold mb-6 text-primary tracking-wide">{t("تسوق", "Shop")}</h3>
            <ul className="space-y-4 text-sm text-background/70 font-light">
              <li><Link href="/products" className="hover:text-primary transition-colors">{t("كل المنتجات", "All Products")}</Link></li>
              <li><Link href="/products?category=women" className="hover:text-primary transition-colors">{t("نسائي", "Women")}</Link></li>
              <li><Link href="/products?category=kids" className="hover:text-primary transition-colors">{t("بنات", "Girls")}</Link></li>
              <li><Link href="/products?category=bags" className="hover:text-primary transition-colors">{t("شنط", "Bags")}</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">{t("المفضلة", "Wishlist")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif font-bold mb-6 text-primary tracking-wide">{t("خدمة العملاء", "Customer Service")}</h3>
            <ul className="space-y-4 text-sm text-background/70 font-light">
              <li><Link href="/track-order" className="hover:text-primary transition-colors">{t("تتبع الطلب", "Track Order")}</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">{t("سياسة الاسترجاع", "Return Policy")}</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">{t("الشحن والتوصيل", "Shipping & Delivery")}</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">{t("الأسئلة الشائعة", "FAQ")}</Link></li>
              <li><Link href="/payment-methods" className="hover:text-primary transition-colors">{t("طرق الدفع", "Payment Methods")}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-serif font-bold mb-6 text-primary tracking-wide">{t("الشركة", "Company")}</h3>
            <ul className="space-y-4 text-sm text-background/70 font-light">
              <li><Link href="/about" className="hover:text-primary transition-colors">{t("من نحن", "About Us")}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t("تواصل معنا", "Contact Us")}</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">{t("الشروط والأحكام", "Terms & Conditions")}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{t("سياسة الخصوصية", "Privacy Policy")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold mb-6 text-primary tracking-wide">{t("تواصل معنا", "Contact Us")}</h3>
            <ul className="space-y-4 text-sm text-background/70 font-light">
              {contact.whatsapp && (
                <li>
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/></svg>
                    WhatsApp
                  </a>
                </li>
              )}
              {contact.phone1 && <li><a href={`tel:${contact.phone1}`} className="hover:text-primary transition-colors block" dir="ltr">{contact.phone1}</a></li>}
              {contact.phone2 && <li><a href={`tel:${contact.phone2}`} className="hover:text-primary transition-colors block" dir="ltr">{contact.phone2}</a></li>}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-light mb-4">
            <p className="text-sm text-background/60">
              &copy; {currentYear} {brand.storeName}. {t("جميع الحقوق محفوظة", "All rights reserved.")}
            </p>
            <div className="flex items-center gap-4 text-xs text-background/40 flex-wrap justify-center">
              <Link href="/shipping" className="hover:text-primary transition-colors">{t("سياسة الشحن", "Shipping Policy")}</Link>
              <span>·</span>
              <Link href="/returns" className="hover:text-primary transition-colors">{t("سياسة الاسترجاع", "Return Policy")}</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-primary transition-colors">{t("الشروط والأحكام", "Terms")}</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">{t("الخصوصية", "Privacy")}</Link>
              <span>·</span>
              <Link href="/faq" className="hover:text-primary transition-colors">{t("الأسئلة الشائعة", "FAQ")}</Link>
              <span>·</span>
              <Link href="/payment-methods" className="hover:text-primary transition-colors">{t("طرق الدفع", "Payments")}</Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-background/40 flex-wrap">
            <span>{t("💵 الدفع عند الاستلام", "💵 Cash on Delivery")}</span>
            <span>·</span>
            <span>{t("📱 فودافون كاش", "📱 Vodafone Cash")}</span>
            <span>·</span>
            <span>{t("⚡ إنستا باي", "⚡ InstaPay")}</span>
            <span>·</span>
            <span>{t("🏪 فوري", "🏪 Fawry")}</span>
            <span>·</span>
            <span>{t("💳 بطاقة بنكية", "💳 Bank Card")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
