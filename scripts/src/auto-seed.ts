/**
 * Auto-seed script — runs on first deployment only.
 * Checks if the database already has products; if empty, seeds with sample data.
 * Safe to run on every startup.
 */
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function autoSeed() {
  console.log("[seed] Checking if database needs seeding...");

  // Check if products already exist
  const result = await db.execute(sql`SELECT COUNT(*) as count FROM products`);
  const count = Number((result.rows[0] as { count: string }).count);

  if (count > 0) {
    console.log(`[seed] Database already has ${count} products — skipping seed.`);
    return;
  }

  console.log("[seed] Database is empty — seeding with sample products...");

  // ── Insert categories ──────────────────────────────────────────────────────
  const categoryData = [
    { nameAr: "فساتين", nameEn: "Dresses", imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400" },
    { nameAr: "بلوزات وتوبات", nameEn: "Tops", imageUrl: "https://images.unsplash.com/photo-1551163943-3f7254ee3d03?w=400" },
    { nameAr: "بناطيل", nameEn: "Pants", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400" },
    { nameAr: "عبايات", nameEn: "Abayas", imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400" },
    { nameAr: "اكسسوارات", nameEn: "Accessories", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { nameAr: "شنط نسائية", nameEn: "Women's Bags", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },
    { nameAr: "ملابس بنات", nameEn: "Kids' Clothes", imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400" },
  ];

  const insertedCats = await db.insert(categoriesTable).values(categoryData).returning();
  const catMap: Record<string, number> = {};
  insertedCats.forEach(c => { catMap[c.nameEn] = c.id; });
  console.log("[seed] Categories created:", Object.keys(catMap).join(", "));

  // ── Product list ────────────────────────────────────────────────────────────
  const products = [
    // DRESSES
    {
      nameAr: "فستان ماكسي بوهيمي", nameEn: "Bohemian Maxi Dress",
      descriptionAr: "فستان ماكسي أنيق ومحتشم بتصميم بوهيمي يجمع بين الراحة والأناقة",
      descriptionEn: "Elegant and modest bohemian maxi dress combining comfort and style",
      price: "320", originalPrice: "450",
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
      category: "Dresses", stock: 20, featured: true,
      sizes: ["S","M","L","XL","XXL"], colors: ["أزرق","أبيض","بيج","زيتي"],
    },
    {
      nameAr: "فستان كوكتيل سواريه", nameEn: "Elegant Evening Dress",
      descriptionAr: "فستان سواريه راقٍ للمناسبات الخاصة",
      descriptionEn: "Elegant dress for special occasions",
      price: "580", originalPrice: "780",
      imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
      category: "Dresses", stock: 10, featured: true,
      sizes: ["XS","S","M","L"], colors: ["أسود","أحمر","ذهبي"],
    },
    {
      nameAr: "فستان فلوري ربيعي", nameEn: "Floral Spring Dress",
      descriptionAr: "فستان ربيعي بطبعة زهور جميلة ومحتشمة",
      descriptionEn: "Beautiful modest floral spring dress",
      price: "260", originalPrice: "340",
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
      category: "Dresses", stock: 18, featured: false,
      sizes: ["XS","S","M","L","XL"], colors: ["وردي","أبيض","أزرق"],
    },
    {
      nameAr: "فستان محتشم بأكمام طويلة", nameEn: "Modest Long-Sleeve Dress",
      descriptionAr: "فستان محتشم أنيق بأكمام طويلة مناسب لكل المناسبات",
      descriptionEn: "Modest elegant long-sleeve dress for all occasions",
      price: "340",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      category: "Dresses", stock: 25, featured: true,
      sizes: ["S","M","L","XL","XXL","3XL"], colors: ["أسود","كحلي","بيج","ترابي"],
    },
    {
      nameAr: "فستان حفلات شيفون", nameEn: "Chiffon Party Dress",
      descriptionAr: "فستان حفلات من الشيفون الخفيف الفاخر",
      descriptionEn: "Luxury lightweight chiffon party dress",
      price: "490", originalPrice: "620",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
      category: "Dresses", stock: 12, featured: false,
      sizes: ["XS","S","M","L"], colors: ["زهري","ليلكي","فيروزي"],
    },

    // TOPS
    {
      nameAr: "بلوزة شيفون محتشمة", nameEn: "Modest Chiffon Blouse",
      descriptionAr: "بلوزة شيفون محتشمة بأكمام طويلة وأناقة رفيعة",
      descriptionEn: "Modest chiffon blouse with long sleeves and refined elegance",
      price: "145", originalPrice: "200",
      imageUrl: "https://images.unsplash.com/photo-1551163943-3f7254ee3d03?w=600&q=80",
      category: "Tops", stock: 28, featured: false,
      sizes: ["XS","S","M","L","XL"], colors: ["أبيض","كريمي","وردي فاتح"],
    },
    {
      nameAr: "توب ساتان لامع", nameEn: "Satin Shimmer Top",
      descriptionAr: "توب ساتان أنيق للمناسبات والسهرات",
      descriptionEn: "Elegant satin top for occasions and evenings",
      price: "195",
      imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
      category: "Tops", stock: 20, featured: false,
      sizes: ["XS","S","M","L","XL"], colors: ["ذهبي","فضي","أسود","خمري"],
    },
    {
      nameAr: "بلوزة كاجوال يومية", nameEn: "Casual Daily Blouse",
      descriptionAr: "بلوزة يومية مريحة ومحتشمة لكل وقت",
      descriptionEn: "Comfortable and modest casual blouse for everyday wear",
      price: "110",
      imageUrl: "https://images.unsplash.com/photo-1503342564933-3e89d851cf8c?w=600&q=80",
      category: "Tops", stock: 40, featured: false,
      sizes: ["XS","S","M","L","XL","XXL"], colors: ["أبيض","أسود","بيج","وردي"],
    },

    // PANTS
    {
      nameAr: "بنطلون كلاسيك مستقيم", nameEn: "Classic Straight-Cut Pants",
      descriptionAr: "بنطلون كلاسيكي بقصة مستقيمة أنيقة للمرأة العصرية",
      descriptionEn: "Classic straight-cut elegant pants for the modern woman",
      price: "275", originalPrice: "350",
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
      category: "Pants", stock: 22, featured: false,
      sizes: ["XS","S","M","L","XL","XXL"], colors: ["أسود","رمادي","بيج","كحلي"],
    },
    {
      nameAr: "بنطلون واسع بوهيمي", nameEn: "Wide-Leg Boho Pants",
      descriptionAr: "بنطلون واسع محتشم بتصميم عصري ومريح جداً",
      descriptionEn: "Wide-leg modest pants with modern comfortable design",
      price: "240",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      category: "Pants", stock: 17, featured: false,
      sizes: ["S","M","L","XL","XXL"], colors: ["أبيض","أسود","ترابي","بيج"],
    },

    // ABAYAS
    {
      nameAr: "عباية خليجية بتطريز ذهبي", nameEn: "Gulf Abaya with Gold Embroidery",
      descriptionAr: "عباية خليجية فاخرة بتطريز ذهبي يدوي راقٍ",
      descriptionEn: "Luxury Gulf abaya with hand-crafted golden embroidery",
      price: "750", originalPrice: "950",
      imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80",
      category: "Abayas", stock: 8, featured: true,
      sizes: ["S","M","L","XL","XXL","3XL"], colors: ["أسود"],
    },
    {
      nameAr: "عباية كريب مودرن", nameEn: "Modern Crepe Abaya",
      descriptionAr: "عباية كريب سادة بقصة عصرية أنيقة للمرأة العصرية",
      descriptionEn: "Plain crepe abaya with elegant modern cut",
      price: "420",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80",
      category: "Abayas", stock: 18, featured: true,
      sizes: ["S","M","L","XL","XXL","3XL"], colors: ["أسود","كحلي","رمادي","بنفسجي غامق"],
    },
    {
      nameAr: "عباية جورجيت مطرزة", nameEn: "Embroidered Georgette Abaya",
      descriptionAr: "عباية جورجيت فاخرة بتطريز حريري جميل",
      descriptionEn: "Luxury georgette abaya with beautiful silk embroidery",
      price: "580", originalPrice: "720",
      imageUrl: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600&q=80",
      category: "Abayas", stock: 10, featured: false,
      sizes: ["S","M","L","XL","XXL"], colors: ["أسود","عنابي","رمادي"],
    },

    // ACCESSORIES
    {
      nameAr: "ساعة نسائية أنيقة", nameEn: "Elegant Women's Watch",
      descriptionAr: "ساعة نسائية أنيقة بسوار معدني لامع",
      descriptionEn: "Elegant women's watch with shiny metal strap",
      price: "680", originalPrice: "880",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      category: "Accessories", stock: 8, featured: true,
      sizes: ["واحد مقاس"], colors: ["ذهبي","فضي","روزغولد"],
    },
    {
      nameAr: "نظارة شمسية نسائية", nameEn: "Women's Fashion Sunglasses",
      descriptionAr: "نظارة شمسية نسائية بتصميم كلاسيكي أنيق",
      descriptionEn: "Women's sunglasses with classic elegant design",
      price: "280",
      imageUrl: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80",
      category: "Accessories", stock: 20, featured: false,
      sizes: ["واحد مقاس"], colors: ["أسود","ذهبي","بني","فضي"],
    },
    {
      nameAr: "إيشارب حرير راقٍ", nameEn: "Luxury Silk Scarf",
      descriptionAr: "إيشارب حرير فاخر بألوان متعددة",
      descriptionEn: "Luxury silk scarf in vibrant multicolors",
      price: "240", originalPrice: "320",
      imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
      category: "Accessories", stock: 25, featured: false,
      sizes: ["واحد مقاس"], colors: ["متعدد الألوان"],
    },
    {
      nameAr: "خاتم ذهبي أنيق", nameEn: "Elegant Gold Ring",
      descriptionAr: "خاتم ذهبي اللون بتصميم بسيط وأنيق",
      descriptionEn: "Gold-colored ring with simple and elegant design",
      price: "185",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      category: "Accessories", stock: 30, featured: false,
      sizes: ["واحد مقاس"], colors: ["ذهبي","فضي","روزغولد"],
    },

    // WOMEN'S BAGS
    {
      nameAr: "شنطة يد جلد فاخرة", nameEn: "Luxury Leather Handbag",
      descriptionAr: "شنطة يد من الجلد الطبيعي بتصميم كلاسيكي فاخر",
      descriptionEn: "Natural leather handbag with classic luxury design",
      price: "890", originalPrice: "1200",
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      category: "Women's Bags", stock: 7, featured: true,
      sizes: ["واحد مقاس"], colors: ["بني","أسود","كاميل"],
    },
    {
      nameAr: "شنطة كتف أنيقة", nameEn: "Elegant Shoulder Bag",
      descriptionAr: "شنطة كتف أنيقة بسعة واسعة ومواد عالية الجودة",
      descriptionEn: "Elegant shoulder bag with spacious capacity and quality materials",
      price: "520", originalPrice: "680",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
      category: "Women's Bags", stock: 12, featured: true,
      sizes: ["واحد مقاس"], colors: ["بيج","أسود","وردي","بني"],
    },
    {
      nameAr: "شنطة كروس بودي صغيرة", nameEn: "Mini Crossbody Bag",
      descriptionAr: "شنطة كروس بودي صغيرة أنيقة وعملية",
      descriptionEn: "Stylish and practical mini crossbody bag",
      price: "310",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      category: "Women's Bags", stock: 20, featured: false,
      sizes: ["واحد مقاس"], colors: ["أسود","بني","خمري","بيج"],
    },
    {
      nameAr: "شنطة توت كبيرة", nameEn: "Large Tote Bag",
      descriptionAr: "شنطة توت كبيرة مثالية للعمل والخروجات اليومية",
      descriptionEn: "Large tote bag perfect for work and daily outings",
      price: "440", originalPrice: "580",
      imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
      category: "Women's Bags", stock: 14, featured: false,
      sizes: ["واحد مقاس"], colors: ["كاميل","أسود","بيج","وردي"],
    },
    {
      nameAr: "كلتش سهرة لامع", nameEn: "Glitter Evening Clutch",
      descriptionAr: "كلتش سهرة لامع للمناسبات والحفلات الخاصة",
      descriptionEn: "Glittery evening clutch for special events and parties",
      price: "245",
      imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
      category: "Women's Bags", stock: 25, featured: false,
      sizes: ["واحد مقاس"], colors: ["ذهبي","فضي","أسود","وردي"],
    },

    // KIDS' CLOTHES
    {
      nameAr: "فستان بنات ورد جميل", nameEn: "Floral Girls' Dress",
      descriptionAr: "فستان بنات جميل بطبعة ورود للمناسبات والعيد",
      descriptionEn: "Beautiful floral girls' dress for occasions and Eid",
      price: "195", originalPrice: "260",
      imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
      category: "Kids' Clothes", stock: 22, featured: true,
      sizes: ["2سنة","4سنة","6سنة","8سنة","10سنة"], colors: ["وردي","أصفر","أزرق فاتح"],
    },
    {
      nameAr: "طقم بنات كاجوال", nameEn: "Girls' Casual Set",
      descriptionAr: "طقم بنات كاجوال مريح وأنيق للمدرسة والخروجات",
      descriptionEn: "Comfortable girls' casual set for school and outings",
      price: "185",
      imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
      category: "Kids' Clothes", stock: 30, featured: false,
      sizes: ["4سنة","6سنة","8سنة","10سنة","12سنة"], colors: ["زهري","أزرق","أخضر","بيج"],
    },
    {
      nameAr: "فستان عيد فاخر للبنات", nameEn: "Luxury Girls' Eid Dress",
      descriptionAr: "فستان عيد فاخر للبنات بتصميم أميرات ساحر",
      descriptionEn: "Luxury princess-design Eid dress for girls",
      price: "290", originalPrice: "380",
      imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=80",
      category: "Kids' Clothes", stock: 14, featured: true,
      sizes: ["2سنة","4سنة","6سنة","8سنة","10سنة"], colors: ["وردي","أبيض","ذهبي","ليلكي"],
    },
    {
      nameAr: "بيجاما بنات قطن ناعم", nameEn: "Soft Cotton Girls' Pajama",
      descriptionAr: "بيجاما بنات من القطن الناعم بتصاميم مبهجة",
      descriptionEn: "Soft cotton girls' pajama with fun designs",
      price: "150", originalPrice: "195",
      imageUrl: "https://images.unsplash.com/photo-1514996937319-344454492b37?w=600&q=80",
      category: "Kids' Clothes", stock: 35, featured: false,
      sizes: ["2سنة","4سنة","6سنة","8سنة","10سنة","12سنة"], colors: ["وردي","أزرق فاتح","أصفر","أخضر"],
    },
    {
      nameAr: "فستان طرحة للبنات", nameEn: "Girls' Hijab Dress Set",
      descriptionAr: "فستان مع طرحة للبنات محتشم وأنيق للمناسبات",
      descriptionEn: "Modest and elegant girls' dress with hijab for occasions",
      price: "245", originalPrice: "310",
      imageUrl: "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=600&q=80",
      category: "Kids' Clothes", stock: 18, featured: true,
      sizes: ["4سنة","6سنة","8سنة","10سنة","12سنة"], colors: ["وردي","أبيض","بنفسجي"],
    },
  ];

  let added = 0;
  for (const p of products) {
    const categoryId = catMap[p.category];
    if (!categoryId) { console.warn(`[seed] Skipping "${p.nameEn}" — category not found`); continue; }

    await db.insert(productsTable).values({
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      descriptionAr: p.descriptionAr,
      descriptionEn: p.descriptionEn,
      price: p.price,
      originalPrice: p.originalPrice,
      imageUrl: p.imageUrl,
      images: [],
      categoryId,
      stock: p.stock,
      featured: p.featured,
      sizes: p.sizes,
      colors: p.colors,
    });
    added++;
  }

  console.log(`[seed] ✅ Seeded ${added} products across ${Object.keys(catMap).length} categories.`);
}

autoSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[seed] ❌ Error:", err);
    process.exit(0); // Exit 0 so it doesn't block server startup
  });
