import { useI18n } from "@/lib/i18n";
import { Truck } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 500;

interface FreeShippingBarProps {
  total: number;
}

export function FreeShippingBar({ total }: FreeShippingBarProps) {
  const { t } = useI18n();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const isFree = total >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className={`p-4 border mb-6 ${isFree ? "bg-green-50 border-green-200" : "bg-secondary/50 border-border"}`}>
      <div className="flex items-center gap-2 mb-2">
        <Truck className={`h-4 w-4 ${isFree ? "text-green-600" : "text-primary"}`} />
        <p className={`text-sm font-bold ${isFree ? "text-green-700" : "text-foreground"}`}>
          {isFree
            ? t("🎉 مبروك! حصلت على شحن مجاني", "🎉 Congrats! You've unlocked free shipping")
            : t(`أضف ${remaining} ج.م أخرى للشحن المجاني`, `Add ${remaining} EGP more for free shipping`)}
        </p>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isFree ? "bg-green-500" : "bg-primary"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
