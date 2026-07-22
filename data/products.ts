export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bangles' | 'Pendants';
  metal: string;
  stone: string;
  weight: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  collectionId: string;
  sizes?: number[];
  description: string;
  details: {
    productDetails: string;
    hallmark: string;
    delivery: string;
    care: string;
  };
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'celestial-solitaire-ring',
    name: 'Celestial Solitaire Ring',
    price: 78000,
    originalPrice: 92000,
    category: 'Rings',
    metal: 'Rhodium-Plated Silver',
    stone: 'Diamond',
    weight: '3.2g',
    images: ['/images/products/ring-2.jpg'],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isNew: true,
    isBestSeller: false,
    collectionId: 'the-serenity-collection',
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    description: 'A mesmerizing solitaire ring featuring a brilliant-cut diamond set in rhodium-plated sterling silver. The celestial-inspired design captures light from every angle, creating an ethereal sparkle.',
    details: {
      productDetails: 'Center stone: 0.50ct brilliant-cut diamond (VS1 clarity, F color). Band width: 2.2mm. Setting: Four-prong cathedral setting with micro-pavé accent diamonds on the band.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamond. Each piece comes with a certificate of authenticity and diamond grading report.',
      delivery: 'Complimentary insured shipping within India. Standard delivery: 5-7 business days. Express delivery: 2-3 business days (₹299). Free returns within 15 days.',
      care: 'Clean with a soft brush and mild soap solution. Store in the provided velvet box. Avoid contact with perfumes and chemicals. Professional cleaning recommended every 6 months.',
    },
  },
  {
    id: '2',
    slug: 'luna-diamond-bangle',
    name: 'Luna Diamond Bangle',
    price: 95000,
    category: 'Bangles',
    metal: 'Oxidized Sterling Silver',
    stone: 'Diamond',
    weight: '12.5g',
    images: ['/images/products/bangle-1.jpg'],
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    isBestSeller: true,
    collectionId: 'the-serenity-collection',
    description: 'The Luna bangle draws inspiration from moonlit nights with delicate diamond accents set along a graceful curve of oxidized sterling silver.',
    details: {
      productDetails: 'Total diamond weight: 1.20ct. 36 round brilliant-cut diamonds. Inner diameter: 62mm. Clasp: Hidden tongue-in-groove safety clasp.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamonds. Certificate of authenticity included.',
      delivery: 'Complimentary insured shipping within India. Standard delivery: 5-7 business days. Express delivery available.',
      care: 'Wipe with a soft lint-free cloth after each wear. Store separately to prevent scratching. Remove before swimming or exercising.',
    },
  },
  {
    id: '3',
    slug: 'celestial-solaire-ring',
    name: 'Celestial Solaire Ring',
    price: 78000,
    category: 'Rings',
    metal: 'Platinum-Plated Silver',
    stone: 'Diamond',
    weight: '3.8g',
    images: ['/images/products/ring-2.jpg'],
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
    isNew: true,
    isBestSeller: false,
    collectionId: 'the-serenity-collection',
    description: 'A sun-inspired solitaire in warm platinum-plated silver, featuring a brilliant-cut diamond surrounded by a halo of micro-pavé stones.',
    details: {
      productDetails: 'Center stone: 0.45ct brilliant-cut diamond (VS2 clarity, G color). Halo: 20 micro-pavé diamonds. Band: split-shank design.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamond with grading report.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days. Express: 2-3 business days (₹299).',
      care: 'Clean gently with warm soapy water. Store in provided box. Annual professional servicing recommended.',
    },
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: '4',
    slug: 'lina-diamond-earrings',
    name: 'Lina Diamond Earrings',
    price: 79000,
    category: 'Earrings',
    metal: '925 Sterling Silver',
    stone: 'Diamond',
    weight: '4.1g',
    images: ['/images/products/earring-1.jpg'],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    isNew: true,
    isBestSeller: true,
    collectionId: 'the-serenity-collection',
    description: 'Elegantly crafted drop earrings with cascading diamonds that catch the light beautifully with every movement.',
    details: {
      productDetails: 'Total diamond weight: 0.80ct per pair. Drop length: 32mm. Closure: Lever-back with safety catch.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamonds.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Store in individual compartments. Clean with professional jewellery cleaning solution.',
    },
  },
  {
    id: '5',
    slug: 'heritage-ruby-necklace',
    name: 'Heritage Ruby Necklace',
    price: 185000,
    originalPrice: 210000,
    category: 'Necklaces',
    metal: '925 Sterling Silver',
    stone: 'Ruby',
    weight: '18.3g',
    images: ['/images/products/necklace-1.jpg'],
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
    isNew: false,
    isBestSeller: true,
    collectionId: 'bridal-heritage',
    description: 'A showstopping heritage necklace featuring Burmese rubies set in an intricate sterling silver lattice, inspired by royal Indian jewellery traditions.',
    details: {
      productDetails: 'Center ruby: 2.5ct oval-cut natural Burmese ruby. Accent rubies: 8 round-cut stones totaling 3.2ct. Chain length: 18 inches with 2-inch extender.',
      hallmark: '925 Hallmarked Sterling Silver. GRS Certified Natural Ruby.',
      delivery: 'Complimentary insured shipping with signature required. Standard: 5-7 business days.',
      care: 'Rubies are durable but should be stored away from other gems. Clean with warm water and mild soap only.',
    },
  },
  {
    id: '6',
    slug: 'eternal-diamond-pendant',
    name: 'Eternal Diamond Pendant',
    price: 62000,
    category: 'Pendants',
    metal: '925 Sterling Silver',
    stone: 'Diamond',
    weight: '2.8g',
    images: ['/images/products/pendant-1.jpg'],
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    collectionId: 'diamond-classics',
    description: 'A timeless teardrop pendant featuring a solitaire diamond that floats delicately on an invisible-set sterling silver chain.',
    details: {
      productDetails: 'Diamond: 0.35ct pear-cut (VS1, E color). Chain: 16-inch with 2-inch extender. Setting: Bezel-set with polished edges.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamond.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Store flat in the provided velvet pouch. Avoid pulling on the chain. Clean monthly with soft cloth.',
    },
  },
  {
    id: '7',
    slug: 'bridal-kundan-set',
    name: 'Bridal Kundan Set',
    price: 320000,
    originalPrice: 365000,
    category: 'Necklaces',
    metal: '925 Sterling Silver',
    stone: 'Emerald',
    weight: '45.0g',
    images: ['/images/products/set-1.jpg'],
    rating: 4.9,
    reviewCount: 31,
    inStock: true,
    isNew: false,
    isBestSeller: true,
    collectionId: 'bridal-heritage',
    description: 'An opulent bridal kundan set featuring Colombian emeralds and uncut diamonds in a traditional polki setting, set in premium 925 sterling silver, handcrafted by master artisans.',
    details: {
      productDetails: 'Includes: Necklace, matching earrings, and maang tikka. Total emerald weight: 8.5ct. Uncut diamond weight: 12ct. Necklace length: 20 inches.',
      hallmark: '925 Hallmarked Sterling Silver. Gemstone certification from GIA.',
      delivery: 'White-glove insured delivery with appointment scheduling. Delivery: 7-10 business days.',
      care: 'Handle with extreme care. Professional cleaning only. Store in the provided luxury case with anti-tarnish cloth.',
    },
  },
  {
    id: '8',
    slug: 'sapphire-tennis-bracelet',
    name: 'Sapphire Tennis Bracelet',
    price: 145000,
    category: 'Bangles',
    metal: 'Platinum',
    stone: 'Sapphire',
    weight: '14.2g',
    images: ['/images/products/bracelet-1.jpg'],
    rating: 4.7,
    reviewCount: 55,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    collectionId: 'diamond-classics',
    description: 'An exquisite tennis bracelet alternating brilliant-cut blue sapphires with diamonds, set in platinum for enduring elegance.',
    details: {
      productDetails: 'Total sapphire weight: 4.8ct (24 stones). Total diamond weight: 2.4ct (24 stones). Length: 7 inches. Clasp: Box clasp with double safety.',
      hallmark: 'Platinum 950 Hallmarked. GRS Certified Natural Sapphires. IGI Certified Diamonds.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Sapphires are very durable. Clean with ultrasonic cleaner or warm soapy water. Store separately.',
    },
  },
  {
    id: '9',
    slug: 'diamond-cluster-studs',
    name: 'Diamond Cluster Studs',
    price: 42000,
    category: 'Earrings',
    metal: '925 Sterling Silver',
    stone: 'Diamond',
    weight: '2.4g',
    images: ['/images/products/earring-2.jpg'],
    rating: 4.5,
    reviewCount: 203,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    collectionId: 'diamond-classics',
    description: 'Classic cluster studs featuring seven round-cut diamonds arranged in a flower pattern, creating the illusion of a larger stone.',
    details: {
      productDetails: 'Total diamond weight: 0.50ct per pair. 14 round brilliant-cut diamonds. Diameter: 8mm. Closure: Push-back with silicone comfort stopper.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamonds.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Remove before sleeping. Clean with a soft brush. Store in the provided cushioned box.',
    },
  },
  {
    id: '10',
    slug: 'royal-emerald-ring',
    name: 'Royal Emerald Ring',
    price: 125000,
    category: 'Rings',
    metal: '925 Sterling Silver',
    stone: 'Emerald',
    weight: '5.6g',
    images: ['/images/products/ring-3.jpg'],
    rating: 4.8,
    reviewCount: 78,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    collectionId: 'bridal-heritage',
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    description: 'A regal emerald ring inspired by Mughal jewellery, featuring a vivid green emerald-cut Colombian emerald flanked by trillion-cut diamonds set in sterling silver.',
    details: {
      productDetails: 'Center stone: 1.8ct emerald-cut Colombian emerald. Side stones: 2 trillion-cut diamonds (0.30ct each). Band: Engraved paisley pattern.',
      hallmark: '925 Hallmarked Sterling Silver. GIA Certified Natural Emerald.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Emeralds are delicate — avoid ultrasonic cleaners. Clean with a damp cloth only. Oil treatment may be needed periodically.',
    },
  },
  {
    id: '11',
    slug: 'cascade-pearl-necklace',
    name: 'Cascade Pearl Necklace',
    price: 68000,
    category: 'Necklaces',
    metal: '925 Sterling Silver',
    stone: 'Diamond',
    weight: '8.9g',
    images: ['/images/products/necklace-2.jpg'],
    rating: 4.6,
    reviewCount: 112,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    collectionId: 'diamond-classics',
    description: 'A refined cascade necklace with South Sea pearls and diamond-studded links, perfect for elegant evening occasions.',
    details: {
      productDetails: '7 South Sea pearls (8-10mm). Diamond links: 0.60ct total. Chain length: 17 inches with lobster clasp.',
      hallmark: '925 Hallmarked Sterling Silver. Pearls certified by GIA.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Pearls are organic gems — keep away from chemicals, perfume, and hair spray. Wipe with soft cloth after each wear.',
    },
  },
  {
    id: '12',
    slug: 'twisted-silver-bangle',
    name: 'Twisted Silver Bangle',
    price: 55000,
    category: 'Bangles',
    metal: '925 Sterling Silver',
    stone: 'Diamond',
    weight: '10.2g',
    images: ['/images/products/bangle-2.jpg'],
    rating: 4.4,
    reviewCount: 167,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    collectionId: 'diamond-classics',
    description: 'A contemporary twisted bangle in sterling silver with subtle diamond accents at the crossover points, blending tradition with modernity.',
    details: {
      productDetails: 'Width: 4mm at widest point. Diamond accents: 0.15ct total (6 stones). Inner diameter: 64mm. Design: Twisted crossover with satin and polish finish.',
      hallmark: '925 Hallmarked Sterling Silver. IGI Certified Diamonds.',
      delivery: 'Complimentary insured shipping. Standard: 5-7 business days.',
      care: 'Store in the provided anti-tarnish pouch. Polish with a jewellery cloth monthly. Avoid bending.',
    },
  },
  {
    id: '13',
    slug: 'gold-plated-925-silver-lakshmi-nakshi-necklace',
    name: 'Gold Plated 925 Silver Lakshmi Nakshi Necklace',
    price: 20000,
    category: 'Necklaces',
    metal: 'Gold Plated 925 Silver',
    stone: 'Semi Precious Pink & Emerald CZ',
    weight: '56.5g',
    images: [
      '/uploads/1784046219328-Gold_deity_necklace_on_stand_202607142150.jpeg',
      '/uploads/1784046219305-Deity_pendant_on_gold_necklace_202607142150.jpeg',
      '/uploads/1784046219284-Gold_necklace_on_white_silk_202607142150.jpeg',
      '/uploads/1784046219317-Gold_necklace_on_marble_surface_202607142150.jpeg'
    ],
    rating: 5.0,
    reviewCount: 48,
    inStock: true,
    isNew: true,
    isBestSeller: true,
    collectionId: 'bridal-heritage',
    description: 'Measurements : Total length of the Neckpiece 24Cm & Width 2.5Cm Approx. Pendant Length 8cm & Width 6.5cm With including Green Beads & Water pearls. Stones / Pearls : Semi Precious Pink & Emerald CZ cab Cut Stones & Fresh Water Pearls & Green beads. Stones Color : Pink & Green Beads & White Pearls. Weight : 56.5grams Approx. Closure : Necklace comes with Adjustable Thread.',
    details: {
      productDetails: 'Measurements : Total length of the Neckpiece 24Cm & Width 2.5Cm Approx. Pendant Length 8cm & Width 6.5cm With including Green Beads & Water pearls. Stones / Pearls : Semi Precious Pink & Emerald CZ cab Cut Stones & Fresh Water Pearls & Green beads. Stones Color : Pink & Green Beads & White Pearls. Weight : 56.5grams Approx. Closure : Necklace comes with Adjustable Thread.',
      hallmark: '925 Hallmarked Sterling Silver. Certified Craftsmanship.',
      delivery: 'Complimentary insured shipping within India.',
      care: 'Avoid direct contact with perfumes, hairsprays, and harsh chemicals.',
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByCollection(collectionId: string): Product[] {
  return products.filter((p) => p.collectionId === collectionId);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  return products
    .filter((p) => p.id !== productId && (p.category === product.category || p.collectionId === product.collectionId))
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}
