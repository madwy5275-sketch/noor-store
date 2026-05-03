import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useGetDashboardStats, useListOrders } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, DollarSign, Clock, CheckCircle, Truck, XCircle, TrendingUp, ArrowRight, X, RotateCcw } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  shipped:   "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
};

type FilterKey = "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | null;

const FILTER_LABELS: Record<string, { ar: string; en: string }> = {
  all:       { ar: "جميع الطلبات",       en: "All Orders" },
  pending:   { ar: "قيد الانتظار",       en: "Pending" },
  confirmed: { ar: "مؤكدة",              en: "Confirmed" },
  shipped:   { ar: "مشحونة",             en: "Shipped" },
  delivered: { ar: "مستلمة",             en: "Delivered" },
  cancelled: { ar: "ملغاة",              en: "Cancelled" },
};

function getStatusLabel(status: string, t: (ar: string, en: string) => string) {
  const labels: Record<string, { ar: string; en: string }> = {
    pending:   { ar: "قيد الانتظار", en: "Pending" },
    confirmed: { ar: "مؤكد",         en: "Confirmed" },
    shipped:   { ar: "مشحون",        en: "Shipped" },
    delivered: { ar: "مستلم",        en: "Delivered" },
    cancelled: { ar: "ملغي",         en: "Cancelled" },
  };
  return t(labels[status]?.ar || status, labels[status]?.en || status);
}

export default function SellerDashboard() {
  const { t, language } = useI18n();
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: allOrders } = useListOrders();
  const [activeFilter, setActiveFilter] = useState<FilterKey>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleCardClick = (filter: FilterKey) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
    setSelectedOrder(null);
  };

  const filteredOrders = !allOrders ? [] : activeFilter === "all"
    ? allOrders
    : allOrders.filter((o) => o.status === activeFilter);

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
          <p className="text-muted-foreground">{t("اضغط على أي بطاقة لعرض تفاصيل الطلبات.", "Click any card to see order details.")}</p>
        </div>

        {/* ── Main stat cards (clickable) ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue */}
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

          {/* Total Orders */}
          <button
            onClick={() => handleCardClick("all")}
            className={`text-left rtl:text-right w-full rounded-none border shadow-none bg-card transition-all ${activeFilter === "all" ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
          >
            <div className="p-6">
              <div className="flex flex-row items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("إجمالي الطلبات", "Total Orders")}</span>
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-serif font-black">{stats?.totalOrders || 0}</div>
              {activeFilter === "all" && <p className="text-xs text-primary mt-2 font-bold flex items-center gap-1"><ArrowRight className="h-3 w-3" />{t("جاري العرض أدناه", "Showing below")}</p>}
            </div>
          </button>

          {/* Products */}
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

          {/* Pending Orders */}
          <button
            onClick={() => handleCardClick("pending")}
            className={`text-left rtl:text-right w-full rounded-none border transition-all ${activeFilter === "pending" ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/10" : "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50"}`}
          >
            <div className="p-6">
              <div className="flex flex-row items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">{t("قيد الانتظار", "Pending Orders")}</span>
                <div className="w-10 h-10 bg-amber-500/20 flex items-center justify-center rounded-full">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
              </div>
              <div className="text-3xl font-serif font-black text-amber-700 dark:text-amber-500">{stats?.pendingOrders || 0}</div>
              {activeFilter === "pending" && <p className="text-xs text-amber-600 mt-2 font-bold flex items-center gap-1"><ArrowRight className="h-3 w-3" />{t("جاري العرض أدناه", "Showing below")}</p>}
            </div>
          </button>
        </div>

        {/* ── Order Status row (all clickable) ── */}
        <div className="pt-2">
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            {t("حالة الطلبات", "Order Status")}
            {activeFilter && activeFilter !== "all" && activeFilter !== "pending" && (
              <button onClick={() => { setActiveFilter(null); setSelectedOrder(null); }} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 ml-auto rtl:mr-auto rtl:ml-0">
                <RotateCcw className="h-3 w-3" /> {t("إلغاء التصفية", "Clear filter")}
              </button>
            )}
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { key: "confirmed", Icon: CheckCircle,  color: "text-blue-500",   label: { ar: "مؤكدة",   en: "Confirmed" }, count: stats?.confirmedOrders || 0 },
              { key: "shipped",   Icon: Truck,         color: "text-purple-500", label: { ar: "مشحونة",  en: "Shipped" },   count: stats?.shippedOrders || 0 },
              { key: "delivered", Icon: Package,       color: "text-green-500",  label: { ar: "مستلمة",  en: "Delivered" }, count: stats?.deliveredOrders || 0 },
              { key: "cancelled", Icon: XCircle,       color: "text-red-500",    label: { ar: "ملغاة",   en: "Cancelled" }, count: stats?.cancelledOrders || 0 },
            ].map(({ key, Icon, color, label, count }) => (
              <button
                key={key}
                onClick={() => handleCardClick(key as FilterKey)}
                className={`rounded-none border transition-all w-full ${activeFilter === key ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
              >
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <Icon className={`h-10 w-10 ${color} mb-4 stroke-[1.5]`} />
                  <div className="text-4xl font-serif font-black text-foreground mb-2">{count}</div>
                  <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{language === "ar" ? label.ar : label.en}</div>
                  {activeFilter === key && <p className="text-xs text-primary mt-2 font-bold">{t("انقر مرة أخرى للإغلاق", "Click again to close")}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Filtered Orders Drawer ── */}
        {activeFilter && (
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
              <h3 className="font-serif font-bold text-lg">
                {language === "ar" ? FILTER_LABELS[activeFilter]?.ar : FILTER_LABELS[activeFilter]?.en}
                <span className="ml-2 rtl:mr-2 text-muted-foreground text-base font-normal">({filteredOrders.length})</span>
              </h3>
              <button onClick={() => { setActiveFilter(null); setSelectedOrder(null); }} className="p-2 hover:text-destructive transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>{t("لا توجد طلبات في هذا القسم", "No orders in this section")}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <div key={order.id}>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="w-full text-right rtl:text-right ltr:text-left px-6 py-4 hover:bg-secondary/30 transition-colors flex items-center gap-4"
                    >
                      <span className="font-serif font-bold text-primary w-16">#{order.id}</span>
                      <span className="font-bold flex-1 min-w-0 truncate">{order.customerName}</span>
                      <span className="text-muted-foreground text-sm hidden sm:block">{order.customerCity}</span>
                      <span className="font-bold text-sm whitespace-nowrap">{order.totalAmount} {t("ج.م", "EGP")}</span>
                      <Badge variant="outline" className={`${STATUS_COLORS[order.status] || ''} rounded-none px-2 py-0.5 text-xs font-bold border hidden md:flex`}>
                        {getStatusLabel(order.status, t)}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden lg:block whitespace-nowrap">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </button>

                    {selectedOrder?.id === order.id && (
                      <div className="bg-secondary/20 border-t border-border px-6 py-5 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("العميل", "Customer")}</p>
                            <p className="font-bold">{order.customerName}</p>
                            <p className="text-muted-foreground font-mono text-xs mt-0.5">{order.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("العنوان", "Address")}</p>
                            <p className="font-medium">{order.customerCity}</p>
                            <p className="text-muted-foreground text-xs">{order.customerAddress}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("الإجمالي", "Total")}</p>
                            <p className="font-bold text-primary text-lg">{order.totalAmount} {t("ج.م", "EGP")}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("التاريخ", "Date")}</p>
                            <p className="font-medium">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'HH:mm')}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("المنتجات", "Items")}</p>
                          <div className="space-y-2">
                            {(order.items as any[])?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-background border border-border px-4 py-2 text-sm">
                                <span className="font-semibold">{language === "ar" ? item.productNameAr : item.productNameEn}</span>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  {item.size && <span>{t("مقاس", "Size")}: {item.size}</span>}
                                  {item.color && <span>{t("لون", "Color")}: {item.color}</span>}
                                  <span className="font-bold text-foreground">×{item.quantity}</span>
                                  <span className="font-bold text-foreground whitespace-nowrap">{item.price * item.quantity} {t("ج.م", "EGP")}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {order.notes && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm">
                            <span className="font-bold text-amber-800 dark:text-amber-400">{t("ملاحظات: ", "Notes: ")}</span>
                            <span className="text-foreground">{order.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
