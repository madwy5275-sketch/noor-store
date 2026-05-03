import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SiteSettings, DEFAULT_SETTINGS, fetchSetting } from "@/lib/site-settings";

type SiteSettingsContextType = {
  settings: SiteSettings;
  loading: boolean;
  reload: () => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  reload: () => {},
});

const KEYS = ["brand", "contact", "hero", "banners", "occasions", "editorial", "features", "testimonials", "announcement", "sale", "sections", "payment"] as const;

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(KEYS.map((key) => fetchSetting(key).then((val) => [key, val] as const))).then((entries) => {
      if (cancelled) return;
      const merged = { ...DEFAULT_SETTINGS };
      for (const [key, val] of entries) {
        if (val !== null) {
          (merged as Record<string, unknown>)[key] = val;
        }
      }
      setSettings(merged);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [tick]);

  const reload = () => setTick((t) => t + 1);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, reload }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
