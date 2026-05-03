import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { ShoppingBag, X, Globe, UserCircle, Heart, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { SearchOverlay } from "@/components/search-overlay";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.84 4.84 0 01-1.02-.06z"/>
    </svg>
  );
}

const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
};

export function Navbar() {
  const { t, language, setLanguage } = useI18n();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { settings } = useSiteSettings();
  const { storeName, logoUrl } = settings.brand;

  const toggleLanguage = () => setLanguage(language === "ar" ? "en" : "ar");

  const navLinks = [
    { href: "/", label: t("الرئيسية", "Home") },
    { href: "/products", label: t("المنتجات", "Products") },
    { href: "/products?category=women", label: t("نسائي", "Women") },
    { href: "/abayas", label: t("عبايات", "Abayas") },
    { href: "/products?category=kids", label: t("بنات", "Girls") },
    { href: "/products?category=bags", label: t("شنط", "Bags") },
  ];

  const sidebarSections = [
    { label: t("الجديد", "New Arrivals"), href: "/products?sort=newest" },
    { label: t("المنتجات", "All Products"), href: "/products" },
    {
      label: t("نسائي", "Women's Fashion"),
      href: "/products?category=women",
      sub: [
        { label: t("فساتين", "Dresses"), href: "/products?category=women&q=dress" },
        { label: t("بلوزات", "Blouses"), href: "/products?category=women&q=blouse" },
        { label: t("بدل", "Suits"), href: "/products?category=women&q=suit" },
      ],
    },
    {
      label: t("عبايات", "Abayas"),
      href: "/abayas",
      sub: [
        { label: t("عبايات كلاسيك", "Classic Abayas"), href: "/abayas" },
        { label: t("عبايات سهرة", "Evening Abayas"), href: "/abayas" },
      ],
    },
    { label: t("بنات", "Girls"), href: "/products?category=kids" },
    {
      label: t("شنط وإكسسوار", "Bags & Accessories"),
      href: "/products?category=bags",
      sub: [
        { label: t("شنط سهرة", "Evening Bags"), href: "/products?category=bags" },
        { label: t("شنط يومي", "Daily Bags"), href: "/products?category=bags" },
      ],
    },
    { label: t("عروض حتى 70%", "Sale up to 70%"), href: "/products?sort=price-asc" },
    { label: t("اقل من 200 ج", "Less Than 200 EGP"), href: "/products?maxPrice=200" },
    { label: t("تواصل معنا", "Contact Us"), href: "/contact" },
    { label: t("الشحن والتوصيل", "Shipping Policy"), href: "/shipping" },
    { label: t("الإرجاع والاستبدال", "Returns Policy"), href: "/returns" },
  ];

  const LogoContent = () => {
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={storeName}
          className="h-12 w-auto object-contain max-w-[140px]"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      );
    }
    return (
      <span className="text-3xl font-serif font-black tracking-tight text-foreground">
        {storeName}
      </span>
    );
  };

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20">
          {/* 3-column grid: [logo+burger] [center nav] [actions] */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-full gap-4">

            {/* Col 1 — Logo + hamburger */}
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground flex-shrink-0"
                onClick={() => setIsMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <Link href="/" className="transition-opacity hover:opacity-80 flex items-center flex-shrink-0">
                <LogoContent />
              </Link>
            </div>

            {/* Col 2 — Center nav links (desktop only) */}
            <nav className="hidden lg:flex items-center justify-center gap-6 min-w-0">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Col 3 — Actions: social + search + lang + user + wishlist + cart */}
            <div className="flex items-center gap-2 justify-end">
              {/* Social icons — desktop only, visually separated */}
              <div className="hidden xl:flex items-center gap-3 pe-3 me-1 border-e border-border/40">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-foreground/45 hover:text-foreground transition-colors" aria-label="Instagram">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-foreground/45 hover:text-foreground transition-colors" aria-label="Facebook">
                  <FacebookIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
                  className="text-foreground/45 hover:text-foreground transition-colors" aria-label="TikTok">
                  <TikTokIcon className="h-[18px] w-[18px]" />
                </a>
              </div>

              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-foreground/80 hover:text-foreground"
                aria-label={t("بحث", "Search")}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Language */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="font-semibold px-2 text-foreground/80 hover:text-foreground hidden sm:flex"
              >
                <Globe className="h-4 w-4 me-1" />
                {language === "ar" ? "EN" : "عربي"}
              </Button>

              {/* Seller */}
              <Link href="/seller" className="hidden md:inline-flex">
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-foreground">
                  <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-primary text-primary" : ""}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1.5 end-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-foreground">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 end-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-[2px]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-out sidebar */}
      <aside
        className={`fixed top-0 ${language === "ar" ? "right-0" : "left-0"} h-full w-[280px] bg-background z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-x-0"
            : language === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
          <span className="text-xl font-serif font-black text-foreground">{storeName}</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search row in sidebar */}
        <button
          onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
          className="flex items-center gap-3 px-6 py-4 border-b border-border/40 text-sm text-foreground/60 hover:text-foreground hover:bg-secondary/40 transition-colors"
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span>{t("بحث...", "Search...")}</span>
        </button>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {sidebarSections.map((section) => (
            <div key={section.href + section.label}>
              <button
                onClick={() => {
                  if (section.sub) {
                    setExpandedCategory(expandedCategory === section.label ? null : section.label);
                  } else {
                    window.location.href = section.href;
                    setIsMenuOpen(false);
                  }
                }}
                className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary/60 transition-colors text-start"
              >
                {section.label}
                {section.sub && (
                  <ChevronDown className={`h-4 w-4 text-foreground/40 transition-transform duration-200 flex-shrink-0 ms-2 ${expandedCategory === section.label ? "rotate-180" : ""}`} />
                )}
              </button>
              {section.sub && expandedCategory === section.label && (
                <div className="bg-secondary/30 border-y border-border/20">
                  {section.sub.map((sub) => (
                    <Link
                      key={sub.href + sub.label}
                      href={sub.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-10 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border/50 p-6 space-y-5">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
              {t("تابعنا", "Follow us")}
            </span>
            <div className="flex items-center gap-4">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground transition-colors">
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === "ar" ? "English" : "عربي"}
          </button>
        </div>
      </aside>
    </>
  );
}
