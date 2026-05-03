import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { SiteSettingsProvider } from "@/contexts/site-settings-context";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import TrackOrder from "@/pages/track-order";
import Wishlist from "@/pages/wishlist";
import Compare from "@/pages/compare";
import Abayas from "@/pages/abayas";

import About from "@/pages/about";
import Shipping from "@/pages/shipping";
import Returns from "@/pages/returns";
import Faq from "@/pages/faq";
import Contact from "@/pages/contact";
import PaymentMethods from "@/pages/payment-methods";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";

import SellerDashboard from "@/pages/seller/dashboard";
import SellerProducts from "@/pages/seller/products";
import SellerOrders from "@/pages/seller/orders";
import SellerLogin from "@/pages/seller/login";
import SellerSettings from "@/pages/seller/settings";
import SellerCoupons from "@/pages/seller/coupons";
import SellerReviews from "@/pages/seller/reviews";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ScrollRestoration() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollRestoration />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/abayas" component={Abayas} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/compare" component={Compare} />

      <Route path="/about" component={About} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/returns" component={Returns} />
      <Route path="/faq" component={Faq} />
      <Route path="/contact" component={Contact} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />

      <Route path="/seller/login" component={SellerLogin} />
      <Route path="/seller" component={SellerDashboard} />
      <Route path="/seller/products" component={SellerProducts} />
      <Route path="/seller/orders" component={SellerOrders} />
      <Route path="/seller/coupons" component={SellerCoupons} />
      <Route path="/seller/reviews" component={SellerReviews} />
      <Route path="/seller/settings" component={SellerSettings} />

      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <SiteSettingsProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <SonnerToaster position="top-center" richColors closeButton />
          </SiteSettingsProvider>
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
