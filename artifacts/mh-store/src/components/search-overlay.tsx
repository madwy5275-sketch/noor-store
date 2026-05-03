import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { useListProducts } from "@workspace/api-client-react";
import { Search, X, ArrowLeft, ArrowRight } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { t, language } = useI18n();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products } = useListProducts();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const results = useCallback(() => {
    if (!query.trim() || !products) return [];
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => {
        const nameAr = (p.nameAr ?? "").toLowerCase();
        const nameEn = (p.nameEn ?? "").toLowerCase();
        return nameAr.includes(q) || nameEn.includes(q);
      })
      .slice(0, 8);
  }, [query, products])();

  const handleSelect = (id: number) => {
    navigate(`/products/${id}`);
    onClose();
  };

  if (!isOpen) return null;

  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Search panel */}
      <div className="relative bg-background border-b border-border shadow-2xl">
        <div className="container mx-auto px-4">
          {/* Input row */}
          <div className="flex items-center h-20 gap-4">
            <button
              onClick={onClose}
              className="text-foreground/50 hover:text-foreground transition-colors flex-shrink-0"
            >
              <BackIcon className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-0 rtl:right-0 rtl:left-auto top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("ابحثي عن منتج بالعربي أو الإنجليزي...", "Search products in Arabic or English...")}
                className="w-full pl-7 rtl:pr-7 rtl:pl-0 text-lg bg-transparent border-0 outline-none focus:outline-none text-foreground placeholder:text-foreground/30"
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-foreground/40 hover:text-foreground transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="pb-4">
              {results.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  {t(`لا توجد نتائج لـ "${query}"`, `No results for "${query}"`)}
                </p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">
                    {t(`${results.length} نتيجة`, `${results.length} result${results.length !== 1 ? "s" : ""}`)}
                  </p>
                  <div className="grid gap-1">
                    {results.map((product) => {
                      const name = language === "ar" ? product.nameAr : product.nameEn;
                      const otherName = language === "ar" ? product.nameEn : product.nameAr;
                      const image = Array.isArray(product.images) && product.images.length > 0
                        ? (product.images[0] as string)
                        : null;
                      const price = product.price;

                      return (
                        <button
                          key={product.id}
                          onClick={() => handleSelect(product.id)}
                          className="flex items-center gap-4 p-3 rounded-none hover:bg-secondary/60 transition-colors text-start group"
                        >
                          {/* Thumbnail */}
                          <div className="w-14 h-14 bg-secondary flex-shrink-0 overflow-hidden">
                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-foreground/20">
                                <Search className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{name}</p>
                            {otherName && otherName !== name && (
                              <p className="text-xs text-muted-foreground truncate">{otherName}</p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex-shrink-0 text-end">
                            <p className="font-black text-foreground text-sm">
                              {Number(price).toLocaleString()} {t("ج", "EGP")}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* View all results link */}
                  <button
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                    className="w-full mt-3 py-3 text-sm font-bold text-primary hover:underline text-center border-t border-border"
                  >
                    {t(`عرض كل نتائج "${query}"`, `View all results for "${query}"`)} →
                  </button>
                </>
              )}
            </div>
          )}

          {/* Trending / empty state */}
          {!query.trim() && (
            <div className="pb-6">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">
                {t("اقتراحات", "Suggestions")}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  t("عبايات", "Abayas"),
                  t("فساتين", "Dresses"),
                  t("شنط", "Bags"),
                  t("بلوزات", "Blouses"),
                  t("عروض", "Sale"),
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 text-sm border border-border text-foreground/70 hover:border-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
