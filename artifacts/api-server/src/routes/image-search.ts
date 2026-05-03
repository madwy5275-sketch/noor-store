import { Router } from "express";

const router = Router();

router.get("/search-images", async (req, res) => {
  const q = req.query.q as string;
  if (!q?.trim()) {
    res.status(400).json({ error: "q is required" });
    return;
  }

  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "BRAVE_SEARCH_API_KEY not set", results: [] });
    return;
  }

  try {
    const url = new URL("https://api.search.brave.com/res/v1/images/search");
    url.searchParams.set("q", q);
    url.searchParams.set("count", "12");
    url.searchParams.set("safesearch", "strict");

    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "Brave API error");
      res.status(502).json({ error: "Image search failed", results: [] });
      return;
    }

    const data = await response.json() as { results?: Array<{ title?: string; thumbnail?: { src?: string }; properties?: { url?: string } }> };
    const results = (data.results ?? []).map((item) => ({
      title: item.title ?? "",
      thumbnail: item.thumbnail?.src ?? "",
      url: item.properties?.url ?? "",
    })).filter((r) => r.url);

    res.json({ results });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Image search failed", results: [] });
  }
});

export default router;
