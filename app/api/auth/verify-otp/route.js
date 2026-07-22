export async function POST(req) {
  try {
    const { sessionId, otp } = await req.json();

    // Check if it is a mock session (development fallback)
    if (sessionId && sessionId.startsWith('mock_session_')) {
      if (otp === '123456') {
        return Response.json({ verified: true });
      }
      return Response.json({ verified: false, error: "Incorrect or expired OTP" }, { status: 400 });
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY || process.env.mahalaxmi_TWO_FACTOR_API_KEY || 'fa3fb071-85a9-11f1-908b-0200cd936042';
    if (!apiKey) {
      return Response.json({ error: "SMS Provider API Key is not configured." }, { status: 500 });
    }

    const res = await fetch(
      `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`
    );
    const data = await res.json();

    if (data.Status === "Success" && data.Details === "OTP Matched") {
      return Response.json({ verified: true });
    }

    return Response.json({ verified: false, error: "Incorrect or expired OTP" }, { status: 400 });
  } catch (err) {
    console.error('Error in verify-otp API:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
