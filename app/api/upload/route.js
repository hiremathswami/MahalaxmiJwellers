import { supabaseAdmin } from '@/lib/supabaseAdmin';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    // 1. Check if user is an admin by validating Authorization header
    let isAdmin = false;
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && user) {
        isAdmin = true;
      }
    }

    // 2. Parse Form Data
    let formData;
    try {
      formData = await request.formData();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file');
    if (!file) {
      return Response.json({ success: false, error: 'No file field found in form data' }, { status: 400 });
    }

    // 3. Prepare File Path based on user permissions
    const filename = file.name || 'unnamed-image';
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_'); // sanitize filename
    const timestamp = Date.now();
    
    // Store in different directories based on admin status
    const folder = isAdmin ? 'products' : 'custom-requests';
    const filePath = `${folder}/${timestamp}-${cleanFilename}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 4. Upload to Supabase Storage with local filesystem fallback
    let publicUrl = '';
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('jewellery-images')
        .upload(filePath, fileBuffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      // Retrieve Public URL from Supabase Storage
      const { data: { publicUrl: retrievedUrl } } = supabaseAdmin.storage
        .from('jewellery-images')
        .getPublicUrl(filePath);
      publicUrl = retrievedUrl;
    } catch (err) {
      console.warn('[upload storage warning - falling back to local storage]:', err.message);
      
      // Save locally to public/uploads
      const localDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      
      const localFilename = `${timestamp}-${cleanFilename}`;
      const localFilePath = path.join(localDir, localFilename);
      fs.writeFileSync(localFilePath, fileBuffer);
      
      publicUrl = `/uploads/${localFilename}`;
    }

    return Response.json({
      success: true,
      url: publicUrl
    });
  } catch (error) {
    console.error('[upload unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected upload error occurred' }, { status: 500 });
  }
}
