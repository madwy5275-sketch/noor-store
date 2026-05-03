import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useComparison } from "@/hooks/use-comparison";
import { useListProducts } from "@workspace/api-client-react";
import { StarRating } from "@/components/star-rating";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart2, X, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ReviewSummary { averageRating: number; count: number; }

export default function Compare() {
  const { t, language } = useI18n();
  const { productIds, remove, clear } = useComparison();
  const { data: allProducts } = useListProducts();
  const { addItem } = useCart();
  const [reviews, setReviews] = useState<Record<number, ReviewSummary>>({});

  const products = productIds
    .map((id) => allProducts?.find((p) => p.id === id))
    .filter(Boolean) as NonNullable<typeof allProducts>[number][];

  useEffect(() => {
    productIds.forEach(async (id) => {
      try {
        const res = await fetch(`/api/reviews?productId=${id}`);
        const data = await res.json();
        setReviews((prev) => ({ ...prev, [id]: { averageRating: data.averageRating, count: data.count } }));
      } catch {}
    });
  }, [productIds.join(",")]);

  if (products.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-secondary flex items-center justify-center mb-8">
            <BarChart2 className="h-14 w-14 text-foreground/20" />
          </div>
          <h1 className="text-4xl font-serif font-black mb-4">{t("لا يوجد منتجات للمقارنة", "No products to compare")}</h1>
          <p className="text-foreground/60 mb-10 max-w-md text-lg font-light">
            {t("اختر حتى 3 منتجات من صفحة المنتجات باستخدام أيقونة المقارنة", "Select up to 3 products from the product listing using the compare icon")}
          </p>
          <Link href="/products">
            <Button size="lg" className="h-14 px-12 rounded-none font-serif font-bold text-lg">
              {t("تصفح المنتجات", "Browse Products")}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const rows: { labelAr: string; labelEn: string; render: (p: typeof products[0]) => React.ReactNode }[] = [
    {
      labelAr: "الصورة",
      labelEn: "Image",
      render: (p) => (
        <Link href={`/products/${p.id}`}>
          <div className="relative">
            <img src={p.imageUrl} alt="" className="w-full aspect-[3/4] object-cover hover:opacity-90 transition-opacity" />
            <button
              onClick={(e) => { e.preventDefault(); remove(p.id); }}
              className="absolute top-2 right-2 w-7 h-7 bg-background/80 hover:bg-destructive hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Link>
      ),
    },
    {
      labelAr: "الاسم",
      labelEn: "Name",
      render: (p) => (
        <Link href={`/products/${p.id}`} className="font-serif font-black text-lg leading-tight hover:text-primary transition-colors">
          {language === "ar" ? p.nameAr : p.nameEn}
        </Link>
      ),
    },
    {
      labelAr: "الفئة",
      labelEn: "Category",
      render: (p) => (
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {language === "ar" ? p.categoryNameAr : p.categoryNameEn}
        </span>
      ),
    },
    {
      labelAr: "السعر",
      labelEn: "Price",
      render: (p) => {
        const isDisc = p.originalPrice && p.originalPrice > p.price;
        return (
          <div className="space-y-1">
            <span className="text-2xl font-black text-foreground">{p.price} <span className="text-base font-normal text-foreground/60">{t("ج.م", "EGP")}</span></span>
            {isDisc && (
              <div>
                <span className="text-sm text-muted-foreground line-through">{p.originalPrice} {t("ج.م", "EGP")}</span>
                <span className="ms-2 bg-[#e63b2e] text-white text-xs font-bold px-2 py-0.5">
                  -{Math.round((1 - p.price / p.originalPrice!) * 100)}%
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      labelAr: "التقييم",
      labelEn: "Rating",
      render: (p) => {
        const r = reviews[p.id];
        return r && r.count > 0 ? (
          <div className="flex flex-col items-center gap-1">
            <StarRating rating={r.averageRating} size="md" />
            <span className="text-sm text-muted-foreground">{r.averageRating.toFixed(1)} ({r.count} {t("تقييم", "reviews")})</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">{t("لا تقييمات", "No reviews yet")}</span>
        );
      },
    },
    {
      labelAr: "المقاسات",
      labelEn: "Available Sizes",
      render: (p) =>
        p.sizes && p.sizes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {p.sizes.map((s) => (
              <span key={s} className="border border-border px-2.5 py-1 text-xs font-bold">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      labelAr: "الألوان",
      labelEn: "Available Colors",
      render: (p) =>
        p.colors && p.colors.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {p.colors.map((c) => (
              <span key={c} className="border border-border px-2.5 py-1 text-xs font-medium">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      labelAr: "التوفر",
      labelEn: "Availability",
      render: (p) =>
        p.stock > 0 ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="font-bold text-sm">{t("متاح", "In Stock")}</span>
            {p.stock <= 5 && (
              <span className="text-amber-600 text-xs font-bold">({t(`آخر ${p.stock}`, `Only ${p.stock} left`)})</span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-destructive">
            <X className="h-5 w-5" />
            <span className="font-bold text-sm">{t("نفذ", "Out of Stock")}</span>
          </div>
        ),
    },
    {
      labelAr: "أضف للسلة",
      labelEn: "Add to Cart",
      render: (p) => (
        <button
          disabled={p.stock <= 0}
          onClick={() => {
            addItem({ productId: p.id, nameAr: p.nameAr, nameEn: p.nameEn, price: p.price, quantity: 1, imageUrl: p.imageUrl });
            toast.success(t("تمت الإضافة للسلة", "Added to cart"));
          }}
          className="w-full h-11 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-4 w-4" />
          {p.stock > 0 ? t("أضف للسلة", "Add to Bag") : t("نفذ", "Sold Out")}
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <BarChart2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-serif font-black">{t("مقارنة المنتجات", "Compare Products")}</h1>
            <span className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1">{products.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={clear} className="text-sm font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
              <X className="h-4 w-4" />
              {t("مسح الكل", "Clear All")}
            </button>
            <Link href="/products">
              <Button variant="outline" className="rounded-none border-foreground font-bold text-sm uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors">
                {t("إضافة منتجات", "Add More")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <colgroup>
              <col className="w-36" />
              {products.map((p) => <col key={p.id} />)}
            </colgroup>
            <tbody>
              {rows.map((row) => (
                <tr key={row.labelEn} className="border-b border-border">
                  <td className="py-5 pr-6 rtl:pr-0 rtl:pl-6 align-middle">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {language === "ar" ? row.labelAr : row.labelEn}
                    </span>
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="py-5 px-4 align-middle text-center border-s border-border/50">
                      {row.render(p)}
                    </td>
                  ))}
                  {/* Empty placeholder columns */}
                  {Array.from({ length: 3 - products.length }).map((_, i) => (
                    <td key={i} className="py-5 px-4 align-middle border-s border-dashed border-border/30">
                      <Link href="/products" className="text-muted-foreground/40 text-xs hover:text-primary transition-colors flex items-center justify-center gap-1">
                        + {t("أضف منتجاً", "Add product")}
                      </Link>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
