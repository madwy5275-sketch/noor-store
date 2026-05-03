import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { X } from "lucide-react";

const STORAGE_KEY = "mh-newsletter-dismissed";

export function NewsletterPopup() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(dismiss, 3000);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-background overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row">
          {/* Image panel */}
          <div className="hidden sm:block w-2/5 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          </div>

          {/* Content */}
          <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-2xl font-serif font-black mb-2">{t("شكراً لك!", "Thank You!")}</h3>
                <p className="text-foreground/70">{t("تم التسجيل بنجاح. استخدم الكود:", "You're subscribed! Use code:")}</p>
                <div className="mt-4 bg-secondary px-6 py-3 border border-dashed border-primary inline-block">
                  <span className="text-2xl font-black font-mono text-primary tracking-widest">NOOR10</span>
                </div>
                <p className="text-sm text-foreground/50 mt-2">{t("خصم 10% على أول طلب", "10% off your first order")}</p>
              </div>
            ) : (
              <>
                <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">{t("عرض حصري", "EXCLUSIVE OFFER")}</p>
                <h3 className="text-3xl font-serif font-black text-foreground mb-3 leading-tight">
                  {t("احصل على خصم 10%", "Get 10% Off")}
                </h3>
                <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                  {t(
                    "اشترك في نشرتنا البريدية واحصل على كود خصم 10% على أول طلب لك",
                    "Subscribe to our newsletter and get a 10% discount code on your first order"
                  )}
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("بريدك الإلكتروني", "Your email address")}
                    className="w-full h-12 border border-border bg-background px-4 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full h-12 bg-foreground text-background font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    {t("اشترك الآن", "Subscribe Now")}
                  </button>
                </form>
                <p className="text-xs text-foreground/40 mt-3 text-center">
                  {t("لن نرسل لك رسائل مزعجة أبداً", "No spam, ever. Unsubscribe anytime.")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
