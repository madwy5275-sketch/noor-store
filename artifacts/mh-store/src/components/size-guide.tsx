import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Ruler, X } from "lucide-react";

interface SizeRow {
  size: string;
  chest: [number, number];
  waist: [number, number];
  hips: [number, number];
  height: [number, number];
  eu: string;
  us: string;
}

interface GirlRow {
  size: string;
  age: string;
  chest: number;
  waist: number;
  hips: number;
  height: [number, number];
}

const WOMEN: SizeRow[] = [
  { size: "XS",  chest: [80, 84],  waist: [60, 64],  hips: [86,  90],  height: [155, 160], eu: "34", us: "0–2"  },
  { size: "S",   chest: [84, 88],  waist: [64, 68],  hips: [90,  94],  height: [158, 163], eu: "36", us: "4–6"  },
  { size: "M",   chest: [88, 92],  waist: [68, 72],  hips: [94,  98],  height: [160, 165], eu: "38", us: "8–10" },
  { size: "L",   chest: [92, 96],  waist: [72, 76],  hips: [98,  102], height: [162, 167], eu: "40", us: "12"   },
  { size: "XL",  chest: [96, 100], waist: [76, 80],  hips: [102, 106], height: [163, 168], eu: "42", us: "14–16"},
  { size: "XXL", chest: [100,106], waist: [80, 86],  hips: [106, 112], height: [164, 169], eu: "44", us: "18"   },
  { size: "2XL", chest: [106,112], waist: [86, 92],  hips: [112, 118], height: [165, 170], eu: "46", us: "20"   },
  { size: "3XL", chest: [112,118], waist: [92, 98],  hips: [118, 124], height: [165, 170], eu: "48", us: "22"   },
];

const GIRLS: GirlRow[] = [
  { size: "2",  age: "1–2",  chest: 53, waist: 52, hips: 55,  height: [86,  92]  },
  { size: "4",  age: "3–4",  chest: 56, waist: 54, hips: 58,  height: [98,  104] },
  { size: "6",  age: "5–6",  chest: 59, waist: 56, hips: 61,  height: [110, 116] },
  { size: "8",  age: "7–8",  chest: 62, waist: 58, hips: 65,  height: [122, 128] },
  { size: "10", age: "9–10", chest: 66, waist: 60, hips: 68,  height: [134, 140] },
  { size: "12", age: "11–12",chest: 70, waist: 63, hips: 73,  height: [146, 152] },
  { size: "14", age: "13–14",chest: 74, waist: 66, hips: 78,  height: [158, 164] },
];

function cm2in(n: number) { return (n / 2.54).toFixed(1); }
function fmtRange(a: number, b: number, unit: "cm" | "in") {
  return unit === "cm" ? `${a}–${b}` : `${cm2in(a)}–${cm2in(b)}`;
}
function fmtSingle(n: number, unit: "cm" | "in") {
  return unit === "cm" ? String(n) : cm2in(n);
}

export function SizeGuide({ gender = "women" }: { gender?: "women" | "girls" }) {
  const { t, language } = useI18n();
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [tab, setTab] = useState<"women" | "girls">("women");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-bold text-foreground/55 hover:text-primary transition-colors underline underline-offset-2 decoration-dotted"
      >
        <Ruler className="h-3.5 w-3.5" />
        {t("دليل المقاسات", "Size Guide")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-background w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ─────────────────────────────────── */}
            <div className="sticky top-0 z-10 bg-background border-b border-border flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-1">Noor</p>
                <h2 className="text-2xl font-serif font-black flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  {t("دليل المقاسات", "Size Guide")}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {/* cm / in toggle */}
                <div className="flex border border-border overflow-hidden">
                  {(["cm", "in"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                        unit === u ? "bg-foreground text-background" : "text-foreground/55 hover:text-foreground"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 flex items-center justify-center border border-border hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Tabs ──────────────────────────────────── */}
            <div className="flex border-b border-border">
              {(["women", "girls"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setTab(g)}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    tab === g
                      ? "border-b-2 border-primary text-primary"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {g === "women" ? t("نسائي", "Women") : t("بنات", "Girls")}
                </button>
              ))}
            </div>

            {/* ── How to measure ────────────────────────── */}
            <div className="px-6 py-4 bg-secondary/30 border-b border-border">
              <p className="text-xs font-bold text-foreground mb-2">{t("كيف تقيسي مقاسك؟", "How to measure?")}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "📐", ar: "الصدر: أوسع نقطة في الصدر تحت الإبط", en: "Chest: widest point across the chest" },
                  { icon: "⌚", ar: "الخصر: أضيق نقطة في الجذع فوق السرة", en: "Waist: narrowest point of your torso" },
                  { icon: "📏", ar: "الأرداف: أوسع نقطة حول الأرداف", en: "Hips: fullest point around the hips" },
                ].map((tip) => (
                  <div key={tip.icon} className="flex gap-2 items-start">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">{tip.icon}</span>
                    <p className="text-[11px] text-foreground/60 leading-relaxed">
                      {language === "ar" ? tip.ar : tip.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Women's Table ─────────────────────────── */}
            {tab === "women" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b-2 border-foreground/20">
                      {[
                        { ar: "المقاس", en: "Size" },
                        { ar: `الصدر (${unit})`, en: `Chest (${unit})` },
                        { ar: `الخصر (${unit})`, en: `Waist (${unit})` },
                        { ar: `الأرداف (${unit})`, en: `Hips (${unit})` },
                        { ar: `الطول (${unit})`, en: `Height (${unit})` },
                        { ar: "أوروبي", en: "EU" },
                        { ar: "أمريكي", en: "US" },
                      ].map((h) => (
                        <th key={h.en} className="py-3 px-3 font-black text-xs uppercase tracking-wide text-start first:text-start text-center first:text-start whitespace-nowrap">
                          {language === "ar" ? h.ar : h.en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {WOMEN.map((row, i) => (
                      <tr
                        key={row.size}
                        className={`border-b border-border/50 hover:bg-primary/5 transition-colors ${
                          i % 2 === 0 ? "" : "bg-secondary/20"
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center justify-center min-w-[2.75rem] h-8 bg-foreground text-background text-xs font-black px-2">
                            {row.size}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtRange(row.chest[0], row.chest[1], unit)}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtRange(row.waist[0], row.waist[1], unit)}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtRange(row.hips[0], row.hips[1], unit)}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtRange(row.height[0], row.height[1], unit)}</td>
                        <td className="py-3 px-3 text-center text-foreground/70 font-medium">{row.eu}</td>
                        <td className="py-3 px-3 text-center text-foreground/70 font-medium">{row.us}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Girls' Table ──────────────────────────── */}
            {tab === "girls" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b-2 border-foreground/20">
                      {[
                        { ar: "المقاس", en: "Size" },
                        { ar: "العمر (سنة)", en: "Age (yrs)" },
                        { ar: `الصدر (${unit})`, en: `Chest (${unit})` },
                        { ar: `الخصر (${unit})`, en: `Waist (${unit})` },
                        { ar: `الأرداف (${unit})`, en: `Hips (${unit})` },
                        { ar: `الطول (${unit})`, en: `Height (${unit})` },
                      ].map((h) => (
                        <th key={h.en} className="py-3 px-3 font-black text-xs uppercase tracking-wide text-start whitespace-nowrap">
                          {language === "ar" ? h.ar : h.en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GIRLS.map((row, i) => (
                      <tr
                        key={row.size}
                        className={`border-b border-border/50 hover:bg-primary/5 transition-colors ${
                          i % 2 === 0 ? "" : "bg-secondary/20"
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center justify-center min-w-[2.75rem] h-8 bg-foreground text-background text-xs font-black px-2">
                            {row.size}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-foreground/60 font-medium">{row.age}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtSingle(row.chest, unit)}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtSingle(row.waist, unit)}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtSingle(row.hips, unit)}</td>
                        <td className="py-3 px-3 text-center tabular-nums font-medium">{fmtRange(row.height[0], row.height[1], unit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Footer tip ────────────────────────────── */}
            <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-start gap-2 mt-auto">
              <span className="text-primary text-sm mt-px flex-shrink-0">💡</span>
              <p className="text-xs text-foreground/60 leading-relaxed">
                {t(
                  "إذا كانت قياساتك بين مقاسين، اختاري المقاس الأكبر دائماً للراحة. للاستفسار تواصلي معنا على واتساب.",
                  "If your measurements fall between two sizes, choose the larger size for comfort. Contact us on WhatsApp for personal advice."
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
