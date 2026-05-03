import { Layout } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useI18n();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-8xl md:text-9xl font-serif font-black text-primary mb-6">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t("الصفحة غير موجودة", "Page Not Found")}
        </h2>
        <p className="text-lg text-foreground/70 mb-10 max-w-md font-light">
          {t("يبدو أن هذه الصفحة لا توجد. هل تريد العودة للمتجر؟", "It seems this page does not exist. Would you like to return to the store?")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="h-14 px-8 rounded-none font-serif font-bold text-lg bg-foreground text-background hover:bg-primary transition-colors">
              {t("الرئيسية", "Home")}
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-none font-serif font-bold text-lg border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors">
              {t("تصفح المنتجات", "Browse Products")}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
