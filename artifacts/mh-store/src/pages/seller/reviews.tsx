import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, Filter } from "lucide-react";

interface Review {
  id: number;
  productId: number;
  productNameAr: string;
  productNameEn: string;
  customerName: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  createdAt: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-primary text-primary" : "text-border"}`} />
      ))}
    </div>
  );
}

export default function SellerReviews() {
  const { t, language } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/all");
      if (!res.ok) throw new Error("Failed");
      setReviews(await res.json());
    } catch {
      toast.error(t("فشل تحميل التقييمات", "Failed to load reviews"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews/${id}/approve`, { method: "PUT" });
      if (!res.ok) throw new Error();
      toast.success(t("تمت الموافقة على التقييم", "Review approved"));
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: true } : r));
    } catch {
      toast.error(t("حدث خطأ", "Something went wrong"));
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews/${id}/reject`, { method: "PUT" });
      if (!res.ok) throw new Error();
      toast.success(t("تم رفض التقييم", "Review rejected"));
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: false } : r));
    } catch {
      toast.error(t("حدث خطأ", "Something went wrong"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(t("تم حذف التقييم", "Review deleted"));
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirm(null);
    } catch {
      toast.error(t("حدث خطأ", "Something went wrong"));
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  return (
    <SellerLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight mb-2">
              {t("إدارة التقييمات", "Reviews Moderation")}
            </h1>
            <p className="text-muted-foreground">
              {t("راجع وأدر تقييمات العملاء قبل ظهورها على الموقع.", "Review and manage customer reviews before they appear on the site.")}
            </p>
          </div>
          <Button variant="outline" onClick={fetchReviews} className="rounded-none h-10 px-4 font-bold gap-2">
            {t("تحديث", "Refresh")}
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "pending" as const, label: t("في الانتظار", "Pending"), count: pendingCount, color: "text-amber-600" },
            { key: "approved" as const, label: t("موافق عليها", "Approved"), count: approvedCount, color: "text-green-600" },
            { key: "all" as const, label: t("الكل", "All"), count: reviews.length, color: "text-foreground" },
          ].map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`border p-5 text-start transition-all ${filter === key ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"}`}
            >
              <p className={`text-3xl font-black ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">{label}</p>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t("عرض:", "Show:")}</span>
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm font-bold px-4 py-1.5 border transition-all ${filter === f ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/30"}`}
            >
              {f === "pending" ? t("في الانتظار", "Pending") : f === "approved" ? t("موافق عليها", "Approved") : t("الكل", "All")}
            </button>
          ))}
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-secondary/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border">
            <MessageSquare className="h-16 w-16 text-foreground/20 mb-6" />
            <h3 className="text-xl font-serif font-bold mb-2">
              {filter === "pending" ? t("لا توجد تقييمات في الانتظار", "No pending reviews") : t("لا توجد تقييمات", "No reviews found")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {filter === "pending"
                ? t("رائع! كل التقييمات تمت مراجعتها.", "Great! All reviews have been reviewed.")
                : t("لم يصل أي تقييم بعد.", "No reviews have been submitted yet.")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => {
              const productName = language === "ar" ? review.productNameAr : review.productNameEn;
              return (
                <Card key={review.id} className={`rounded-none shadow-none transition-colors ${review.approved ? "border-green-200 dark:border-green-900" : "border-amber-200 dark:border-amber-900"}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Product + status */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide bg-secondary px-2 py-1">
                            {productName}
                          </span>
                          <Badge
                            className={`text-xs font-bold rounded-none ${review.approved ? "bg-green-600 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-500"}`}
                          >
                            {review.approved
                              ? <><CheckCircle className="h-3 w-3 mr-1" />{t("موافق عليه", "Approved")}</>
                              : <><XCircle className="h-3 w-3 mr-1" />{t("في الانتظار", "Pending")}</>
                            }
                          </Badge>
                        </div>

                        {/* Name + rating + date */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-bold text-foreground">{review.customerName}</span>
                          <StarDisplay rating={review.rating} />
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB")}
                          </span>
                        </div>

                        {/* Comment */}
                        {review.comment && (
                          <p className="text-sm text-foreground/75 leading-relaxed">"{review.comment}"</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0 self-start">
                        {!review.approved ? (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            className="rounded-none h-9 px-4 bg-green-600 hover:bg-green-700 text-white font-bold gap-1.5"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            {t("قبول", "Approve")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(review.id)}
                            className="rounded-none h-9 px-4 font-bold gap-1.5 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-950/30"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            {t("إلغاء القبول", "Unapprove")}
                          </Button>
                        )}

                        {deleteConfirm === review.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(review.id)}
                              className="rounded-none h-9 px-3 text-xs font-bold"
                            >
                              {t("تأكيد الحذف", "Delete")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-none h-9 px-3 text-xs font-bold"
                            >
                              {t("لا", "No")}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(review.id)}
                            className="rounded-none h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
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
