import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/hooks/use-cart";
import { X, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface QuickViewProduct {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  descriptionAr?: string;
  descriptionEn?: string;
  categoryNameAr?: string;
  categoryNameEn?: string;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { t, language } = useI18n();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  useEffect(() => {
    if (product) {
      setSelectedSize(undefined);
      setSelectedColor(undefined);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const name = language === "ar" ? product.nameAr : product.nameEn;
  const description = language === "ar" ? product.descriptionAr : product.descriptionEn;
  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const discountPct = isDiscounted ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  const handleAdd = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error(t("اختر المقاس أولاً", "Please select a size"));
      return;
    }
    if (product.colors?.length && !selectedColor) {
      toast.error(t("اختر اللون أولاً", "Please select a color"));
      return;
    }
    addItem({
      productId: product.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
    });
    toast.success(t("تمت الإضافة للسلة", "Added to bag"));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-background shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="w-full sm:w-2/5 aspect-[3/4] bg-[#f5f5f5] relative overflow-hidden shrink-0">
            <img src={product.imageUrl} alt={name} className="w-full h-full object-cover" />
            {isDiscounted && (
              <span className="absolute top-3 right-3 bg-[#e63b2e] text-white text-xs font-bold px-2.5 py-1">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-2">NOOR COLLECTION</p>
              <h2 className="text-2xl font-serif font-black text-foreground mb-3 leading-tight">{name}</h2>

              <div className="flex items-center gap-4 mb-5">
                <span className="text-2xl font-bold">{product.price} <span className="text-base text-foreground/60">{t("ج.م", "EGP")}</span></span>
                {isDiscounted && (
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice} {t("ج.م", "EGP")}</span>
                )}
              </div>

              {description && (
                <p className="text-sm text-foreground/60 leading-relaxed mb-5 line-clamp-3">{description}</p>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2">{t("المقاس", "SIZE")}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[2.8rem] h-10 px-3 text-sm font-bold border transition-all ${
                          selectedSize === s
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2">{t("اللون", "COLOR")}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 h-10 text-sm font-bold border transition-all flex items-center gap-1.5 ${
                          selectedColor === c
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {selectedColor === c && <Check className="h-3.5 w-3.5" />}
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 mt-4">
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="w-full h-12 bg-foreground text-background font-bold text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.stock > 0 ? t("إضافة للسلة", "Add to Bag") : t("نفذت الكمية", "Out of Stock")}
              </button>
              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="w-full h-12 border border-border text-foreground font-bold text-sm uppercase tracking-wider hover:bg-secondary transition-colors flex items-center justify-center"
              >
                {t("عرض التفاصيل الكاملة", "View Full Details")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
