import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useListCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, useListOrders } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Tag, CheckCircle, XCircle, Ticket, Copy, BarChart2, ShoppingBag, TrendingDown, Banknote } from "lucide-react";
import type { Coupon } from "@workspace/api-client-react";

const EMPTY_FORM = {
  code: "",
  discountPercentage: 10,
  active: true,
  expiresAt: "",
  usageLimit: "",
  description: "",
};

export default function SellerCoupons() {
  const { t } = useI18n();
  const { data: coupons = [], refetch } = useListCoupons();
  const { data: allOrders = [] } = useListOrders({});
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Compute per-coupon analytics from orders
  const couponStats = useMemo(() => {
    const map = new Map<string, { orders: number; totalDiscount: number; totalRevenue: number }>();
    for (const order of allOrders) {
      if (!order.couponCode) continue;
      const key = order.couponCode;
      const existing = map.get(key) ?? { orders: 0, totalDiscount: 0, totalRevenue: 0 };
      const discount = typeof order.discountAmount === "number" ? order.discountAmount : parseFloat(String(order.discountAmount ?? "0")) || 0;
      const revenue = typeof order.totalAmount === "number" ? order.totalAmount : parseFloat(String(order.totalAmount ?? "0")) || 0;
      map.set(key, {
        orders: existing.orders + 1,
        totalDiscount: existing.totalDiscount + discount,
        totalRevenue: existing.totalRevenue + revenue,
      });
    }
    return map;
  }, [allOrders]);

  const totalOrdersWithCoupon = useMemo(() => {
    return allOrders.filter((o) => o.couponCode).length;
  }, [allOrders]);

  const totalDiscountGiven = useMemo(() => {
    return allOrders.reduce((sum, o) => {
      if (!o.couponCode) return sum;
      const d = typeof o.discountAmount === "number" ? o.discountAmount : parseFloat(String(o.discountAmount ?? "0")) || 0;
      return sum + d;
    }, 0);
  }, [allOrders]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discountPercentage: c.discountPercentage,
      active: c.active,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
      description: c.description ?? "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: form.code.trim().toUpperCase(),
      discountPercentage: Number(form.discountPercentage),
      active: form.active,
      expiresAt: form.expiresAt || null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      description: form.description || undefined,
    };

    if (editing) {
      updateCoupon.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: () => {
            toast.success(t("تم تحديث الكوبون", "Coupon updated"));
            setShowForm(false);
            refetch();
          },
          onError: () => toast.error(t("حدث خطأ", "Something went wrong")),
        }
      );
    } else {
      createCoupon.mutate(
        { data: payload },
        {
          onSuccess: () => {
            toast.success(t("تم إنشاء الكوبون", "Coupon created"));
            setShowForm(false);
            refetch();
          },
          onError: (err: unknown) => {
            const msg =
              err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "";
            toast.error(msg.includes("409") ? t("الكود موجود بالفعل", "Code already exists") : t("حدث خطأ", "Error"));
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    deleteCoupon.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success(t("تم الحذف", "Deleted"));
          setDeleteConfirm(null);
          refetch();
        },
        onError: () => toast.error(t("حدث خطأ", "Error")),
      }
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("تم نسخ الكود", "Code copied!"));
  };

  const codesWithOrders = coupons.filter((c) => couponStats.has(c.code));

  return (
    <SellerLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight mb-2">
              {t("كوبونات الخصم", "Discount Coupons")}
            </h1>
            <p className="text-muted-foreground">
              {t("أنشئ وأدر كودات الخصم — يتحكم بها العميل عند الدفع.", "Create and manage discount codes — customers apply them at checkout.")}
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="h-12 px-6 rounded-none font-bold gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("إنشاء كوبون", "Create Coupon")}
          </Button>
        </div>

        {/* Analytics Summary */}
        {totalOrdersWithCoupon > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="rounded-none shadow-none border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{totalOrdersWithCoupon}</p>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t("طلب استخدم كوبون", "Orders with coupon")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none shadow-none border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center shrink-0">
                  <TrendingDown className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-black">{totalDiscountGiven.toFixed(0)} ج</p>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t("إجمالي الخصومات", "Total discounts given")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none shadow-none border col-span-2 md:col-span-1">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center shrink-0">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">
                    {allOrders.filter((o) => o.couponCode).reduce((s, o) => {
                      const r = typeof o.totalAmount === "number" ? o.totalAmount : parseFloat((o.totalAmount as string) ?? "0") || 0;
                      return s + r;
                    }, 0).toFixed(0)} ج
                  </p>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t("إيرادات من طلبات الكوبون", "Revenue from coupon orders")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Per-coupon analytics table */}
        {codesWithOrders.length > 0 && (
          <Card className="rounded-none shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif font-black text-xl flex items-center gap-3">
                <BarChart2 className="h-5 w-5 text-primary" />
                {t("أداء كل كوبون", "Performance by Coupon")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-start rtl:text-end px-6 py-3 font-bold uppercase tracking-wide text-xs text-muted-foreground">{t("الكود", "Code")}</th>
                      <th className="text-start rtl:text-end px-6 py-3 font-bold uppercase tracking-wide text-xs text-muted-foreground">{t("نسبة الخصم", "Discount %")}</th>
                      <th className="text-start rtl:text-end px-6 py-3 font-bold uppercase tracking-wide text-xs text-muted-foreground">{t("الطلبات", "Orders")}</th>
                      <th className="text-start rtl:text-end px-6 py-3 font-bold uppercase tracking-wide text-xs text-muted-foreground">{t("إجمالي الخصم", "Total Discount")}</th>
                      <th className="text-start rtl:text-end px-6 py-3 font-bold uppercase tracking-wide text-xs text-muted-foreground">{t("الإيرادات", "Revenue")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codesWithOrders.map((c) => {
                      const stats = couponStats.get(c.code)!;
                      return (
                        <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => copyCode(c.code)}
                              className="font-mono font-black tracking-widest hover:text-primary transition-colors flex items-center gap-1.5 group"
                            >
                              {c.code}
                              <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
                          </td>
                          <td className="px-6 py-4 font-black text-primary text-lg">{c.discountPercentage}%</td>
                          <td className="px-6 py-4 font-bold">{stats.orders}</td>
                          <td className="px-6 py-4 font-bold text-red-500">{stats.totalDiscount.toFixed(0)} ج</td>
                          <td className="px-6 py-4 font-bold text-green-600">{stats.totalRevenue.toFixed(0)} ج</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        {showForm && (
          <Card className="rounded-none border-primary/40 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif font-black text-2xl flex items-center gap-3">
                <Ticket className="h-6 w-6 text-primary" />
                {editing ? t("تعديل الكوبون", "Edit Coupon") : t("كوبون جديد", "New Coupon")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Code */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wide">
                      {t("كود الخصم", "Coupon Code")}
                    </Label>
                    <Input
                      required
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="EID20"
                      className="h-12 rounded-none font-mono text-lg font-bold tracking-widest uppercase"
                    />
                    <p className="text-xs text-muted-foreground">{t("سيتم تحويله للحروف الكبيرة تلقائياً", "Auto-converted to uppercase")}</p>
                  </div>

                  {/* Discount % */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wide">
                      {t("نسبة الخصم %", "Discount Percentage %")}
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        type="number"
                        min={1}
                        max={100}
                        value={form.discountPercentage}
                        onChange={(e) => setForm({ ...form, discountPercentage: Number(e.target.value) })}
                        className="h-12 rounded-none text-lg font-bold pr-12 rtl:pl-12 rtl:pr-4"
                      />
                      <span className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-2xl font-black text-primary">%</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wide">
                      {t("وصف الكوبون (اختياري)", "Description (optional)")}
                    </Label>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder={t("مثال: خصم العيد", "e.g. Eid discount")}
                      className="h-12 rounded-none"
                    />
                  </div>

                  {/* Expiry */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wide">
                      {t("تاريخ الانتهاء (اختياري)", "Expiry Date (optional)")}
                    </Label>
                    <Input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className="h-12 rounded-none"
                    />
                  </div>

                  {/* Usage limit */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wide">
                      {t("حد الاستخدام (اختياري)", "Usage Limit (optional)")}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                      placeholder={t("غير محدود", "Unlimited")}
                      className="h-12 rounded-none"
                    />
                  </div>

                  {/* Active toggle */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wide">
                      {t("الحالة", "Status")}
                    </Label>
                    <div className="flex gap-3 h-12 items-center">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, active: true })}
                        className={`flex-1 h-12 border-2 font-bold text-sm transition-all ${form.active ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                      >
                        ✓ {t("مفعّل", "Active")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, active: false })}
                        className={`flex-1 h-12 border-2 font-bold text-sm transition-all ${!form.active ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                      >
                        ✗ {t("معطّل", "Inactive")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={createCoupon.isPending || updateCoupon.isPending}
                    className="h-12 px-8 rounded-none font-bold"
                  >
                    {editing ? t("حفظ التعديلات", "Save Changes") : t("إنشاء الكوبون", "Create Coupon")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="h-12 px-8 rounded-none font-bold"
                  >
                    {t("إلغاء", "Cancel")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Coupons Table */}
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border">
            <Tag className="h-16 w-16 text-foreground/20 mb-6" />
            <h3 className="text-xl font-serif font-bold mb-2">{t("لا توجد كوبونات بعد", "No coupons yet")}</h3>
            <p className="text-muted-foreground mb-6">{t("أنشئ أول كوبون خصم لعملائك", "Create your first discount coupon for customers")}</p>
            <Button onClick={openCreate} className="rounded-none font-bold gap-2">
              <Plus className="h-4 w-4" />
              {t("إنشاء كوبون", "Create Coupon")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => {
              const isExpired = c.expiresAt ? new Date() > new Date(c.expiresAt) : false;
              const isLimitReached = c.usageLimit != null && c.usedCount >= c.usageLimit;
              const effectivelyActive = c.active && !isExpired && !isLimitReached;
              const stats = couponStats.get(c.code);

              return (
                <Card key={c.id} className={`rounded-none shadow-none border transition-colors ${effectivelyActive ? "border-border hover:border-foreground/30" : "border-border/50 bg-secondary/20 opacity-70"}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Code + badge */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Ticket className="h-7 w-7 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => copyCode(c.code)}
                              className="font-mono font-black text-xl tracking-widest hover:text-primary transition-colors flex items-center gap-1.5 group"
                            >
                              {c.code}
                              <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <Badge
                              variant={effectivelyActive ? "default" : "secondary"}
                              className={`text-xs font-bold rounded-none ${effectivelyActive ? "bg-green-600 hover:bg-green-600" : "bg-secondary"}`}
                            >
                              {effectivelyActive ? (
                                <><CheckCircle className="h-3 w-3 mr-1" />{t("مفعّل", "Active")}</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" />{isExpired ? t("منتهي", "Expired") : isLimitReached ? t("استُنفد", "Used up") : t("معطّل", "Inactive")}</>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {c.description && <span className="mr-2 rtl:ml-2 rtl:mr-0">{c.description}</span>}
                            {c.expiresAt && <span className="mr-2 rtl:ml-2 rtl:mr-0">{t("ينتهي", "Expires")}: {new Date(c.expiresAt).toLocaleDateString()}</span>}
                            {c.usageLimit != null && <span>{t("الاستخدام", "Uses")}: {c.usedCount}/{c.usageLimit}</span>}
                            {c.usageLimit == null && <span>{t("الاستخدام", "Uses")}: {c.usedCount}</span>}
                          </p>
                          {stats && (
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                              <span className="text-foreground/70 font-bold">{stats.orders} {t("طلب", "orders")}</span>
                              <span className="text-red-500 font-bold">−{stats.totalDiscount.toFixed(0)} ج {t("خصم", "disc.")}</span>
                              <span className="text-green-600 font-bold">{stats.totalRevenue.toFixed(0)} ج {t("إيراد", "rev.")}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Discount pct */}
                      <div className="text-center flex-shrink-0 w-20">
                        <div className="text-4xl font-serif font-black text-primary">{c.discountPercentage}%</div>
                        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t("خصم", "off")}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(c)}
                          className="rounded-none h-10 w-10 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {deleteConfirm === c.id ? (
                          <div className="flex gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(c.id)}
                              disabled={deleteCoupon.isPending}
                              className="rounded-none h-10 px-3 text-xs font-bold"
                            >
                              {t("تأكيد", "Confirm")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-none h-10 px-3 text-xs font-bold"
                            >
                              {t("لا", "No")}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(c.id)}
                            className="rounded-none h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
