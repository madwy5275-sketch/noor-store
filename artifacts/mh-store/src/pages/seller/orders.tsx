import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useListOrders, useUpdateOrder, getListOrdersQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  shipped: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
};

const PAYMENT_LABELS: Record<string, { ar: string; en: string; icon: string; style: string }> = {
  cod:           { ar: "عند الاستلام", en: "Cash on Delivery", icon: "💵", style: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400" },
  vodafone_cash: { ar: "فودافون كاش",  en: "Vodafone Cash",   icon: "📱", style: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400" },
  instapay:      { ar: "إنستا باي",    en: "InstaPay",        icon: "⚡", style: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400" },
  fawry:         { ar: "فوري",         en: "Fawry",           icon: "🏪", style: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400" },
  card:          { ar: "بطاقة بنكية",  en: "Bank Card",       icon: "💳", style: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400" },
};

export default function SellerOrders() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useListOrders();
  const updateOrder = useUpdateOrder();

  const handleStatusChange = (orderId: number, status: any) => {
    updateOrder.mutate({
      id: orderId,
      data: { status }
    }, {
      onSuccess: () => {
        toast.success(t("تم تحديث حالة الطلب", "Order status updated"));
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      }
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, {ar: string, en: string}> = {
      pending: { ar: "قيد الانتظار", en: "Pending" },
      confirmed: { ar: "مؤكد", en: "Confirmed" },
      shipped: { ar: "مشحون", en: "Shipped" },
      delivered: { ar: "مستلم", en: "Delivered" },
      cancelled: { ar: "ملغي", en: "Cancelled" }
    };
    return t(labels[status]?.ar || status, labels[status]?.en || status);
  };

  return (
    <SellerLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight mb-2">{t("الطلبات", "Orders")}</h1>
            <p className="text-muted-foreground">{t("إدارة ومتابعة طلبات العملاء.", "Manage and track customer orders.")}</p>
          </div>
        </div>

        <div className="bg-card shadow-sm border border-border">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("رقم الطلب", "Order ID")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("العميل", "Customer")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("التاريخ", "Date")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("المبلغ", "Total")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("الدفع", "Payment")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("الحالة", "Status")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4 text-right rtl:text-left">{t("تحديث الحالة", "Update Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    {t("جاري التحميل...", "Loading...")}
                  </TableCell>
                </TableRow>
              ) : orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {t("لا توجد طلبات حالياً", "No orders found")}
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => (
                  <TableRow key={order.id} className="hover:bg-secondary/20 transition-colors group">
                    <TableCell className="font-serif font-bold text-lg">#{order.id}</TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground mb-1">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground font-mono bg-secondary/50 inline-block px-2 py-0.5 rounded-sm mb-1">{order.customerPhone}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">{order.customerCity} - {order.customerAddress}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-lg">{order.totalAmount}</span> <span className="text-muted-foreground text-sm">{t("ج.م", "EGP")}</span>
                    </TableCell>
                    <TableCell>
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
                    <TableCell>
                      <Badge variant="outline" className={`${STATUS_COLORS[order.status] || ''} rounded-none px-3 py-1 font-semibold tracking-wide border uppercase text-xs`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                        disabled={updateOrder.isPending}
                      >
                        <SelectTrigger className="w-[160px] h-10 rounded-none bg-background border-border focus:ring-1 focus:ring-primary ml-auto rtl:mr-auto rtl:ml-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border shadow-xl">
                          <SelectItem value="pending" className="focus:bg-secondary rounded-none">{getStatusLabel("pending")}</SelectItem>
                          <SelectItem value="confirmed" className="focus:bg-secondary rounded-none">{getStatusLabel("confirmed")}</SelectItem>
                          <SelectItem value="shipped" className="focus:bg-secondary rounded-none">{getStatusLabel("shipped")}</SelectItem>
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
    </SellerLayout>
  );
}
