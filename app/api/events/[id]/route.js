import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function PUT(request, { params }) {
  try {
    // Admin only check
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { title, description, image_url, link_url, is_active } = body;

    // Build update object dynamically
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (link_url !== undefined) updateData.link_url = link_url;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[events PUT error]:', error.message);
      return Response.json({ success: false, error: 'Failed to update event record' }, { status: 500 });
    }

    return Response.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('[events PUT unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while updating event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Admin only check
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[events DELETE error]:', error.message);
      return Response.json({ success: false, error: 'Failed to delete event record' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('[events DELETE unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while deleting event' }, { status: 500 });
  }
}
