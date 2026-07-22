import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

const VALID_CATEGORIES = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets', 'custom'];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category.toLowerCase());
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Next.js response range: [start, end] inclusive
    const startRange = Math.max(0, offset);
    const endRange = startRange + Math.max(1, limit) - 1;

    const { data: products, error } = await query
      .order('created_at', { ascending: false })
      .range(startRange, endRange);

    if (error) {
      console.error('[products GET query error]:', error.message);
      return Response.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }

    const processedProducts = (products || []).map(p => {
      let is_bestseller = !!p.is_bestseller;
      let metal = p.metal || '';
      let stone = p.stone || '';
      let gender = p.gender || '';
      let descText = p.description || '';
      
      if (p.description && p.description.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(p.description);
          descText = parsed.text || '';
          if (parsed.is_bestseller !== undefined) is_bestseller = !!parsed.is_bestseller;
          if (parsed.metal) metal = parsed.metal;
          if (parsed.stone) stone = parsed.stone;
          if (parsed.gender) gender = parsed.gender;
        } catch (e) {
          // Fallback
        }
      }
      return {
        ...p,
        description: descText,
        is_bestseller,
        isBestSeller: is_bestseller,
        metal,
        stone,
        gender
      };
    });

    return Response.json({
      success: true,
      products: processedProducts
    });
  } catch (error) {
    console.error('[products GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1. Authorize Admin
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    // 2. Parse Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const {
      name,
      description,
      price,
      original_price,
      category,
      weight_grams,
      purity,
      stock,
      is_custom,
      images,
      is_bestseller,
      metal,
      stone,
      gender
    } = body;

    // 3. Validation
    if (!name) {
      return Response.json({ success: false, error: 'Product name is required' }, { status: 400 });
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
      return Response.json({ success: false, error: 'Valid product price is required' }, { status: 400 });
    }
    if (category && !VALID_CATEGORIES.includes(category.toLowerCase())) {
      return Response.json({ success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }

    // Serialize details to description column
    const descriptionJson = JSON.stringify({
      text: description || '',
      is_bestseller: !!is_bestseller,
      metal: metal || '',
      stone: stone || '',
      gender: gender || ''
    });

    // 4. Insert Product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description: descriptionJson,
        price: Number(price),
        original_price: original_price ? Number(original_price) : null,
        category: category ? category.toLowerCase() : null,
        weight_grams: weight_grams ? Number(weight_grams) : null,
        purity: purity || '925',
        stock: stock !== undefined ? parseInt(stock, 10) : 0,
        is_custom: !!is_custom,
        images: Array.isArray(images) ? images : [],
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('[products POST error]:', error.message);
      return Response.json({ success: false, error: `Failed to create product record: ${error.message}` }, { status: 500 });
    }

    // De-serialize response
    let resDescText = '';
    let resIsBestseller = false;
    let resMetal = '';
    let resStone = '';
    let resGender = '';
    if (product.description && product.description.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(product.description);
        resDescText = parsed.text || '';
        resIsBestseller = !!parsed.is_bestseller;
        resMetal = parsed.metal || '';
        resStone = parsed.stone || '';
        resGender = parsed.gender || '';
      } catch (e) {}
    } else {
      resDescText = product.description || '';
    }

    return Response.json({
      success: true,
      product: {
        ...product,
        description: resDescText,
        is_bestseller: resIsBestseller,
        metal: resMetal,
        stone: resStone,
        gender: resGender
      }
    }, { status: 201 });
  } catch (error) {
    console.error('[products POST unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while creating product' }, { status: 500 });
  }
}
