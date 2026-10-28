-- Run after 003_policies.sql.
-- Seed data for local/demo use. Safe to re-run (uses ON CONFLICT DO NOTHING).
-- This is also the pattern to follow for adding your own catalog data later:
-- insert categories first, then insert products joined to the category slug.

insert into public.categories (name, slug) values
  ('Beauty', 'beauty'),
  ('Fragrances', 'fragrances'),
  ('Furniture', 'furniture'),
  ('Groceries', 'groceries')
on conflict (slug) do nothing;

insert into public.products (title, description, price, image_url, category_id, stock, sku)
select
  v.title,
  v.description,
  v.price,
  v.image_url,
  c.id,
  v.stock,
  v.sku
from (
  values
    (
      'Essence Mascara Lash Princess',
      'Volumizing and lengthening cruelty-free mascara for dramatic lashes.',
      9.99,
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
      'beauty', 99, 'BEA-ESS-001'
    ),
    (
      'Eyeshadow Palette with Mirror',
      'Versatile eyeshadow shades with a built-in mirror for on-the-go looks.',
      19.99,
      'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp',
      'beauty', 34, 'BEA-GLA-002'
    ),
    (
      'Powder Canister',
      'Finely milled translucent setting powder for a smooth matte finish.',
      14.99,
      'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
      'beauty', 89, 'BEA-VEL-003'
    ),
    (
      'Red Lipstick',
      'Bold, creamy and long-lasting classic red lipstick.',
      12.99,
      'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp',
      'beauty', 91, 'BEA-CHI-004'
    ),
    (
      'Red Nail Polish',
      'Glossy, quick-drying red nail polish with a salon finish.',
      8.99,
      'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp',
      'beauty', 79, 'BEA-NAI-005'
    ),
    (
      'Calvin Klein CK One',
      'A classic unisex fragrance with fresh citrus notes.',
      49.99,
      'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp',
      'fragrances', 50, 'FRA-CAL-001'
    ),
    (
      'Chanel Coco Noir Eau De',
      'An elegant and mysterious fragrance with notes of rose and sandalwood.',
      129.99,
      'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp',
      'fragrances', 20, 'FRA-CHA-002'
    ),
    (
      'Annibale Colombo Bed',
      'A luxurious bed frame crafted from solid wood for ultimate comfort.',
      1899.99,
      'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp',
      'furniture', 10, 'FUR-ANN-001'
    ),
    (
      'Bedside Table African Cherry',
      'Elegant bedside table with a rich African cherry finish.',
      299.99,
      'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp',
      'furniture', 15, 'FUR-BED-002'
    ),
    (
      'Apple',
      'Fresh and crisp red apples, sold per kilogram.',
      3.49,
      'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp',
      'groceries', 200, 'GRO-APP-001'
    ),
    (
      'Beef Steak',
      'Premium cut beef steak, perfect for grilling.',
      12.99,
      'https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp',
      'groceries', 60, 'GRO-BEE-002'
    )
) as v(title, description, price, image_url, category_slug, stock, sku)
join public.categories c on c.slug = v.category_slug
on conflict (sku) do nothing;
