export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  productCount: number;
}

export const collections: Collection[] = [
  {
    id: 'the-serenity-collection',
    slug: 'the-serenity-collection',
    name: 'The Serenity Collection',
    tagline: 'Where tranquility meets timeless elegance',
    description: 'Inspired by the calm of moonlit waters, The Serenity Collection features ethereal designs in 925 sterling silver and platinum, adorned with brilliant-cut diamonds. Each piece is crafted to evoke a sense of peaceful luxury — understated yet unforgettable.',
    heroImage: '/images/collections/serenity-hero.jpg',
    productCount: 4,
  },
  {
    id: 'diamond-classics',
    slug: 'diamond-classics',
    name: 'Diamond Classics',
    tagline: 'Timeless brilliance, perfected',
    description: 'Our Diamond Classics collection celebrates the enduring beauty of the world\'s most coveted gemstone. From solitaire pendants to tennis bracelets, each piece showcases exceptional craftsmanship with diamonds selected for superior cut, clarity, and fire.',
    heroImage: '/images/collections/classics-hero.jpg',
    productCount: 4,
  },
  {
    id: 'bridal-heritage',
    slug: 'bridal-heritage',
    name: 'Bridal Heritage',
    tagline: 'For the most precious moments of your life',
    description: 'Drawing from centuries of Indian jewellery artistry, the Bridal Heritage collection presents opulent pieces for the modern bride. Featuring kundan, polki, and meenakari techniques with precious rubies, emeralds, and uncut diamonds set in premium hallmarked sterling silver.',
    heroImage: '/images/collections/bridal-hero.jpg',
    productCount: 4,
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
