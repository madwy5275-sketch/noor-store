import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { ShoppingBag, Truck, ShieldCheck, RefreshCcw, Check, Star, Share2, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RelatedProducts } from "@/components/related-products";
import { SizeGuide } from "@/components/size-guide";
import { StarRating } from "@/components/star-rating";
import { RecentlyViewed } from "@/components/recently-viewed";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

interface ReviewData {
  reviews: Array<{ id: number; customerName: string; rating: number; comment?: string | null; createdAt: string }>;
  averageRating: number;
  count: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);
  const { t, language } = useI18n();
  const { addItem, clearCart } = useCart();
  const [, navigate] = useLocation();

  const { data: product, isLoading } = useGetProduct(productId, {
    query: {
      enabled: !!productId,
      queryKey: getGetProductQueryKey(productId)
    }
  });

  const { addProduct: addRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    if (productId) addRecentlyViewed(productId);
  }, [productId]);

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleWhatsAppShare = () => {
    const productName = language === "ar" ? product?.nameAr : product?.nameEn;
    const price = product?.price;
    const url = window.location.href;
    const msg = language === "ar"
      ? `شوفي المنتج ده على Noor 🛍️\n\n*${productName}*\nالسعر: ${price} ج.م\n\n${url}`
      : `Check out this product on Noor 🛍️\n\n*${productName}*\nPrice: ${price} EGP\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleFacebookShare = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(t("تم نسخ الرابط", "Link copied!"));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(t("تعذّر النسخ", "Could not copy link"));
    }
  };

  // Reviews state
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviewData(data))
      .catch(() => {});
  }, [productId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) { toast.error(t("أدخل اسمك", "Please enter your name")); return; }
    if (reviewRating === 0) { toast.error(t("اختر تقييمك", "Please select a rating")); return; }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, customerName: reviewName.trim(), rating: reviewRating, comment: reviewComment.trim() || undefined }),
      });
      if (res.ok) {
        toast.success(t("شكراً على تقييمك!", "Thank you for your review!"));
        setReviewName("");
        setReviewRating(0);
        setReviewComment("");
        const updated = await fetch(`/api/reviews?productId=${productId}`).then((r) => r.json());
        setReviewData(updated);
      } else {
        toast.error(t("حدث خطأ", "Something went wrong"));
      }
    } catch {
      toast.error(t("حدث خطأ", "Something went wrong"));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2 aspect-[3/4] bg-secondary animate-pulse rounded-none"></div>
          <div className="w-full lg:w-1/2 space-y-8 pt-8">
            <div className="h-12 bg-secondary animate-pulse w-3/4"></div>
            <div className="h-8 bg-secondary animate-pulse w-1/4"></div>
            <div className="h-40 bg-secondary animate-pulse w-full"></div>
            <div className="h-16 bg-secondary animate-pulse w-full mt-10"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-40 text-center">
          <h1 className="text-4xl font-serif font-bold mb-6">{t("المنتج غير موجود", "Product Not Found")}</h1>
        </div>
      </Layout>
    );
  }

  const name = language === "ar" ? product.nameAr : product.nameEn;
  const description = language === "ar" ? product.descriptionAr : product.descriptionEn;
  const allImages = [product.imageUrl, ...(product.images || [])];
  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const discountPct = isDiscounted ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  const validateSelection = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error(t("الرجاء اختيار المقاس", "Please select a size"));
      return false;
    }
    if (product.colors?.length && !selectedColor) {
      toast.error(t("الرجاء اختيار اللون", "Please select a color"));
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addItem({
      productId: product.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor
    });
    toast.success(t("تمت الإضافة إلى السلة", "Added to cart"));
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    clearCart();
    addItem({
      productId: product.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor
    });
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Images Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="aspect-[3/4] overflow-hidden bg-[#f5f5f5] relative">
              <img
                src={allImages[activeImage]}
                alt={name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {isDiscounted && (
                <div className="absolute top-4 right-4">
                  <span className="bg-[#e63b2e] text-white text-sm font-bold px-3 py-1.5 block">
                    {t(`خصم ${discountPct}%`, `Sale ${discountPct}%`)}
                  </span>
                </div>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center">
                  <Badge variant="outline" className="bg-background text-foreground border-foreground font-serif font-black px-8 py-3 text-xl rounded-none tracking-widest uppercase">
                    {t("نفذت الكمية", "Out of Stock")}
                  </Badge>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-[3/4] overflow-hidden transition-all duration-300 ${
                      activeImage === idx
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3">NOOR COLLECTION</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black mb-4 text-foreground leading-tight">{name}</h1>

            {/* Rating summary */}
            {reviewData && reviewData.count > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={reviewData.averageRating} size="md" />
                <span className="text-sm text-muted-foreground">
                  {reviewData.averageRating.toFixed(1)} ({reviewData.count} {t("تقييم", "reviews")})
                </span>
              </div>
            )}

            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-bold text-foreground">
                {product.price} <span className="text-2xl text-foreground/60">{t("ج.م", "EGP")}</span>
              </span>
              {isDiscounted && (
                <span className="text-2xl text-muted-foreground line-through font-light">
                  {product.originalPrice} {t("ج.م", "EGP")}
                </span>
              )}
            </div>

            <div className="w-full h-[1px] bg-border mb-8"></div>

            {description && (
              <p className="text-foreground/75 mb-8 text-base leading-relaxed font-light whitespace-pre-wrap">
                {description}
              </p>
            )}

            <div className="space-y-8 mb-10">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-sm uppercase tracking-widest">{t("المقاس", "SIZE")}</span>
                    <SizeGuide gender="women" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3.5rem] h-12 px-4 border flex items-center justify-center font-bold text-sm transition-all ${
                          selectedSize === size
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground text-foreground bg-background"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="font-bold text-sm uppercase tracking-widest block mb-4">{t("اللون", "COLOR")}</span>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 h-12 border flex items-center justify-center font-bold text-sm transition-all ${
                          selectedColor === color
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground text-foreground bg-background"
                        }`}
                      >
                        {selectedColor === color && <Check className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />}
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="font-bold text-sm uppercase tracking-widest block mb-4">{t("الكمية", "QUANTITY")}</span>
                <div className="flex items-center w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border border-border flex items-center justify-center hover:bg-secondary transition-colors text-lg"
                  >
                    −
                  </button>
                  <div className="flex-1 h-12 border-y border-border flex items-center justify-center font-bold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock <= quantity}
                    className="w-12 h-12 border border-border flex items-center justify-center hover:bg-secondary transition-colors text-lg disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-4">
              {/* Buy Now — primary gold action */}
              <Button
                size="lg"
                className="h-16 text-base font-black uppercase tracking-widest rounded-none w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20"
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
              >
                <svg className="mr-3 h-5 w-5 rtl:ml-3 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {product.stock > 0 ? t("اشتري الآن", "Buy Now") : t("نفذت الكمية", "Out of Stock")}
              </Button>

              {/* Add to Bag — secondary outlined action */}
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-sm font-bold uppercase tracking-wider rounded-none w-full border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                {t("إضافة إلى السلة", "Add to Bag")}
              </Button>
            </div>

            {/* Share row */}
            <div className="flex items-center gap-3 mb-10 -mt-4">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                {t("شارك", "Share")}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  title={t("شارك على واتساب", "Share on WhatsApp")}
                  className="group flex items-center gap-2 h-9 px-4 border border-[#25D366]/40 bg-[#25D366]/5 hover:bg-[#25D366] hover:border-[#25D366] text-[#25D366] hover:text-white transition-all duration-200 text-xs font-bold"
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  WhatsApp
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebookShare}
                  title={t("شارك على فيسبوك", "Share on Facebook")}
                  className="group flex items-center gap-2 h-9 px-4 border border-[#1877F2]/40 bg-[#1877F2]/5 hover:bg-[#1877F2] hover:border-[#1877F2] text-[#1877F2] hover:text-white transition-all duration-200 text-xs font-bold"
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                  Facebook
                </button>

                {/* Copy link */}
                <button
                  onClick={handleCopyLink}
                  title={t("نسخ الرابط", "Copy link")}
                  className="flex items-center gap-2 h-9 px-4 border border-border hover:border-foreground bg-background hover:bg-secondary text-foreground/60 hover:text-foreground transition-all duration-200 text-xs font-bold"
                >
                  {copied
                    ? <><CheckCheck className="h-3.5 w-3.5 text-green-600" />{t("تم النسخ", "Copied!")}</>
                    : <><Copy className="h-3.5 w-3.5" />{t("نسخ الرابط", "Copy link")}</>
                  }
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              {[
                { icon: Truck, titleAr: "توصيل سريع", titleEn: "Fast Delivery", subAr: "لجميع المحافظات", subEn: "Nationwide shipping" },
                { icon: ShieldCheck, titleAr: "دفع آمن", titleEn: "Secure Payment", subAr: "الدفع عند الاستلام", subEn: "Cash on delivery" },
                { icon: RefreshCcw, titleAr: "استرجاع", titleEn: "Returns", subAr: "خلال 14 يوم", subEn: "14-day window" },
              ].map(({ icon: Icon, titleAr, titleEn, subAr, subEn }) => (
                <div key={titleEn} className="flex flex-col items-center text-center gap-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-bold">{language === "ar" ? titleAr : titleEn}</span>
                  <span className="text-xs text-foreground/50">{language === "ar" ? subAr : subEn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Existing reviews */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-serif font-black">{t("آراء العملاء", "Customer Reviews")}</h2>
                {reviewData && reviewData.count > 0 && (
                  <div className="flex items-center gap-2 bg-secondary px-4 py-2">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-bold text-lg">{reviewData.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                )}
              </div>

              {!reviewData || reviewData.count === 0 ? (
                <div className="bg-secondary/50 border border-border p-10 text-center">
                  <Star className="h-10 w-10 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-light">
                    {t("كن أول من يقيّم هذا المنتج", "Be the first to review this product")}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {reviewData.reviews.map((review) => (
                    <div key={review.id} className="border border-border p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-foreground">{review.customerName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB")}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-foreground/75 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review */}
            <div>
              <h2 className="text-3xl font-serif font-black mb-8">{t("اكتب تقييمك", "Write a Review")}</h2>
              <form onSubmit={submitReview} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                    {t("اسمك", "Your Name")} *
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder={t("أدخل اسمك", "Enter your name")}
                    className="w-full h-12 border border-border bg-background px-4 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                    {t("تقييمك", "Your Rating")} *
                  </label>
                  <StarRating rating={reviewRating} size="lg" interactive onChange={setReviewRating} />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                    {t("تعليقك (اختياري)", "Comment (Optional)")}
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t("شارك تجربتك مع هذا المنتج...", "Share your experience with this product...")}
                    rows={4}
                    className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full h-12 rounded-none font-bold text-sm uppercase tracking-wider bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {submittingReview
                    ? t("جاري الإرسال...", "Submitting...")
                    : t("إرسال التقييم", "Submit Review")}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {product.categoryId && (
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        )}

        <RecentlyViewed currentProductId={product.id} />
      </div>
    </Layout>
  );
}
