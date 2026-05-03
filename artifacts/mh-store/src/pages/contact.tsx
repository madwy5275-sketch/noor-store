import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { MapPin, Phone, MessageCircle, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const { t, language } = useI18n();
  const { settings } = useSiteSettings();
  const { contact, brand } = settings;
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `*رسالة جديدة من موقع ${brand.storeName}*\n\n` +
      `الاسم: ${form.name}\n` +
      `الهاتف: ${form.phone}\n` +
      `الموضوع: ${form.subject}\n` +
      `الرسالة:\n${form.message}`
    );
    if (contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp}?text=${msg}`, "_blank");
    }
    setSubmitted(true);
    toast.success(t("شكراً! سنرد عليك قريباً.", "Thank you! We'll get back to you shortly."));
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-foreground text-background py-20 md:py-28 text-center">
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">{t("تحدثي إلينا", "TALK TO US")}</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-4">{t("تواصلي معنا", "Contact Us")}</h1>
        <p className="text-background/60 font-light text-lg max-w-xl mx-auto">
          {t("نحن هنا لمساعدتك. لا تترددي في التواصل معنا في أي وقت.", "We're here to help. Don't hesitate to reach out at any time.")}
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-serif font-bold">{t("معلومات التواصل", "Contact Information")}</h2>

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 hover:border-green-400 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/></svg>
                </div>
                <div>
                  <p className="font-bold text-green-800 dark:text-green-400 group-hover:underline">WhatsApp</p>
                  <p dir="ltr" className="text-green-700 dark:text-green-500 font-mono text-lg font-bold">{contact.whatsapp}</p>
                  <p className="text-xs text-green-600/70 dark:text-green-600 mt-1">{t("الأسرع في الرد", "Fastest response")}</p>
                </div>
              </a>
            )}

            {contact.phone1 && (
              <a
                href={`tel:${contact.phone1}`}
                className="flex items-start gap-4 p-5 bg-card border border-border hover:border-primary transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold group-hover:text-primary transition-colors">{t("رقم الهاتف الأول", "Phone 1")}</p>
                  <p dir="ltr" className="font-mono text-lg font-bold">{contact.phone1}</p>
                </div>
              </a>
            )}

            {contact.phone2 && (
              <a
                href={`tel:${contact.phone2}`}
                className="flex items-start gap-4 p-5 bg-card border border-border hover:border-primary transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold group-hover:text-primary transition-colors">{t("رقم الهاتف الثاني", "Phone 2")}</p>
                  <p dir="ltr" className="font-mono text-lg font-bold">{contact.phone2}</p>
                </div>
              </a>
            )}

            <div className="flex items-start gap-4 p-5 bg-card border border-border">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold">{t("ساعات العمل", "Working Hours")}</p>
                <p className="text-sm text-foreground/60 mt-1">{t("السبت – الخميس", "Saturday – Thursday")}</p>
                <p className="text-sm font-bold">10:00 AM – 10:00 PM</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-5 bg-card border border-border">
              <p className="font-bold mb-4">{t("تابعينا على", "Follow us on")}</p>
              <div className="flex items-center gap-3">
                {contact.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  </a>
                )}
                {contact.tiktok && (
                  <a href={contact.tiktok} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border p-8 md:p-10">
              <h2 className="text-2xl font-serif font-bold mb-2">{t("أرسلي لنا رسالة", "Send Us a Message")}</h2>
              <p className="text-foreground/60 text-sm mb-8">
                {t("سيتم إرسال رسالتك مباشرة عبر واتساب لضمان سرعة الرد.", "Your message will be sent directly via WhatsApp to ensure a quick response.")}
              </p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-6">🎉</div>
                  <h3 className="text-2xl font-serif font-bold mb-4">{t("شكراً لتواصلك معنا!", "Thank you for reaching out!")}</h3>
                  <p className="text-foreground/60">
                    {t("تم فتح محادثة واتساب. سنرد عليك في أقرب وقت ممكن.", "A WhatsApp conversation has been opened. We'll reply as soon as possible.")}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-sm text-primary underline underline-offset-4"
                  >
                    {t("إرسال رسالة أخرى", "Send another message")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest font-bold text-foreground/70">{t("الاسم الكامل *", "Full Name *")}</Label>
                      <Input
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="h-12 rounded-none"
                        placeholder={t("اسمك الكريم", "Your name")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest font-bold text-foreground/70">{t("رقم الهاتف *", "Phone Number *")}</Label>
                      <Input
                        required
                        type="tel"
                        dir="ltr"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="h-12 rounded-none text-left"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold text-foreground/70">{t("موضوع الرسالة *", "Subject *")}</Label>
                    <Input
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="h-12 rounded-none"
                      placeholder={t("مثال: استفسار عن طلب", "Example: Inquiry about an order")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold text-foreground/70">{t("الرسالة *", "Message *")}</Label>
                    <Textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="rounded-none resize-none"
                      placeholder={t("اكتبي رسالتك هنا...", "Write your message here...")}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-base font-bold rounded-none gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {t("إرسال عبر واتساب", "Send via WhatsApp")}
                  </Button>
                  <p className="text-xs text-center text-foreground/40">
                    {t("بالضغط على إرسال، ستنتقلي تلقائياً إلى محادثة واتساب معنا.", "By clicking send, you'll automatically be redirected to a WhatsApp conversation with us.")}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
