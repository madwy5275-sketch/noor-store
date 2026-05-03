import { useState } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function SellerLogin() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const response = res.ok ? await res.json() : null;

      if (response?.success) {
        localStorage.setItem("mh_admin_logged_in", "true");
        toast.success(t("تم تسجيل الدخول بنجاح", "Logged in successfully"));
        setLocation("/seller");
      } else {
        toast.error(t("بيانات الدخول غير صحيحة", "Invalid credentials"));
      }
    } catch (error) {
      toast.error(t("بيانات الدخول غير صحيحة", "Invalid credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 md:p-12 shadow-xl shadow-primary/5">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Noor Seller</h1>
          <p className="text-muted-foreground">{t("تسجيل الدخول للوحة تحكم البائع", "Login to Seller Dashboard")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{t("اسم المستخدم", "Username")}</Label>
            <div className="relative">
              <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-background rounded-none border-primary/20 focus-visible:ring-primary"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("كلمة المرور", "Password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-background rounded-none border-primary/20 focus-visible:ring-primary"
                dir="ltr"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold rounded-none mt-2"
            disabled={isLoading}
          >
            {isLoading ? t("جاري تسجيل الدخول...", "Logging in...") : t("تسجيل الدخول", "Login")}
          </Button>
        </form>
      </div>
    </div>
  );
}
