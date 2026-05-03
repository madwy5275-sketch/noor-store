import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, like, and, type SQL } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query params" });
      return;
    }
    const { category, featured, search } = query.data;

    const conditions: SQL[] = [];
    if (featured !== undefined) {
      conditions.push(eq(productsTable.featured, featured));
    }
    if (search) {
      conditions.push(like(productsTable.nameAr, `%${search}%`));
    }

    const products = await db
      .select({
        id: productsTable.id,
        nameAr: productsTable.nameAr,
        nameEn: productsTable.nameEn,
        descriptionAr: productsTable.descriptionAr,
        descriptionEn: productsTable.descriptionEn,
        price: productsTable.price,
        originalPrice: productsTable.originalPrice,
        imageUrl: productsTable.imageUrl,
        images: productsTable.images,
        categoryId: productsTable.categoryId,
        categoryNameAr: categoriesTable.nameAr,
        categoryNameEn: categoriesTable.nameEn,
        stock: productsTable.stock,
        featured: productsTable.featured,
        sizes: productsTable.sizes,
        colors: productsTable.colors,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const womenCategories = ["dresses", "tops", "pants", "abayas", "accessories", "shoes"];
    const kidsCategories = ["kids' clothes", "girls' clothes"];
    const bagsCategories = ["women's bags"];

    const filtered = category
      ? products.filter((p) => {
          const catEn = p.categoryNameEn?.toLowerCase() ?? "";
          const catAr = p.categoryNameAr ?? "";
          if (category.toLowerCase() === "women") return womenCategories.includes(catEn);
          if (category.toLowerCase() === "kids") return kidsCategories.includes(catEn);
          if (category.toLowerCase() === "bags") return bagsCategories.includes(catEn);
          return catEn === category.toLowerCase() || catAr === category;
        })
      : products;

    res.json(
      filtered.map((p) => ({
        ...p,
        price: parseFloat(p.price as string),
        originalPrice: p.originalPrice ? parseFloat(p.originalPrice as string) : undefined,
        createdAt: p.createdAt?.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const body = CreateProductBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid body", details: body.error.issues });
      return;
    }
    const { data } = body;
    const [product] = await db
      .insert(productsTable)
      .values({
        nameAr: data.nameAr,
        nameEn: data.nameEn ?? "",
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        price: String(data.price),
        originalPrice: data.originalPrice ? String(data.originalPrice) : undefined,
        imageUrl: data.imageUrl ?? "",
        images: data.images ?? [],
        categoryId: data.categoryId,
        stock: data.stock ?? 0,
        featured: data.featured ?? false,
        sizes: data.sizes ?? [],
        colors: data.colors ?? [],
      })
      .returning();

    res.status(201).json({
      ...product,
      price: parseFloat(product.price as string),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice as string) : undefined,
      createdAt: product.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const params = GetProductParams.safeParse({ id: parseInt(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [product] = await db
      .select({
        id: productsTable.id,
        nameAr: productsTable.nameAr,
        nameEn: productsTable.nameEn,
        descriptionAr: productsTable.descriptionAr,
        descriptionEn: productsTable.descriptionEn,
        price: productsTable.price,
        originalPrice: productsTable.originalPrice,
        imageUrl: productsTable.imageUrl,
        images: productsTable.images,
        categoryId: productsTable.categoryId,
        categoryNameAr: categoriesTable.nameAr,
        categoryNameEn: categoriesTable.nameEn,
        stock: productsTable.stock,
        featured: productsTable.featured,
        sizes: productsTable.sizes,
        colors: productsTable.colors,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, params.data.id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...product,
      price: parseFloat(product.price as string),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice as string) : undefined,
      createdAt: product.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const params = UpdateProductParams.safeParse({ id: parseInt(req.params.id) });
    const body = UpdateProductBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const { data } = body;
    const [product] = await db
      .update(productsTable)
      .set({
        nameAr: data.nameAr,
        nameEn: data.nameEn ?? "",
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        price: String(data.price),
        originalPrice: data.originalPrice ? String(data.originalPrice) : undefined,
        imageUrl: data.imageUrl ?? "",
        images: data.images ?? [],
        categoryId: data.categoryId,
        stock: data.stock ?? 0,
        featured: data.featured ?? false,
        sizes: data.sizes ?? [],
        colors: data.colors ?? [],
      })
      .where(eq(productsTable.id, params.data.id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...product,
      price: parseFloat(product.price as string),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice as string) : undefined,
      createdAt: product.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const params = DeleteProductParams.safeParse({ id: parseInt(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(productsTable).where(eq(productsTable.id, params.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
