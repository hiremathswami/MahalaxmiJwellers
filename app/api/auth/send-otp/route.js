export async function POST(req) {
  try {
    const { phone } = await req.json();
    // Normalize phone number (strip +91 prefix or whitespace for validation)
    const normalizedPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '').trim();

    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      return Response.json({ error: "Invalid Indian phone number. Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY || process.env.mahalaxmi_TWO_FACTOR_API_KEY || 'fa3fb071-85a9-11f1-908b-0200cd936042';
    if (!apiKey) {
      console.warn("TWO_FACTOR_API_KEY is not defined. Falling back to mock OTP (code: 123456).");
      const mockSessionId = `mock_session_${Date.now()}`;
      return Response.json({ sessionId: mockSessionId, isMock: true });
    }

    // Send SMS OTP via 2Factor SMS Gateway API
    const res = await fetch(
      `https://2factor.in/API/V1/${apiKey}/SMS/+91${normalizedPhone}/AUTOGEN`
    );
    const data = await res.json();

    if (data.Status !== "Success") {
      console.error("[2Factor SMS send error]:", data);
      return Response.json({ error: data.Details || "Failed to send SMS OTP. Please verify phone number or SMS credits." }, { status: 500 });
    }

    return Response.json({ sessionId: data.Details, isSms: true });
  } catch (err) {
    console.error('Error in send-otp API:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
