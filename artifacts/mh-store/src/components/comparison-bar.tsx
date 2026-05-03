import { useComparison } from "@/hooks/use-comparison";
import { useListProducts } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n";
import { X, BarChart2 } from "lucide-react";
import { Link } from "wouter";

export function ComparisonBar() {
  const { productIds, remove, clear } = useComparison();
  const { data: allProducts } = useListProducts();
  const { t, language } = useI18n();

  if (productIds.length === 0) return null;

  const selected = productIds
    .map((id) => allProducts?.find((p) => p.id === id))
    .filter(Boolean) as NonNullable<typeof allProducts>[number][];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] bg-foreground text-background shadow-2xl border-t-2 border-primary animate-in slide-in-from-bottom-2 duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {/* Count badge */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <BarChart2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold whitespace-nowrap">
            {t(`${productIds.length} منتجات`, `${productIds.length} products`)}
          </span>
        </div>

        {/* Product thumbnails */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto py-1">
          {selected.map((p) => (
            <div key={p.id} className="relative shrink-0 group">
              <img
                src={p.imageUrl}
                alt=""
                className="w-12 h-14 object-cover border-2 border-background/20"
              />
              <button
                onClick={() => remove(p.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="text-[10px] text-background/60 text-center mt-0.5 w-12 truncate">
                {language === "ar" ? p.nameAr : p.nameEn}
              </p>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - selected.length }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-14 border-2 border-dashed border-background/20 shrink-0 flex items-center justify-center"
            >
              <span className="text-background/30 text-xl">+</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="h-9 px-4 border border-background/30 text-background/70 text-xs font-bold uppercase tracking-wide hover:border-background hover:text-background transition-colors hidden sm:flex items-center"
          >
            {t("مسح", "Clear")}
          </button>
          <Link href="/compare">
            <button
              disabled={productIds.length < 2}
              className="h-9 px-5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <BarChart2 className="h-4 w-4" />
              {t("قارن الآن", "Compare Now")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
