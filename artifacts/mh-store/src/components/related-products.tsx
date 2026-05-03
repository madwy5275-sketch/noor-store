import { useI18n } from "@/lib/i18n";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { t } = useI18n();
  
  const { data: products, isLoading } = useListProducts({ category: categoryId ? categoryId.toString() : undefined });

  if (isLoading) {
    return (
      <div className="py-16">
        <h2 className="text-3xl font-serif font-black mb-8">{t("قطع مشابهة", "You May Also Like")}</h2>
        <div className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-4 md:overflow-visible">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[260px] md:min-w-0 aspect-[3/4] bg-secondary animate-pulse rounded-none"></div>
          ))}
        </div>
      </div>
    );
  }

  const related = products?.filter((p) => p.id !== currentProductId).slice(0, 4) || [];

  if (related.length < 1) {
    return null;
  }

  return (
    <div className="py-16 border-t border-border mt-16">
      <h2 className="text-3xl font-serif font-black mb-8 text-foreground">{t("قطع مشابهة", "You May Also Like")}</h2>
      <div className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-4 md:overflow-visible hide-scrollbar snap-x">
        {related.map((product) => (
          <div key={product.id} className="min-w-[260px] md:min-w-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
