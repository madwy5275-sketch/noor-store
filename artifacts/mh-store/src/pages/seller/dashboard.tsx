import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Clock, CheckCircle, Truck, XCircle, TrendingUp } from "lucide-react";

export default function SellerDashboard() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-secondary/50 w-1/4 rounded-none"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-secondary/50 rounded-none"></div>)}
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight mb-2">{t("نظرة عامة", "Overview")}</h1>
          <p className="text-muted-foreground">{t("مرحباً بك في لوحة تحكم متجرك الفاخر.", "Welcome to your premium store dashboard.")}</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-none border-border shadow-none bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("إجمالي الإيرادات", "Total Revenue")}</CardTitle>
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-black">{stats?.totalRevenue || 0} <span className="text-base font-sans font-normal text-muted-foreground">{t("ج.م", "EGP")}</span></div>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-border shadow-none bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("إجمالي الطلبات", "Total Orders")}</CardTitle>
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-black">{stats?.totalOrders || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-border shadow-none bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("المنتجات", "Products")}</CardTitle>
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-black">{stats?.totalProducts || 0}</div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-amber-500/20 shadow-none bg-amber-500/5 hover:border-amber-500/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">{t("طلبات قيد الانتظار", "Pending Orders")}</CardTitle>
              <div className="w-10 h-10 bg-amber-500/20 flex items-center justify-center rounded-full">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-black text-amber-700 dark:text-amber-500">{stats?.pendingOrders || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-6">
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            {t("حالة الطلبات", "Order Status")}
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="rounded-none shadow-none border-border bg-card">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-10 w-10 text-blue-500 mb-4 stroke-[1.5]" />
                <div className="text-4xl font-serif font-black text-foreground mb-2">{stats?.confirmedOrders || 0}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("مؤكدة", "Confirmed")}</div>
              </CardContent>
            </Card>
            
            <Card className="rounded-none shadow-none border-border bg-card">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Truck className="h-10 w-10 text-purple-500 mb-4 stroke-[1.5]" />
                <div className="text-4xl font-serif font-black text-foreground mb-2">{stats?.shippedOrders || 0}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("مشحونة", "Shipped")}</div>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-none border-border bg-card">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Package className="h-10 w-10 text-green-500 mb-4 stroke-[1.5]" />
                <div className="text-4xl font-serif font-black text-foreground mb-2">{stats?.deliveredOrders || 0}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("مستلمة", "Delivered")}</div>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-none border-border bg-card">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <XCircle className="h-10 w-10 text-red-500 mb-4 stroke-[1.5]" />
                <div className="text-4xl font-serif font-black text-foreground mb-2">{stats?.cancelledOrders || 0}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("ملغاة", "Cancelled")}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
