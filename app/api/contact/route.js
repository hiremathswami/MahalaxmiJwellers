import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function GET(request) {
  try {
    // 1. Authorize Admin
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    // 2. Fetch Messages
    const { data: messages, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[contact GET error]:', error.message);
      return Response.json({ success: false, error: 'Failed to fetch contact messages' }, { status: 500 });
    }

    return Response.json({
      success: true,
      messages: messages || []
    });
  } catch (error) {
    console.error('[contact GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Parse JSON Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return Response.json({
        success: false,
        error: 'Name, email, and message are required fields'
      }, { status: 400 });
    }

    // Insert Message
    const { data: contactMessage, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message
      })
      .select()
      .single();

    if (error) {
      console.error('[contact POST error]:', error.message);
      return Response.json({ success: false, error: 'Failed to save contact message' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: contactMessage
    }, { status: 201 });
  } catch (error) {
    console.error('[contact POST unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while saving message' }, { status: 500 });
  }
}
