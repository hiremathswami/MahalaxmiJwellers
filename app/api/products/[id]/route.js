import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

const VALID_CATEGORIES = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets', 'custom'];

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('[products/[id] GET query error]:', error.message);
      return Response.json({ success: false, error: 'Failed to retrieve product details' }, { status: 500 });
    }

    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // De-serialize description fields
    let descText = product.description || '';
    let is_bestseller = false;
    let metal = '';
    let stone = '';
    let gender = '';

    if (product.description && product.description.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(product.description);
        descText = parsed.text || '';
        is_bestseller = !!parsed.is_bestseller;
        metal = parsed.metal || '';
        stone = parsed.stone || '';
        gender = parsed.gender || '';
      } catch (e) {
        // Fallback
      }
    }

    return Response.json({
      success: true,
      product: {
        ...product,
        description: descText,
        is_bestseller,
        isBestSeller: is_bestseller,
        metal,
        stone,
        gender
      }
    });
  } catch (error) {
    console.error('[products/[id] GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // 1. Authorize Admin
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    // 2. Parse Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    // 3. Check if product exists (select description to preserve existing details)
    const { data: existingProduct, error: findError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (findError) {
      console.error('[products/[id] PUT find error]:', findError.message);
      return Response.json({ success: false, error: 'Error searching for product' }, { status: 500 });
    }

    if (!existingProduct) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Extract current details to preserve fields if not provided in PUT
    let currentDescText = '';
    let currentIsBestseller = false;
    let currentMetal = '';
    let currentStone = '';
    let currentGender = '';

    if (existingProduct.description && existingProduct.description.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(existingProduct.description);
        currentDescText = parsed.text || '';
        currentIsBestseller = !!parsed.is_bestseller;
        currentMetal = parsed.metal || '';
        currentStone = parsed.stone || '';
        currentGender = parsed.gender || '';
      } catch (e) {}
    } else {
      currentDescText = existingProduct.description || '';
    }

    const updatedDesc = body.description !== undefined ? (body.description || '') : currentDescText;
    const updatedIsBestseller = body.is_bestseller !== undefined ? !!body.is_bestseller : currentIsBestseller;
    const updatedMetal = body.metal !== undefined ? (body.metal || '') : currentMetal;
    const updatedStone = body.stone !== undefined ? (body.stone || '') : currentStone;
    const updatedGender = body.gender !== undefined ? (body.gender || '') : currentGender;

    const descriptionJson = JSON.stringify({
      text: updatedDesc,
      is_bestseller: updatedIsBestseller,
      metal: updatedMetal,
      stone: updatedStone,
      gender: updatedGender
    });

    // 4. Extract fields to update
    const updates = {};
    if (body.name !== undefined) updates.name = body.name;
    updates.description = descriptionJson;
    if (body.price !== undefined) {
      if (isNaN(Number(body.price))) {
        return Response.json({ success: false, error: 'Invalid price value' }, { status: 400 });
      }
      updates.price = Number(body.price);
    }
    if (body.original_price !== undefined) {
      updates.original_price = body.original_price ? Number(body.original_price) : null;
    }
    if (body.category !== undefined) {
      if (body.category && !VALID_CATEGORIES.includes(body.category.toLowerCase())) {
        return Response.json({ success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
      }
      updates.category = body.category ? body.category.toLowerCase() : null;
    }
    if (body.weight_grams !== undefined) {
      updates.weight_grams = body.weight_grams ? Number(body.weight_grams) : null;
    }
    if (body.purity !== undefined) updates.purity = body.purity;
    if (body.stock !== undefined) updates.stock = parseInt(body.stock, 10);
    if (body.is_custom !== undefined) updates.is_custom = !!body.is_custom;
    if (body.is_active !== undefined) updates.is_active = !!body.is_active;
    if (body.images !== undefined) {
      updates.images = Array.isArray(body.images) ? body.images : [];
    }

    // 5. Perform Update
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[products/[id] PUT update error]:', updateError.message);
      return Response.json({ success: false, error: `Failed to update product details: ${updateError.message}` }, { status: 500 });
    }

    // De-serialize response before returning
    let resDescText = '';
    let resIsBestseller = false;
    let resMetal = '';
    let resStone = '';
    let resGender = '';
    if (updatedProduct.description && updatedProduct.description.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(updatedProduct.description);
        resDescText = parsed.text || '';
        resIsBestseller = !!parsed.is_bestseller;
        resMetal = parsed.metal || '';
        resStone = parsed.stone || '';
        resGender = parsed.gender || '';
      } catch (e) {}
    } else {
      resDescText = updatedProduct.description || '';
    }

    return Response.json({
      success: true,
      product: {
        ...updatedProduct,
        description: resDescText,
        is_bestseller: resIsBestseller,
        metal: resMetal,
        stone: resStone,
        gender: resGender
      }
    });
  } catch (error) {
    console.error('[products/[id] PUT unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while updating product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // 1. Authorize Admin
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    // 2. Perform Soft Delete
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[products/[id] DELETE error]:', error.message);
      return Response.json({ success: false, error: 'Failed to deactivate product' }, { status: 500 });
    }

    if (!data) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Product deactivated'
    });
  } catch (error) {
    console.error('[products/[id] DELETE unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while deleting product' }, { status: 500 });
  }
}
