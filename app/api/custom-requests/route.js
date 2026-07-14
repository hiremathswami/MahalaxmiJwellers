import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function GET(request) {
  try {
    // Admin only
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { data: requests, error } = await supabaseAdmin
      .from('custom_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[custom-requests GET query error]:', error.message);
      return Response.json({ success: false, error: 'Failed to fetch custom requests' }, { status: 500 });
    }

    return Response.json({
      success: true,
      requests: requests || []
    });
  } catch (error) {
    console.error('[custom-requests GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching custom requests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const {
      name,
      phone,
      email,
      jewellery_type,
      budget,
      description,
      reference_image
    } = body;

    // Validate name and phone
    if (!name || !phone) {
      return Response.json({ success: false, error: 'Name and phone number are required' }, { status: 400 });
    }

    // Insert request
    const { data: customRequest, error } = await supabaseAdmin
      .from('custom_requests')
      .insert({
        name,
        phone,
        email: email || null,
        jewellery_type: jewellery_type || null,
        budget: budget || null,
        description: description || null,
        reference_image: reference_image || null,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('[custom-requests POST error]:', error.message);
      return Response.json({ success: false, error: 'Failed to save custom request details' }, { status: 500 });
    }

    return Response.json({
      success: true,
      request: customRequest
    }, { status: 201 });
  } catch (error) {
    console.error('[custom-requests POST unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while saving custom request' }, { status: 500 });
  }
}
