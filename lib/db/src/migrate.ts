import pg from "pg";

const { Pool } = pg;

/**
 * Runs CREATE TABLE IF NOT EXISTS for every table in the schema.
 * Safe to call on every startup — it won't touch existing data.
 */
export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.warn("[migrate] DATABASE_URL not set — skipping migrations.");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id          SERIAL PRIMARY KEY,
        name_ar     TEXT NOT NULL,
        name_en     TEXT NOT NULL DEFAULT '',
        image_url   TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id              SERIAL PRIMARY KEY,
        name_ar         TEXT NOT NULL,
        name_en         TEXT NOT NULL DEFAULT '',
        description_ar  TEXT,
        description_en  TEXT,
        price           NUMERIC(10, 2) NOT NULL,
        original_price  NUMERIC(10, 2),
        image_url       TEXT NOT NULL DEFAULT '',
        images          JSONB DEFAULT '[]',
        category_id     INTEGER REFERENCES categories(id),
        stock           INTEGER NOT NULL DEFAULT 0,
        featured        BOOLEAN NOT NULL DEFAULT FALSE,
        sizes           JSONB DEFAULT '[]',
        colors          JSONB DEFAULT '[]',
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id                SERIAL PRIMARY KEY,
        customer_name     TEXT NOT NULL,
        customer_phone    TEXT NOT NULL,
        customer_address  TEXT NOT NULL,
        customer_city     TEXT,
        status            TEXT NOT NULL DEFAULT 'pending',
        items             JSONB NOT NULL,
        total_amount      NUMERIC(10, 2) NOT NULL,
        discount_amount   NUMERIC(10, 2) DEFAULT 0,
        coupon_code       TEXT,
        notes             TEXT,
        payment_method    TEXT DEFAULT 'cod',
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id            SERIAL PRIMARY KEY,
        product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        customer_name TEXT NOT NULL,
        rating        INTEGER NOT NULL,
        comment       TEXT,
        approved      BOOLEAN NOT NULL DEFAULT FALSE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id                   SERIAL PRIMARY KEY,
        code                 TEXT NOT NULL UNIQUE,
        discount_percentage  INTEGER NOT NULL,
        active               BOOLEAN NOT NULL DEFAULT TRUE,
        expires_at           TIMESTAMPTZ,
        usage_limit          INTEGER,
        used_count           INTEGER NOT NULL DEFAULT 0,
        description          TEXT,
        created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        key         TEXT PRIMARY KEY,
        value       JSONB NOT NULL,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log("[migrate] ✅ All tables are up to date.");
  } catch (err) {
    console.error("[migrate] ❌ Migration error:", err);
    // Don't crash the server — tables may already exist or DB may be temporarily unavailable
  } finally {
    await pool.end();
  }
}
