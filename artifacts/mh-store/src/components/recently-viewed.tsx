import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useListProducts } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "./product-card";

interface RecentlyViewedProps {
  currentProductId?: number;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { t } = useI18n();
  const { productIds } = useRecentlyViewed();
  const { data: allProducts } = useListProducts();

  const ids = productIds.filter((id) => id !== currentProductId).slice(0, 4);
  const products = ids
    .map((id) => allProducts?.find((p) => p.id === id))
    .filter(Boolean) as NonNullable<typeof allProducts>[number][];

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-24 border-t border-border pt-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">{t("تصفحت مؤخراً", "Recently Viewed")}</p>
          <h2 className="text-3xl font-serif font-black">{t("شاهدتها مؤخراً", "Your Recent Picks")}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
