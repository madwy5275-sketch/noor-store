import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useListProducts, useListCategories, Product } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { QuickViewModal } from "@/components/quick-view-modal";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];

export default function Products() {
  // Quick view state — declared before other state to keep hooks order stable
  const { t, language } = useI18n();
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: rawProducts, isLoading } = useListProducts({
    category: selectedCategory || undefined,
    search: searchParam || undefined,
  });
  const { data: categories } = useListCategories();

  useEffect(() => {
    setSearchTerm(searchParam || "");
    setSelectedCategory(categoryParam);
  }, [searchParam, categoryParam]);

  const products = useMemo(() => {
    let list = rawProducts ?? [];

    if (inStockOnly) list = list.filter((p) => p.stock > 0);

    if (minPrice) list = list.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) list = list.filter((p) => p.price <= parseFloat(maxPrice));

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.sizes?.some((s) => selectedSizes.includes(s))
      );
    }

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        break;
      case "featured":
        list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    return list;
  }, [rawProducts, inStockOnly, minPrice, maxPrice, selectedSizes, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchString);
    if (searchTerm) p.set("search", searchTerm);
    else p.delete("search");
    setLocation(`/products?${p.toString()}`);
  };

  const handleCategorySelect = (id: string | null) => {
    const p = new URLSearchParams(searchString);
    if (id) p.set("category", id);
    else p.delete("category");
    setLocation(`/products?${p.toString()}`);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAll = () => {
    setSearchTerm("");
    setSelectedSizes([]);
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("newest");
    setLocation("/products");
  };

  const hasFilters =
    searchParam || categoryParam || selectedSizes.length > 0 || minPrice || maxPrice || inStockOnly;

  const sortOptions = [
    { value: "newest", labelAr: "الأحدث", labelEn: "Newest" },
    { value: "featured", labelAr: "المميزة", labelEn: "Featured" },
    { value: "price-asc", labelAr: "السعر: من الأقل", labelEn: "Price: Low to High" },
    { value: "price-desc", labelAr: "السعر: من الأعلى", labelEn: "Price: High to Low" },
  ];

  const Sidebar = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-border">
          {t("بحث", "SEARCH")}
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder={t("ابحث هنا...", "Search products...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pl-4 rtl:pr-10 h-11 rounded-none border-border"
          />
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <button type="submit" className="hidden" />
        </form>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-border">
          {t("التوفر", "AVAILABILITY")}
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
            {t(`متاح فقط (${rawProducts?.filter((p) => p.stock > 0).length ?? 0})`, `In Stock (${rawProducts?.filter((p) => p.stock > 0).length ?? 0})`)}
          </span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-border">
          {t("الفئات", "CATEGORIES")}
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`text-left rtl:text-right py-2 text-sm transition-colors ${
              selectedCategory === null ? "text-primary font-bold" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {t(`كل الفئات (${rawProducts?.length ?? 0})`, `All (${rawProducts?.length ?? 0})`)}
          </button>
          {categories?.map((cat) => {
            const count = rawProducts?.filter((p) => p.categoryId === cat.id).length ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id.toString())}
                className={`text-left rtl:text-right py-2 text-sm transition-colors ${
                  selectedCategory === cat.id.toString()
                    ? "text-primary font-bold"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {language === "ar" ? cat.nameAr : cat.nameEn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-border">
          {t("السعر", "PRICE")}
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t("من", "Min")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9 rounded-none text-sm border-border"
          />
          <span className="text-muted-foreground text-sm">{t("إلى", "to")}</span>
          <Input
            type="number"
            placeholder={t("إلى", "Max")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 rounded-none text-sm border-border"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{t("بالجنيه المصري", "EGP")}</p>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-border">
          {t("المقاس", "SIZE")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`min-w-[3rem] h-9 px-3 text-sm font-medium border transition-all ${
                selectedSizes.includes(size)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full h-10 border border-border text-sm font-bold text-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
        >
          <X className="h-4 w-4" />
          {t("مسح الفلاتر", "Clear All Filters")}
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-[#f7f5f2] py-10 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="hover:text-foreground cursor-pointer" onClick={() => setLocation("/")}>{t("الرئيسية", "Home")}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{t("المنتجات", "Products")}</span>
          </div>
          <h1 className="text-4xl font-serif font-black">{t("التشكيلة الكاملة", "All Products")}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 h-10 px-4 border border-border text-sm font-medium hover:bg-secondary"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("فلتر", "Filter")}
                </button>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "..." : `${products.length} ${t("منتج", "Products")}`}
                </span>
              </div>

              {/* Sort */}
              <div className="relative">
                <div className="flex items-center gap-2 text-sm">
                  <span className="hidden sm:inline text-muted-foreground">{t("ترتيب:", "Sort By:")}</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none h-10 pl-3 pr-8 rtl:pl-8 rtl:pr-3 border border-border bg-background text-sm cursor-pointer focus:outline-none focus:border-foreground"
                    >
                      {sortOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {language === "ar" ? o.labelAr : o.labelEn}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile filters panel */}
            {showFilters && (
              <div className="lg:hidden mb-8 p-6 border border-border bg-background">
                <Sidebar />
              </div>
            )}

            {/* Active filter pills */}
            {(selectedSizes.length > 0 || minPrice || maxPrice || inStockOnly) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {inStockOnly && (
                  <span className="flex items-center gap-1.5 h-7 px-3 bg-foreground text-background text-xs font-medium">
                    {t("متاح فقط", "In Stock")}
                    <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedSizes.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 h-7 px-3 bg-foreground text-background text-xs font-medium">
                    {s}
                    <button onClick={() => toggleSize(s)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {(minPrice || maxPrice) && (
                  <span className="flex items-center gap-1.5 h-7 px-3 bg-foreground text-background text-xs font-medium">
                    {minPrice || "0"} - {maxPrice || "∞"} {t("ج.م", "EGP")}
                    <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-secondary/50 border border-border/50">
                <h3 className="text-2xl font-serif font-bold mb-4">{t("لا توجد منتجات", "No Products Found")}</h3>
                <p className="text-muted-foreground mb-8 font-light">
                  {t("جرّب تغيير الفلاتر", "Try adjusting your filters")}
                </p>
                <button
                  onClick={clearAll}
                  className="h-12 px-10 bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  {t("عرض كل المنتجات", "View All Products")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Layout>
  );
}
