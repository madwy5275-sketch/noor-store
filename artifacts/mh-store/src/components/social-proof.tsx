import { useState, useEffect, useCallback, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { X, ShoppingBag } from "lucide-react";

interface RecentPurchase {
  firstName: string;
  city: string;
  productNameAr: string;
  productNameEn: string;
  productImage?: string | null;
  createdAt: string;
}

const MIN_INTERVAL = 10000;
const MAX_INTERVAL = 20000;
const POLL_INTERVAL = 60000;

function timeAgo(isoString: string, language: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (language === "ar") {
    if (mins < 2) return "منذ قليل";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  } else {
    if (mins < 2) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

export function SocialProof() {
  const { language } = useI18n();
  const [purchases, setPurchases] = useState<RecentPurchase[]>([]);
  const [current, setCurrent] = useState<RecentPurchase | null>(null);
  const [visible, setVisible] = useState(false);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await fetch("/api/orders/recent-purchases?limit=20");
      if (res.ok) {
        const data: RecentPurchase[] = await res.json();
        if (data.length > 0) setPurchases(data);
      }
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
    const poll = setInterval(fetchPurchases, POLL_INTERVAL);
    return () => clearInterval(poll);
  }, [fetchPurchases]);

  const showNext = useCallback(() => {
    if (purchases.length === 0) return false;
    if (idxRef.current >= purchases.length) return false;
    const idx = idxRef.current;
    idxRef.current = idx + 1;
    setCurrent(purchases[idx]);
    setVisible(true);
    setTimeout(() => setVisible(false), 5500);
    return idxRef.current < purchases.length;
  }, [purchases]);

  useEffect(() => {
    if (purchases.length === 0) return;

    const schedule = () => {
      const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      timerRef.current = setTimeout(() => {
        const hasMore = showNext();
        if (hasMore) schedule();
      }, delay);
    };

    const first = setTimeout(() => {
      const hasMore = showNext();
      if (hasMore) schedule();
    }, 12000);

    return () => {
      clearTimeout(first);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [purchases, showNext]);

  if (!current) return null;

  const productName = language === "ar" ? current.productNameAr : current.productNameEn;
  const ago = timeAgo(current.createdAt, language);

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 left-4 z-50 max-w-[300px] transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="bg-background border border-border shadow-2xl rounded-sm overflow-hidden flex items-stretch">
        {/* Product image or icon */}
        <div className="w-[72px] flex-shrink-0 bg-secondary/60 overflow-hidden relative">
          {current.productImage ? (
            <img
              src={current.productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-primary/60" />
            </div>
          )}
          {/* Live pulse dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {language === "ar" ? "تم الشراء للتو 🛍️" : "Just Purchased 🛍️"}
            </span>
            <button
              onClick={() => setVisible(false)}
              className="text-foreground/25 hover:text-foreground/60 transition-colors flex-shrink-0 -mt-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm font-bold text-foreground leading-snug line-clamp-2">
            {language === "ar"
              ? `${current.firstName} من ${current.city} اشترت "${productName}"`
              : `${current.firstName} from ${current.city} just bought "${productName}"`}
          </p>
          <p className="text-[11px] text-foreground/45 mt-1">{ago}</p>
        </div>
      </div>
    </div>
  );
}
