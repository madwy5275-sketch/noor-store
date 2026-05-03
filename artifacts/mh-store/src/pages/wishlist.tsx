import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/hooks/use-wishlist";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useState } from "react";
import { Product } from "@workspace/api-client-react";

export default function Wishlist() {
  const { t } = useI18n();
  const { items } = useWishlist();
  const { data: allProducts } = useListProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const wishlistProducts = allProducts?.filter((p) => items.includes(p.id)) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 min-h-[60vh]">
        <div className="flex items-center gap-4 mb-12">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="text-4xl md:text-5xl font-serif font-black">{t("المفضلة", "Wishlist")}</h1>
          {items.length > 0 && (
            <span className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1">{items.length}</span>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-32 h-32 bg-secondary flex items-center justify-center mb-8">
              <Heart className="h-14 w-14 text-foreground/20" />
            </div>
            <h2 className="text-3xl font-serif font-black mb-4">{t("قائمة المفضلة فارغة", "Your wishlist is empty")}</h2>
            <p className="text-foreground/60 mb-10 max-w-md font-light text-lg">
              {t(
                "أضف المنتجات التي تعجبك إلى المفضلة بالنقر على أيقونة القلب",
                "Add products you love to your wishlist by clicking the heart icon"
              )}
            </p>
            <Link href="/products">
              <Button size="lg" className="h-14 px-12 font-serif font-bold rounded-none text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                {t("تصفح المنتجات", "Browse Products")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link href="/products">
                <Button variant="outline" size="lg" className="h-14 px-12 font-bold rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors">
                  {t("اكتشف المزيد", "Discover More")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Layout>
  );
}
