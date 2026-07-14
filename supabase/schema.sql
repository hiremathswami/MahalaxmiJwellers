-- Products table
CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category      TEXT CHECK (category IN ('rings','necklaces','earrings','bracelets','anklets','custom')),
  weight_grams  NUMERIC(6,2),
  purity        TEXT DEFAULT '925',
  stock         INTEGER DEFAULT 0,
  is_custom     BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  images        TEXT[],          -- array of Supabase Storage URLs
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name       TEXT,
  customer_email      TEXT,
  customer_phone      TEXT,
  items               JSONB NOT NULL,   -- [{product_id, name, price, quantity, image}]
  total_amount        NUMERIC(10,2),
  address_line1       TEXT,
  address_city        TEXT,
  address_state       TEXT,
  address_pincode     TEXT,
  status              TEXT DEFAULT 'pending',
  payment_id          TEXT,             -- Razorpay payment ID
  razorpay_order_id   TEXT,
  tracking_number     TEXT,
  notes               TEXT,
  address             JSONB,            -- JSON representation of shipping address
  subtotal            NUMERIC(10,2),
  shipping            NUMERIC(10,2),
  gst                 NUMERIC(10,2),
  total               NUMERIC(10,2),
  shipping_method     TEXT,
  payment_method      TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Custom order requests table
CREATE TABLE custom_requests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  jewellery_type TEXT,
  budget        TEXT,
  description   TEXT,
  reference_image TEXT,                 -- Supabase Storage URL
  status        TEXT DEFAULT 'new'
                CHECK (status IN ('new','in_discussion','quoted','confirmed','rejected')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read, only admin can write
CREATE POLICY "Public read products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: only authenticated admin can read all
CREATE POLICY "Admin read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anyone can insert an order (after payment)
CREATE POLICY "Public insert orders"
  ON orders FOR INSERT WITH CHECK (true);

-- Custom requests: same
CREATE POLICY "Public insert custom requests"
  ON custom_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read custom requests"
  ON custom_requests FOR SELECT
  USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Contact messages table
CREATE TABLE contact_messages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  subject       TEXT,
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public insert contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read contact messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');


-- Profiles table
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Public insert profiles"
  ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users update profiles"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin full access profiles"
  ON profiles FOR ALL USING (auth.role() = 'authenticated');


