import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function GET(request) {
  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[events GET query error]:', error.message);
      // Check if it's a table missing error (PGRST205 or relation does not exist)
      const isTableMissing = error.code === 'PGRST205' || 
                             error.message?.includes('relation "events" does not exist') ||
                             error.message?.includes('could not find the table');
      
      if (isTableMissing) {
        return Response.json({ 
          success: false, 
          error: 'Events table not found. Please run the SQL script in your Supabase SQL editor to create the events table.' 
        }, { status: 200 }); // Return 200 to prevent Next.js client-side error overlay crash
      }
      return Response.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
    }

    return Response.json({
      success: true,
      events: events || []
    });
  } catch (error) {
    console.error('[events GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Admin only check for event creation
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { title, description, image_url, link_url, is_active } = body;

    if (!title || !image_url) {
      return Response.json({ success: false, error: 'Title and Banner Image URL are required' }, { status: 400 });
    }

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        description: description || null,
        image_url,
        link_url: link_url || null,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (error) {
      console.error('[events POST error]:', error.message);
      return Response.json({ success: false, error: 'Failed to create event record' }, { status: 500 });
    }

    return Response.json({
      success: true,
      event
    }, { status: 201 });
  } catch (error) {
    console.error('[events POST unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while creating event' }, { status: 500 });
  }
}
