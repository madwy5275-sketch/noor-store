import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Product } from "@workspace/api-client-react";
import { StarRating } from "./star-rating";
import { useWishlist } from "@/hooks/use-wishlist";
import { useComparison } from "@/hooks/use-comparison";
import { useCart } from "@/hooks/use-cart";
import { Heart, Eye, BarChart2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  avgRating?: number;
  reviewCount?: number;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, avgRating, reviewCount, onQuickView }: ProductCardProps) {
  const { t, language } = useI18n();
  const { toggle, isWishlisted } = useWishlist();
  const { toggle: toggleCompare, isSelected: isCompared, isFull } = useComparison();
  const { addItem } = useCart();

  const name = language === "ar" ? product.nameAr : product.nameEn;
  const categoryName = language === "ar" ? product.categoryNameAr : product.categoryNameEn;

  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const discountPct = isDiscounted
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  const wishlisted = isWishlisted(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;
  const needsOptions = !!(product.sizes?.length || product.colors?.length);
  const isNewArrival = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast.success(
      wishlisted
        ? t("تمت الإزالة من المفضلة", "Removed from wishlist")
        : t("تمت الإضافة إلى المفضلة", "Added to wishlist")
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const compared = isCompared(product.id);
    if (!compared && isFull()) {
      toast.error(t("لا يمكن مقارنة أكثر من 3 منتجات", "You can compare up to 3 products"));
      return;
    }
    toggleCompare(product.id);
    toast.success(
      compared
        ? t("تمت الإزالة من المقارنة", "Removed from comparison")
        : t("تمت الإضافة للمقارنة", "Added to comparison")
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (needsOptions) {
      onQuickView?.(product);
      return;
    }
    addItem({
      productId: product.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.success(t("تمت الإضافة إلى السلة 🛍️", "Added to bag 🛍️"));
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-[#f5f5f5]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Hover action buttons — side icons */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 flex items-center justify-center shadow-md transition-all duration-200 ${
                wishlisted
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
              title={t("أضف للمفضلة", "Add to wishlist")}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="w-9 h-9 bg-background text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center shadow-md transition-all duration-200"
                title={t("معاينة سريعة", "Quick view")}
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleCompare}
              className={`w-9 h-9 flex items-center justify-center shadow-md transition-all duration-200 ${
                isCompared(product.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
              title={t("قارن", "Compare")}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Add to Cart overlay */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-[0.15em] uppercase w-full ${
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-foreground/90 text-background hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isOutOfStock
              ? t("نفذت الكمية", "SOLD OUT")
              : needsOptions
              ? t("اختر وأضف للسلة", "SELECT & ADD")
              : t("أضف للسلة", "ADD TO BAG")}
          </button>
        </div>

        {/* Badges — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {isNewArrival && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 block tracking-wider">
              {t("وصل حديثاً", "NEW IN")}
            </span>
          )}
          {isDiscounted && (
            <span className="bg-[#e63b2e] text-white text-xs font-bold px-2.5 py-1 block">
              {t(`خصم ${discountPct}%`, `Sale ${discountPct}%`)}
            </span>
          )}
          {product.featured && !isDiscounted && !isNewArrival && (
            <span className="bg-foreground text-background text-xs font-bold px-2.5 py-1 block">
              {t("مميز", "FEATURED")}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 block">
              {t("نفذ", "SOLD OUT")}
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 block animate-pulse">
              {t(`آخر ${product.stock} قطع`, `Only ${product.stock} left`)}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 px-0.5">
        {categoryName && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{categoryName}</p>
        )}
        <h3 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>

        {avgRating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={avgRating} size="sm" />
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">
            {product.price} {t("ج.م", "EGP")}
          </span>
          {isDiscounted && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice} {t("ج.م", "EGP")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
