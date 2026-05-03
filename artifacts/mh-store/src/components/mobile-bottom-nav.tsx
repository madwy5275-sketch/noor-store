import { useLocation, Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/hooks/use-cart";
import { Home, Grid, Search, ShoppingBag } from "lucide-react";

export function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useI18n();
  const { totalItems } = useCart();

  const navItems = [
    { href: "/", icon: Home, label: t("الرئيسية", "Home") },
    { href: "/products", icon: Grid, label: t("المنتجات", "Products") },
    { href: "/track-order", icon: Search, label: t("تتبع", "Track") },
    { href: "/cart", icon: ShoppingBag, label: t("السلة", "Cart"), badge: totalItems > 0 ? totalItems : 0 }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50 h-16 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 group h-full">
            <div className="relative">
              <item.icon 
                className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} 
              />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
