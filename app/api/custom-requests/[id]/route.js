import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function GET(request, { params }) {
  try {
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    const { data: customRequest, error } = await supabaseAdmin
      .from('custom_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[custom-requests/[id] GET query error]:', error.message);
      return Response.json({ success: false, error: 'Failed to retrieve custom request details' }, { status: 500 });
    }

    if (!customRequest) {
      return Response.json({ success: false, error: 'Custom request not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      request: customRequest
    });
  } catch (error) {
    console.error('[custom-requests/[id] GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { status, notes } = body;

    // Verify request exists
    const { data: existingRequest, error: findError } = await supabaseAdmin
      .from('custom_requests')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (findError) {
      console.error('[custom-requests/[id] PUT find error]:', findError.message);
      return Response.json({ success: false, error: 'Error checking request existence' }, { status: 500 });
    }

    if (!existingRequest) {
      return Response.json({ success: false, error: 'Custom request not found' }, { status: 404 });
    }

    // Build updates
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data: updatedRequest, error: updateError } = await supabaseAdmin
      .from('custom_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[custom-requests/[id] PUT update error]:', updateError.message);
      return Response.json({ success: false, error: 'Failed to update custom request details' }, { status: 500 });
    }

    return Response.json({
      success: true,
      request: updatedRequest
    });
  } catch (error) {
    console.error('[custom-requests/[id] PUT unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
