import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useListOrders, useUpdateOrder, getListOrdersQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Phone, CreditCard, Package, StickyNote, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  shipped:   "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
};

const PAYMENT_LABELS: Record<string, { ar: string; en: string; icon: string; style: string }> = {
  cod:           { ar: "عند الاستلام",  en: "Cash on Delivery", icon: "💵", style: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400" },
  vodafone_cash: { ar: "فودافون كاش",   en: "Vodafone Cash",   icon: "📱", style: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400" },
  instapay:      { ar: "إنستا باي",     en: "InstaPay",        icon: "⚡", style: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400" },
  fawry:         { ar: "فوري",          en: "Fawry",           icon: "🏪", style: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400" },
  card:          { ar: "بطاقة بنكية",   en: "Bank Card",       icon: "💳", style: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400" },
};

export default function SellerOrders() {
  const { t, language } = useI18n();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useListOrders();
  const updateOrder = useUpdateOrder();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleStatusChange = (orderId: number, status: any, e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrder.mutate(
      { id: orderId, data: { status } },
      {
        onSuccess: () => {
          toast.success(t("تم تحديث حالة الطلب", "Order status updated"));
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
        },
      }
    );
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      pending:   { ar: "قيد الانتظار", en: "Pending" },
      confirmed: { ar: "مؤكد",         en: "Confirmed" },
      shipped:   { ar: "مشحون",        en: "Shipped" },
      delivered: { ar: "مستلم",        en: "Delivered" },
      cancelled: { ar: "ملغي",         en: "Cancelled" },
    };
    return t(labels[status]?.ar || status, labels[status]?.en || status);
  };

  return (
    <SellerLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight mb-2">{t("الطلبات", "Orders")}</h1>
            <p className="text-muted-foreground">{t("اضغط على أي طلب لعرض تفاصيله كاملة.", "Click any order row to see full details.")}</p>
          </div>
          {orders && (
            <span className="text-sm text-muted-foreground font-mono bg-secondary px-3 py-1.5 border border-border">
              {orders.length} {t("طلب", "orders")}
            </span>
          )}
        </div>

        <div className="bg-card shadow-sm border border-border">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4 w-8"></TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("رقم الطلب", "Order ID")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("العميل", "Customer")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("التاريخ", "Date")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("المبلغ", "Total")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("الدفع", "Payment")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("الحالة", "Status")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4 text-right rtl:text-left" onClick={(e) => e.stopPropagation()}>{t("تحديث الحالة", "Update Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    {t("جاري التحميل...", "Loading...")}
                  </TableCell>
                </TableRow>
              ) : orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    {t("لا توجد طلبات حالياً", "No orders found")}
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-secondary/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="py-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </TableCell>
                    <TableCell className="font-serif font-bold text-lg py-3">#{order.id}</TableCell>
                    <TableCell className="py-3">
                      <div className="font-bold text-foreground mb-0.5">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground font-mono bg-secondary/50 inline-block px-2 py-0.5 rounded-sm">{order.customerPhone}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm py-3">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-bold text-lg">{order.totalAmount}</span>{" "}
                      <span className="text-muted-foreground text-sm">{t("ج.م", "EGP")}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      {(() => {
                        const pm = (order as any).paymentMethod || "cod";
                        const info = PAYMENT_LABELS[pm] || PAYMENT_LABELS.cod;
                        return (
                          <Badge variant="outline" className={`${info.style} rounded-none px-2 py-1 font-semibold border text-xs flex items-center gap-1.5 w-fit`}>
                            <span>{info.icon}</span>
                            {t(info.ar, info.en)}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`${STATUS_COLORS[order.status] || ''} rounded-none px-3 py-1 font-semibold tracking-wide border uppercase text-xs`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right rtl:text-left py-3" onClick={(e) => e.stopPropagation()}>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val, { stopPropagation: () => {} } as any)}
                        disabled={updateOrder.isPending}
                      >
                        <SelectTrigger className="w-[160px] h-10 rounded-none bg-background border-border focus:ring-1 focus:ring-primary ml-auto rtl:mr-auto rtl:ml-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border shadow-xl">
                          <SelectItem value="pending"   className="focus:bg-secondary rounded-none">{getStatusLabel("pending")}</SelectItem>
                          <SelectItem value="confirmed" className="focus:bg-secondary rounded-none">{getStatusLabel("confirmed")}</SelectItem>
                          <SelectItem value="shipped"   className="focus:bg-secondary rounded-none">{getStatusLabel("shipped")}</SelectItem>
                          <SelectItem value="delivered" className="focus:bg-secondary rounded-none">{getStatusLabel("delivered")}</SelectItem>
                          <SelectItem value="cancelled" className="focus:bg-secondary rounded-none text-destructive">{getStatusLabel("cancelled")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Order Detail Modal ── */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-border p-0">
          {selectedOrder && (
            <>
              <DialogHeader className="px-6 py-5 border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between">
                  <DialogTitle className="font-serif text-2xl font-black">
                    {t("تفاصيل الطلب", "Order Details")} <span className="text-primary">#{selectedOrder.id}</span>
                  </DialogTitle>
                  <Badge variant="outline" className={`${STATUS_COLORS[selectedOrder.status] || ''} rounded-none px-3 py-1 font-bold border uppercase text-xs`}>
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(selectedOrder.createdAt), 'EEEE, dd MMMM yyyy — HH:mm')}
                </p>
              </DialogHeader>

              <div className="px-6 py-5 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/30 border border-border p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("بيانات العميل", "Customer Info")}</p>
                    <p className="font-bold text-lg">{selectedOrder.customerName}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-mono" dir="ltr">{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedOrder.customerCity}</p>
                        <p className="text-muted-foreground text-xs">{selectedOrder.customerAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary/30 border border-border p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("ملخص الدفع", "Payment Summary")}</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      {(() => {
                        const pm = selectedOrder.paymentMethod || "cod";
                        const info = PAYMENT_LABELS[pm] || PAYMENT_LABELS.cod;
                        return (
                          <span className="font-semibold">{info.icon} {t(info.ar, info.en)}</span>
                        );
                      })()}
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("الإجمالي", "Total")}</p>
                      <p className="text-3xl font-serif font-black text-primary mt-1">
                        {selectedOrder.totalAmount} <span className="text-base font-sans font-normal text-muted-foreground">{t("ج.م", "EGP")}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-primary" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("المنتجات المطلوبة", "Ordered Items")}</p>
                  </div>
                  <div className="border border-border divide-y divide-border">
                    {(selectedOrder.items as any[])?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-3 bg-background">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-10 bg-primary/30 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">{language === "ar" ? item.productNameAr : item.productNameEn}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>{t("الكمية", "Qty")}: <span className="font-bold text-foreground">{item.quantity}</span></span>
                              {item.size  && <span>{t("المقاس", "Size")}: <span className="font-bold text-foreground">{item.size}</span></span>}
                              {item.color && <span>{t("اللون", "Color")}: <span className="font-bold text-foreground">{item.color}</span></span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.price * item.quantity} <span className="text-xs font-normal text-muted-foreground">{t("ج.م", "EGP")}</span></p>
                          <p className="text-xs text-muted-foreground">{item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
                    <StickyNote className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">{t("ملاحظات العميل", "Customer Notes")}</p>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Update Status */}
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("تحديث الحالة", "Update Status")}</p>
                  <Select
                    defaultValue={selectedOrder.status}
                    onValueChange={(val) => {
                      updateOrder.mutate(
                        { id: selectedOrder.id, data: { status: val as any } },
                        {
                          onSuccess: () => {
                            toast.success(t("تم تحديث حالة الطلب", "Order status updated"));
                            queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
                            queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
                            setSelectedOrder((prev: any) => prev ? { ...prev, status: val } : null);
                          },
                        }
                      );
                    }}
                    disabled={updateOrder.isPending}
                  >
                    <SelectTrigger className="h-12 rounded-none border-border focus:ring-1 focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border shadow-xl">
                      <SelectItem value="pending"   className="focus:bg-secondary rounded-none">{getStatusLabel("pending")}</SelectItem>
                      <SelectItem value="confirmed" className="focus:bg-secondary rounded-none">{getStatusLabel("confirmed")}</SelectItem>
                      <SelectItem value="shipped"   className="focus:bg-secondary rounded-none">{getStatusLabel("shipped")}</SelectItem>
                      <SelectItem value="delivered" className="focus:bg-secondary rounded-none">{getStatusLabel("delivered")}</SelectItem>
                      <SelectItem value="cancelled" className="focus:bg-secondary rounded-none text-destructive">{getStatusLabel("cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SellerLayout>
  );
}
