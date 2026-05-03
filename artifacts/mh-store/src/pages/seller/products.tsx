import { SellerLayout } from "@/components/seller-layout";
import { useI18n } from "@/lib/i18n";
import {
  useListProducts, useListCategories, useDeleteProduct, useCreateProduct, useUpdateProduct,
  getListProductsQueryKey, createProduct as createProductFn,
} from "@workspace/api-client-react";
import type { Product, Category } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, Tag, X, Save, Star, Upload, Copy, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Search, ImageIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useCallback } from "react";
import { Switch } from "@/components/ui/switch";

// ── Types ──────────────────────────────────────────────────────────────────────

type ProductForm = {
  nameAr: string; nameEn: string;
  descriptionAr: string; descriptionEn: string;
  price: string; originalPrice: string;
  imageUrl: string; categoryId: string;
  stock: string; featured: boolean;
  sizes: string; colors: string;
};

const EMPTY_FORM: ProductForm = {
  nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "",
  price: "", originalPrice: "", imageUrl: "", categoryId: "",
  stock: "", featured: false, sizes: "", colors: "",
};

type ParsedRow = {
  nameAr: string; nameEn: string; price: number; originalPrice?: number;
  imageUrl: string; categoryId: number; stock: number; featured: boolean;
  sizes: string[]; colors: string[];
};

type ImportRow = {
  raw: string[]; parsed: ParsedRow | null; error: string | null; status: "pending" | "ok" | "error";
};

// ── Template & Parsing ─────────────────────────────────────────────────────────

const TEMPLATE_HEADER = "الاسم العربي\tالاسم الإنجليزي\tالسعر\tالسعر الأصلي\tرابط الصورة\tرقم الفئة\tالكمية\tمميز (yes/no)\tالمقاسات\tالألوان";
const TEMPLATE_EXAMPLE = "فستان صيفي أنيق\tElegant Summer Dress\t450\t600\thttps://example.com/dress.jpg\t1\t20\tno\tS,M,L,XL\tأسود,أبيض";

const CATEGORY_GUIDE = [
  { id: 1, ar: "فساتين", en: "Dresses" },
  { id: 2, ar: "بلوزات", en: "Tops" },
  { id: 3, ar: "بناطيل", en: "Pants" },
  { id: 4, ar: "عبايات", en: "Abayas" },
  { id: 5, ar: "اكسسوارات", en: "Accessories" },
  { id: 6, ar: "شنط نسائية", en: "Women's Bags" },
  { id: 7, ar: "ملابس بنات", en: "Kids' Clothes" },
];

function parseRows(text: string, categories: Category[]): ImportRow[] {
  const lines = text.trim().split("\n").filter((l) => l.trim());
  const catMap: Record<string, number> = {};
  for (const c of CATEGORY_GUIDE) {
    catMap[String(c.id)] = c.id;
    catMap[c.ar] = c.id;
    catMap[c.en.toLowerCase()] = c.id;
  }
  for (const c of categories) {
    catMap[String(c.id)] = c.id;
    catMap[c.nameAr] = c.id;
    catMap[c.nameEn.toLowerCase()] = c.id;
  }

  return lines
    .filter((line) => !line.startsWith("الاسم العربي") && !line.startsWith("Name"))
    .map((line): ImportRow => {
      const cols = line.split("\t");
      const [nameAr = "", nameEn = "", priceRaw = "", origRaw = "", imageUrl = "", catRaw = "", stockRaw = "", featRaw = "", sizesRaw = "", colorsRaw = ""] = cols;

      const errors: string[] = [];
      if (!nameAr.trim()) errors.push("الاسم العربي مطلوب");
      const price = parseFloat(priceRaw.replace(/[^\d.]/g, ""));
      if (isNaN(price) || price <= 0) errors.push("السعر غير صحيح");

      // imageUrl is now optional — only validate if provided
      if (imageUrl.trim() && !imageUrl.trim().startsWith("http")) errors.push("رابط الصورة غير صحيح (يجب أن يبدأ بـ http)");

      // categoryId is optional — if provided must be valid
      const categoryId = catRaw.trim() ? (catMap[catRaw.trim()] ?? catMap[catRaw.trim().toLowerCase()]) : undefined;
      if (catRaw.trim() && !categoryId) errors.push(`الفئة "${catRaw}" غير موجودة`);

      if (errors.length > 0) {
        return { raw: cols, parsed: null, error: errors.join(" · "), status: "pending" };
      }

      const originalPrice = origRaw.trim() ? parseFloat(origRaw.replace(/[^\d.]/g, "")) : undefined;
      return {
        raw: cols,
        parsed: {
          nameAr: nameAr.trim(), nameEn: nameEn.trim(), price,
          originalPrice: originalPrice && !isNaN(originalPrice) ? originalPrice : undefined,
          imageUrl: imageUrl.trim(),
          categoryId: categoryId ?? 0,
          stock: parseInt(stockRaw) || 0,
          featured: ["yes", "نعم", "true", "1"].includes(featRaw.trim().toLowerCase()),
          sizes: sizesRaw.trim() ? sizesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
          colors: colorsRaw.trim() ? colorsRaw.split(",").map((c) => c.trim()).filter(Boolean) : [],
        },
        error: null, status: "pending",
      };
    });
}

// ── Bulk Import Modal ──────────────────────────────────────────────────────────

function BulkImportModal({ onClose, categories }: { onClose: () => void; categories: Category[] }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [pasteText, setPasteText] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState({ ok: 0, fail: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = (text: string) => {
    setPasteText(text);
    if (!text.trim()) { setRows([]); return; }
    setRows(parseRows(text, categories));
    setDone(false);
  };

  const validRows = rows.filter((r) => r.parsed !== null);
  const invalidRows = rows.filter((r) => r.parsed === null);

  const handleCopyTemplate = () => {
    const full = `${TEMPLATE_HEADER}\n${TEMPLATE_EXAMPLE}`;
    navigator.clipboard.writeText(full).then(() => toast.success(t("تم نسخ النموذج — الصقي في Excel", "Template copied — paste into Excel")));
  };

  const handleImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    setProgress(0);
    let ok = 0; let fail = 0;
    const updated = [...rows];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.parsed) continue;
      try {
        await createProductFn({ ...row.parsed, images: [], descriptionAr: undefined, descriptionEn: undefined });
        updated[i] = { ...row, status: "ok" };
        ok++;
      } catch {
        updated[i] = { ...row, status: "error" };
        fail++;
      }
      setRows([...updated]);
      setProgress(ok + fail);
    }

    await queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    setResults({ ok, fail });
    setImporting(false);
    setDone(true);
    if (fail === 0) toast.success(t(`تمت إضافة ${ok} منتج بنجاح`, `Successfully imported ${ok} products`));
    else toast.error(t(`تمت إضافة ${ok} و فشل ${fail}`, `Imported ${ok}, failed ${fail}`));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-border flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-black">{t("استيراد من Excel / Google Sheets", "Import from Excel / Google Sheets")}</h2>
              <p className="text-xs text-muted-foreground">{t("الصقي جدول البيانات مباشرةً", "Paste your spreadsheet data directly")}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none"><X className="h-5 w-5" /></Button>
        </div>

        <div className="p-8 space-y-6 flex-1">

          {/* Step 1 — Template */}
          <div className="border border-border p-5 bg-secondary/20 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold">{t("انسخي النموذج وافتحيه في Excel أو Google Sheets", "Copy the template & open in Excel or Google Sheets")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="text-xs w-full border-collapse">
                <thead>
                  <tr className="bg-foreground text-background">
                    {["الاسم العربي *", "الاسم الإنجليزي", "السعر *", "السعر الأصلي", "رابط الصورة", "رقم الفئة", "الكمية", "مميز (yes/no)", "المقاسات", "الألوان"].map((h) => (
                      <th key={h} className="px-3 py-2 text-right font-bold whitespace-nowrap border border-background/20">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-background">
                    <td className="px-3 py-2 border border-border text-muted-foreground whitespace-nowrap">فستان صيفي</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground whitespace-nowrap">Summer Dress</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">450</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">600</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground text-blue-600 whitespace-nowrap">https://… (اختياري)</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">1 (اختياري)</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">20</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">no</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">S,M,L,XL</td>
                    <td className="px-3 py-2 border border-border text-muted-foreground">أسود,أبيض</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              <Button variant="outline" size="sm" onClick={handleCopyTemplate} className="rounded-none h-9 gap-2 font-bold">
                <Copy className="h-4 w-4" />{t("نسخ النموذج", "Copy Template")}
              </Button>
              <div className="text-xs text-muted-foreground pt-2">
                <strong>{t("أرقام الفئات:", "Category numbers:")}</strong>{" "}
                {CATEGORY_GUIDE.map((c) => `${c.id}=${c.ar}`).join(" · ")}
              </div>
            </div>
          </div>

          {/* Step 2 — Paste */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold">{t("الصقي بيانات الجدول هنا", "Paste your spreadsheet data here")}</h3>
            </div>
            <textarea
              ref={textareaRef}
              value={pasteText}
              onChange={(e) => handleParse(e.target.value)}
              className="w-full border border-input bg-background px-4 py-3 text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono"
              rows={5}
              dir="ltr"
              placeholder={t("الصقي البيانات المنسوخة من Excel أو Google Sheets هنا...\nالاسم العربي\tالاسم الإنجليزي\tالسعر\t...", "Paste data copied from Excel or Google Sheets here...\nArabic Name\tEnglish Name\tPrice\t...")}
            />
            {pasteText && (
              <div className="flex gap-3 text-sm">
                <span className="text-green-700 font-bold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> {validRows.length} {t("صف صحيح", "valid rows")}
                </span>
                {invalidRows.length > 0 && (
                  <span className="text-destructive font-bold flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {invalidRows.length} {t("صف به خطأ", "rows with errors")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Step 3 — Preview */}
          {rows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-bold">{t("معاينة البيانات", "Data Preview")}</h3>
              </div>
              <div className="border border-border overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="text-sm w-full border-collapse">
                    <thead className="sticky top-0 bg-secondary">
                      <tr>
                        <th className="px-3 py-2 text-right font-bold text-xs uppercase tracking-wider border-b border-border w-8">#</th>
                        <th className="px-3 py-2 text-right font-bold text-xs uppercase tracking-wider border-b border-border">{t("الاسم", "Name")}</th>
                        <th className="px-3 py-2 text-right font-bold text-xs uppercase tracking-wider border-b border-border">{t("السعر", "Price")}</th>
                        <th className="px-3 py-2 text-right font-bold text-xs uppercase tracking-wider border-b border-border">{t("الفئة", "Cat")}</th>
                        <th className="px-3 py-2 text-right font-bold text-xs uppercase tracking-wider border-b border-border">{t("الحالة", "Status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className={`border-b border-border last:border-0 ${row.error ? "bg-destructive/5" : row.status === "ok" ? "bg-green-500/5" : row.status === "error" ? "bg-destructive/10" : "hover:bg-secondary/30"}`}>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{i + 1}</td>
                          <td className="px-3 py-2">
                            <span className="font-medium">{row.raw[0] || "—"}</span>
                            {row.raw[1] && <span className="text-muted-foreground text-xs ml-1 rtl:mr-1 rtl:ml-0">/ {row.raw[1]}</span>}
                          </td>
                          <td className="px-3 py-2 font-mono">{row.raw[2] || "—"}</td>
                          <td className="px-3 py-2 text-xs">{CATEGORY_GUIDE.find(c => String(c.id) === row.raw[5]?.trim())?.ar || row.raw[5] || "—"}</td>
                          <td className="px-3 py-2">
                            {row.status === "ok" ? (
                              <span className="flex items-center gap-1 text-green-700 text-xs font-bold"><CheckCircle className="h-3.5 w-3.5" />{t("تمت", "Done")}</span>
                            ) : row.status === "error" ? (
                              <span className="flex items-center gap-1 text-destructive text-xs font-bold"><AlertCircle className="h-3.5 w-3.5" />{t("فشل", "Failed")}</span>
                            ) : row.error ? (
                              <span className="text-destructive text-xs">{row.error}</span>
                            ) : (
                              <span className="flex items-center gap-1 text-green-700 text-xs"><CheckCircle className="h-3.5 w-3.5" />{t("جاهز", "Ready")}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("جاري الاستيراد...", "Importing...")}</span>
                <span className="font-mono text-primary">{progress} / {validRows.length}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${validRows.length > 0 ? (progress / validRows.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Done summary */}
          {done && (
            <div className={`p-4 border flex items-center gap-3 ${results.fail === 0 ? "bg-green-500/10 border-green-500/20 text-green-800" : "bg-amber-500/10 border-amber-500/20 text-amber-800"}`}>
              {results.fail === 0
                ? <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0" />
                : <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              }
              <p className="font-bold text-sm">
                {t(`✅ تمت إضافة ${results.ok} منتج بنجاح${results.fail > 0 ? ` · ❌ فشل ${results.fail}` : ""}`, `✅ ${results.ok} products imported${results.fail > 0 ? ` · ❌ ${results.fail} failed` : ""}`)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-8 py-5 border-t border-border sticky bottom-0 bg-background">
          <Button variant="outline" onClick={onClose} className="rounded-none h-11 px-6 font-bold">
            {done ? t("إغلاق", "Close") : t("إلغاء", "Cancel")}
          </Button>
          {!done && (
            <Button
              onClick={handleImport}
              disabled={validRows.length === 0 || importing}
              className="rounded-none h-11 px-8 font-bold uppercase tracking-wide gap-2"
            >
              {importing
                ? <><Loader2 className="h-4 w-4 animate-spin" />{t("جاري الاستيراد...", "Importing...")}</>
                : <><Upload className="h-4 w-4" />{t(`استيراد ${validRows.length} منتج`, `Import ${validRows.length} products`)}</>
              }
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Image Search Panel ────────────────────────────────────────────────────────

type ImageResult = { title: string; thumbnail: string; url: string };

function ImageSearchPanel({ query, onSelect }: { query: string; onSelect: (url: string) => void }) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [noKey, setNoKey] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    setNoKey(false);
    try {
      const res = await fetch(`/api/search-images?q=${encodeURIComponent(q + " fashion women clothing")}`);
      const data = await res.json() as { results?: ImageResult[]; error?: string };
      if (data.error?.includes("BRAVE_SEARCH_API_KEY")) {
        setNoKey(true);
        setResults([]);
      } else {
        setResults(data.results ?? []);
      }
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  return (
    <div className="border border-primary/30 bg-primary/5 p-4 space-y-3">
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch(searchQuery)}
          className="rounded-none h-10 flex-1"
          placeholder={t("ابحثي عن صورة... مثال: فستان محتشم أسود", "Search image... e.g. modest black dress")}
          dir="rtl"
        />
        <Button
          type="button"
          onClick={() => runSearch(searchQuery)}
          disabled={loading}
          className="rounded-none h-10 px-4 gap-2 font-bold shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {t("بحث", "Search")}
        </Button>
      </div>

      {noKey && (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm space-y-2">
          <p className="font-bold text-amber-800">{t("مطلوب إعداد مفتاح البحث", "Image search key setup required")}</p>
          <ol className="text-amber-700 space-y-1 list-decimal list-inside text-xs">
            <li>{t('اذهبي لـ', 'Go to')} <a href="https://api.search.brave.com" target="_blank" rel="noopener noreferrer" className="underline font-mono">api.search.brave.com</a></li>
            <li>{t("سجّلي مجاناً واحصلي على API Key", "Register for free and get your API Key")}</li>
            <li>{t("أضيفي المفتاح في لوحة Secrets باسم:", "Add the key in Secrets panel with name:")} <code className="bg-amber-100 px-1 font-mono">BRAVE_SEARCH_API_KEY</code></li>
          </ol>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-secondary/50 animate-pulse rounded-none" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && !noKey && (
        <p className="text-center text-muted-foreground text-sm py-4">
          {t("لا توجد نتائج. جربي كلمات أخرى.", "No results. Try different keywords.")}
        </p>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">{t("انقري على الصورة لاختيارها", "Click an image to select it")}</p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {results.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(img.url)}
                className="group relative aspect-[3/4] bg-secondary overflow-hidden border-2 border-transparent hover:border-primary transition-all focus:outline-none focus:border-primary"
                title={img.title}
              >
                <img
                  src={img.thumbnail || img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {!searched && !loading && (
        <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-20" />
          <p className="text-sm">{t("اكتبي اسم المنتج واضغطي بحث", "Type a product name and press Search")}</p>
        </div>
      )}
    </div>
  );
}

// ── Image Upload Panel ────────────────────────────────────────────────────────

function ImageUploadPanel({ onSelect }: { onSelect: (url: string) => void }) {
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("يرجى اختيار ملف صورة فقط", "Please select an image file only"));
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json() as { url: string };
      onSelect(data.url);
      toast.success(t("تم رفع الصورة بنجاح", "Image uploaded successfully"));
    } catch {
      toast.error(t("فشل رفع الصورة. حاولي مرة أخرى.", "Upload failed. Please try again."));
    }
    setUploading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div
      className={`border-2 border-dashed transition-colors p-6 text-center cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/20"}`}
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">{t("جاري رفع الصورة...", "Uploading image...")}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-2">
          <Upload className="h-8 w-8 text-muted-foreground/50" />
          <div>
            <p className="font-bold text-sm">{t("انقري لاختيار صورة أو اسحبها هنا", "Click to select or drag & drop an image")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("JPG, PNG, WebP, GIF — حد أقصى 10 MB", "JPG, PNG, WebP, GIF — max 10 MB")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Product Add/Edit Modal ─────────────────────────────────────────────────────

type ImageInputMode = "url" | "upload" | "search";

function ProductModal({
  product, onClose, categories,
}: {
  product: Product | null;
  onClose: () => void;
  categories: { id: number; nameAr: string; nameEn: string }[];
}) {
  const { t, language } = useI18n();
  const queryClient = useQueryClient();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEdit = !!product;
  const [imageMode, setImageMode] = useState<ImageInputMode>("url");

  const [form, setForm] = useState<ProductForm>(
    product
      ? {
          nameAr: product.nameAr, nameEn: product.nameEn ?? "",
          descriptionAr: product.descriptionAr ?? "", descriptionEn: product.descriptionEn ?? "",
          price: String(product.price), originalPrice: String(product.originalPrice ?? ""),
          imageUrl: product.imageUrl ?? "", categoryId: String(product.categoryId ?? ""),
          stock: String(product.stock ?? ""), featured: product.featured,
          sizes: (product.sizes ?? []).join(","), colors: (product.colors ?? []).join(","),
        }
      : EMPTY_FORM
  );

  const set = (key: keyof ProductForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageSelect = (url: string) => {
    set("imageUrl", url);
    setImageMode("url");
    toast.success(t("تم اختيار الصورة", "Image selected"));
  };

  const handleSubmit = () => {
    if (!form.nameAr || !form.price) {
      toast.error(t("يرجى ملء الحقول المطلوبة: الاسم العربي والسعر", "Please fill required fields: Arabic name and price"));
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error(t("يرجى إدخال سعر صحيح", "Please enter a valid price"));
      return;
    }
    const body = {
      nameAr: form.nameAr,
      nameEn: form.nameEn || undefined,
      descriptionAr: form.descriptionAr || undefined,
      descriptionEn: form.descriptionEn || undefined,
      price,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      imageUrl: form.imageUrl || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      stock: form.stock ? parseInt(form.stock) : 0,
      featured: form.featured,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
      images: [],
    };

    if (isEdit && product) {
      updateProduct.mutate(
        { id: product.id, data: body },
        {
          onSuccess: () => {
            toast.success(t("تم تحديث المنتج", "Product updated"));
            queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
            onClose();
          },
          onError: () => toast.error(t("حدث خطأ أثناء التحديث", "Error updating product")),
        }
      );
    } else {
      createProduct.mutate({ data: body }, {
        onSuccess: () => {
          toast.success(t("تمت إضافة المنتج بنجاح", "Product added successfully"));
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          onClose();
        },
        onError: () => toast.error(t("حدث خطأ أثناء الإضافة", "Error adding product")),
      });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-2xl font-serif font-black">
            {isEdit ? t("تعديل المنتج", "Edit Product") : t("إضافة منتج جديد", "Add New Product")}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8 space-y-6">
          {/* Image preview */}
          {form.imageUrl && (
            <div className="relative w-full h-48 bg-secondary overflow-hidden border border-border group">
              <img src={form.imageUrl} alt="" className="w-full h-full object-cover object-top" />
              <button
                type="button"
                onClick={() => set("imageUrl", "")}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title={t("إزالة الصورة", "Remove image")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arabic name (required) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الاسم بالعربي *", "Name (Arabic) *")}
              </Label>
              <Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="rounded-none h-11" dir="rtl" placeholder={t("مطلوب", "Required")} />
            </div>

            {/* English name (optional) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الاسم بالإنجليزي", "Name (English)")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className="rounded-none h-11" dir="ltr" />
            </div>

            {/* Image section — full width */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  {t("صورة المنتج", "Product Image")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
                </Label>
                {/* Mode switcher */}
                <div className="flex border border-border overflow-hidden">
                  {(["url", "upload", "search"] as ImageInputMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setImageMode(mode)}
                      className={`px-3 py-1.5 text-xs font-bold transition-colors ${imageMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                      {mode === "url" ? t("رابط", "URL") : mode === "upload" ? t("رفع", "Upload") : t("بحث", "Search")}
                    </button>
                  ))}
                </div>
              </div>

              {imageMode === "url" && (
                <div>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => set("imageUrl", e.target.value)}
                    className="rounded-none h-11 font-mono text-sm"
                    dir="ltr"
                    placeholder="https://example.com/image.jpg  أو  https://example.com/image.png  أو  أي رابط صورة"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("الصقي رابط أي صورة (jpg, png, webp, gif, avif…)", "Paste any image URL (jpg, png, webp, gif, avif…)")}
                  </p>
                </div>
              )}

              {imageMode === "upload" && (
                <ImageUploadPanel onSelect={handleImageSelect} />
              )}

              {imageMode === "search" && (
                <ImageSearchPanel
                  query={form.nameAr || form.nameEn}
                  onSelect={handleImageSelect}
                />
              )}
            </div>

            {/* Price (required) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("السعر (ج.م) *", "Price (EGP) *")}
              </Label>
              <Input type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} className="rounded-none h-11" placeholder={t("مطلوب", "Required")} />
            </div>

            {/* Original price (optional) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("السعر قبل الخصم", "Original Price")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <Input type="number" min={0} value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} className="rounded-none h-11" />
            </div>

            {/* Category (optional) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الفئة", "Category")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="w-full h-11 border border-input bg-background px-3 text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">{t("— بدون فئة —", "— No category —")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === "ar" ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock (optional) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الكمية في المخزون", "Stock Quantity")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <Input type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} className="rounded-none h-11" placeholder="0" />
            </div>

            {/* Sizes (optional) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("المقاسات (مفصولة بفاصلة)", "Sizes (comma separated)")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <Input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className="rounded-none h-11" placeholder="S,M,L,XL,XXL" dir="ltr" />
            </div>

            {/* Colors (optional) */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الألوان (مفصولة بفاصلة)", "Colors (comma separated)")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <Input value={form.colors} onChange={(e) => set("colors", e.target.value)} className="rounded-none h-11" placeholder="أسود,أبيض,بيج" dir="rtl" />
            </div>

            {/* Description Arabic (optional) */}
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الوصف بالعربي", "Description (Arabic)")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <textarea
                value={form.descriptionAr}
                onChange={(e) => set("descriptionAr", e.target.value)}
                rows={3}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                dir="rtl"
              />
            </div>

            {/* Description English (optional) */}
            <div className="md:col-span-2">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2 block">
                {t("الوصف بالإنجليزي", "Description (English)")} <span className="text-muted-foreground font-normal normal-case tracking-normal">{t("(اختياري)", "(optional)")}</span>
              </Label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => set("descriptionEn", e.target.value)}
                rows={3}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 p-4 bg-secondary/30 border border-border">
            <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
            <div>
              <Label className="font-bold flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                {t("منتج مميز — يظهر في الصفحة الرئيسية", "Featured — shown on homepage")}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("فعّلي هذا لإظهار المنتج في قسم القطع المميزة", "Enable to show in the Featured Pieces section")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-border sticky bottom-0 bg-background">
          <Button variant="outline" onClick={onClose} className="rounded-none h-11 px-6 font-bold">
            {t("إلغاء", "Cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="rounded-none h-11 px-8 font-bold uppercase tracking-wide">
            <Save className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isPending
              ? t("جاري الحفظ...", "Saving...")
              : isEdit
              ? t("حفظ التعديلات", "Save Changes")
              : t("إضافة المنتج", "Add Product")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function SellerProducts() {
  const { t, language } = useI18n();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const { data: categories } = useListCategories();
  const deleteProduct = useDeleteProduct();
  const [modalProduct, setModalProduct] = useState<Product | null | "new">(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm(t("هل أنت متأكد من حذف هذا المنتج؟", "Are you sure you want to delete this product?"))) {
      deleteProduct.mutate({ id }, {
        onSuccess: () => {
          toast.success(t("تم الحذف بنجاح", "Deleted successfully"));
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        }
      });
    }
  };

  const cats = (categories ?? []).map((c) => ({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn }));

  return (
    <SellerLayout>
      {modalProduct !== null && (
        <ProductModal
          product={modalProduct === "new" ? null : modalProduct}
          onClose={() => setModalProduct(null)}
          categories={cats}
        />
      )}
      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          categories={categories ?? []}
        />
      )}

      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight mb-2">{t("كتالوج المنتجات", "Product Catalog")}</h1>
            <p className="text-muted-foreground">
              {t("إضافة وتعديل منتجات متجرك الفاخر.", "Add and edit your premium store products.")}
              <span className="mr-2 rtl:ml-2 font-bold text-primary">{products?.length ?? 0} {t("منتج", "products")}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-none h-12 px-5 font-bold uppercase tracking-wide border-primary/40 text-primary hover:bg-primary/5 gap-2"
              onClick={() => setShowBulkImport(true)}
            >
              <FileSpreadsheet className="h-5 w-5" />
              {t("استيراد Excel", "Import Excel")}
            </Button>
            <Button
              className="rounded-none h-12 px-6 font-bold uppercase tracking-wide"
              onClick={() => setModalProduct("new")}
            >
              <Plus className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {t("إضافة منتج", "Add Product")}
            </Button>
          </div>
        </div>

        <div className="bg-card shadow-sm border border-border">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20 py-4"></TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("تفاصيل المنتج", "Product Details")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("السعر", "Price")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("المخزون", "Stock")}</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs py-4">{t("الحالة", "Status")}</TableHead>
                <TableHead className="text-right rtl:text-left font-bold uppercase tracking-wider text-xs py-4">{t("الإجراءات", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    {t("جاري التحميل...", "Loading...")}
                  </TableCell>
                </TableRow>
              ) : products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <Tag className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    {t("لا توجد منتجات. ابدأ بإضافة منتجك الأول.", "No products found. Start by adding your first product.")}
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id} className="hover:bg-secondary/20 transition-colors group">
                    <TableCell className="py-3">
                      <div className="w-14 aspect-[3/4] bg-background border border-border/50 overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground text-base mb-1">
                        {language === "ar" ? product.nameAr : (product.nameEn || product.nameAr)}
                      </div>
                      <div className="text-sm text-muted-foreground flex gap-2 flex-wrap">
                        {(product.categoryNameAr || product.categoryNameEn) && (
                          <span className="text-xs uppercase tracking-wider bg-secondary px-2 py-0.5 text-foreground/70">
                            {language === "ar" ? product.categoryNameAr : product.categoryNameEn}
                          </span>
                        )}
                        {product.featured && (
                          <span className="text-primary font-semibold text-xs tracking-wider uppercase border border-primary/20 bg-primary/5 px-2 py-0.5">
                            ★ {t("مميز", "Featured")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-lg">{product.price} <span className="text-sm font-normal text-muted-foreground">{t("ج.م", "EGP")}</span></div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">{product.originalPrice}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono bg-secondary/50 px-3 py-1 text-sm font-medium">{product.stock}</span>
                    </TableCell>
                    <TableCell>
                      {product.stock > 0
                        ? <Badge variant="outline" className="text-green-700 bg-green-500/10 border-green-500/20 rounded-none px-3 py-1 tracking-wide uppercase text-xs">{t("متوفر", "In Stock")}</Badge>
                        : <Badge variant="outline" className="text-destructive bg-destructive/10 border-destructive/20 rounded-none px-3 py-1 tracking-wide uppercase text-xs">{t("نفذ", "Out of Stock")}</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline" size="icon"
                          className="h-9 w-9 rounded-none border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
                          title={t("تعديل", "Edit")}
                          onClick={() => setModalProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline" size="icon"
                          className="h-9 w-9 rounded-none border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-colors"
                          title={t("حذف", "Delete")}
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SellerLayout>
  );
}
