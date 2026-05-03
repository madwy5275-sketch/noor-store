import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, Settings, Ticket, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useEffect } from "react";

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [location, setLocation] = useLocation();
  const { isLoggedIn, isLoading, logout } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      setLocation("/seller/login");
    }
  }, [isLoading, isLoggedIn, setLocation]);

  const links = [
    {
      href: "/seller",
      icon: LayoutDashboard,
      label: t("لوحة التحكم", "Dashboard"),
      exact: true,
    },
    {
      href: "/seller/products",
      icon: Package,
      label: t("المنتجات", "Products"),
    },
    {
      href: "/seller/orders",
      icon: ShoppingCart,
      label: t("الطلبات", "Orders"),
    },
    {
      href: "/seller/coupons",
      icon: Ticket,
      label: t("كوبونات الخصم", "Coupons"),
    },
    {
      href: "/seller/reviews",
      icon: MessageSquare,
      label: t("التقييمات", "Reviews"),
    },
    {
      href: "/seller/settings",
      icon: Settings,
      label: t("إعدادات الموقع", "Site Settings"),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r rtl:border-l rtl:border-r-0 border-border bg-sidebar text-sidebar-foreground flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <Link href="/seller" className="flex items-center gap-3 text-2xl font-serif font-black tracking-tight text-primary">
            <Store className="h-7 w-7" />
            <span>Noor Seller</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact 
              ? location === link.href 
              : location.startsWith(link.href);
              
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-none transition-colors text-sm font-semibold tracking-wide ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 rtl:border-r-4 rtl:border-l-0 border-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-4 rtl:border-r-4 rtl:border-l-0 border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50 space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 rounded-none h-12 font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 rtl:rotate-180" />
            {t("تسجيل الخروج", "Logout")}
          </Button>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-none h-12 text-muted-foreground hover:bg-sidebar-accent">
              <Store className="h-4 w-4" />
              {t("العودة للمتجر", "Back to Store")}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background md:bg-secondary/20">
        <header className="h-20 flex items-center px-6 border-b border-border bg-card shadow-sm z-10 md:hidden">
          <Link href="/seller" className="font-serif font-black text-2xl text-primary">Noor</Link>
          <div className="ml-auto rtl:mr-auto rtl:ml-0 flex items-center gap-2">
             <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-none">
                {t("المتجر", "Store")}
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-none">
               <LogOut className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
