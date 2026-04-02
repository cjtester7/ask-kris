// ─── Ask Kris — Subscribe Function ───────────────────────
// Version 5
// Routes: POST /api/subscribe
// 1. Saves lead to Google Sheets via Apps Script
// 2. Sends branded welcome email via Resend
// Environment variables required:
//   RESEND_API_KEY      — from resend.com
//   APPS_SCRIPT_URL     — from Step 1 Google Apps Script deployment
//   FROM_EMAIL          — verified sender e.g. kris@therealestateroundup.com

exports.handler = async (event) => {

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, email, source, question } = body;

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid email required' }) };
  }

  const firstName = name ? name.split(' ')[0] : '';

  // ─── 1. Save lead to Google Sheets ─────────────────────
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  if (appsScriptUrl) {
    try {
      const params = new URLSearchParams({
        action:   'addLead',
        name:     name   || '',
        email:    email,
        source:   source || 'chatbot',
        question: question || ''
      });
      await fetch(`${appsScriptUrl}?${params.toString()}`);
    } catch(e) {
      console.error('Sheets save error:', e.message);
      // Non-fatal — continue to send email even if sheet save fails
    }
  }

  // ─── 2. Send welcome email via Resend ──────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RESEND_API_KEY not configured in Netlify environment variables.' })
    };
  }

  const fromEmail   = process.env.FROM_EMAIL || 'kris@therealestateroundup.com';
  const greeting    = firstName ? `Hey ${firstName}!` : 'Hey!';
  const subjectLine = firstName
    ? `${firstName}, you're in! Your first question arrives tomorrow 🏠`
    : `You're in! Your first question arrives tomorrow 🏠`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#0a1628;border-radius:12px 12px 0 0;padding:28px 32px;border-bottom:3px solid #c9a84c;">
      <p style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">
        The Real Estate Roundup
      </p>
      <h1 style="color:#ffffff;font-size:22px;margin:0;font-family:Georgia,serif;font-weight:700;">
        Welcome to the Daily Question! 🎉
      </h1>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">

      <p style="color:#1a2440;font-size:16px;line-height:1.7;margin:0 0 20px;">
        ${greeting} It's Kris Haskins here.
      </p>

      <p style="color:#1a2440;font-size:15px;line-height:1.7;margin:0 0 20px;">
        You're now subscribed to the <strong>Question of the Day</strong> — one real estate investing question, every single morning. Answer it, learn from it, build wealth with it.
      </p>

      <!-- What to expect box -->
      <div style="background:#f5f0e8;border-left:4px solid #c9a84c;border-radius:0 8px 8px 0;padding:18px 20px;margin:0 0 24px;">
        <p style="color:#0a1628;font-size:14px;font-weight:700;margin:0 0 10px;">Here's what you can expect:</p>
        <p style="color:#1a2440;font-size:14px;line-height:1.7;margin:0 0 8px;">
          📅 <strong>Every morning</strong> — a new real estate question lands in your inbox
        </p>
        <p style="color:#1a2440;font-size:14px;line-height:1.7;margin:0 0 8px;">
          💡 <strong>Real answers</strong> — from my 20+ years of investing experience
        </p>
        <p style="color:#1a2440;font-size:14px;line-height:1.7;margin:0;">
          🏠 <strong>Free, always</strong> — no catch, just daily financial education
        </p>
      </div>

      <p style="color:#1a2440;font-size:15px;line-height:1.7;margin:0 0 24px;">
        While you're waiting for tomorrow's question, why not ask me anything right now? My AI assistant is trained on all my courses and videos — it's like having me in your corner 24/7.
      </p>

      <!-- CTA button -->
      <div style="text-align:center;margin:0 0 28px;">
        <a href="https://ask-kris.netlify.app/?chat=open"
           style="display:inline-block;background:#c9a84c;color:#0a1628;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;">
          Ask Kris a Question Now →
        </a>
      </div>

      <!-- Consultation nudge -->
      <div style="background:#0a1628;border-radius:10px;padding:20px 24px;text-align:center;">
        <p style="color:rgba(255,255,255,0.65);font-size:13px;margin:0 0 12px;line-height:1.6;">
          Got a specific deal you're analyzing? Before you pull the trigger,<br>
          let's make sure the numbers actually work.
        </p>
        <a href="https://www.therealestateroundup.com/one-time-consultation/"
           style="display:inline-block;background:#c9a84c;color:#0a1628;font-weight:700;font-size:13px;padding:10px 24px;border-radius:6px;text-decoration:none;">
          Book a 1-on-1 with Kris
        </a>
      </div>

    </div>

    <!-- Footer -->
    <p style="color:#aaa;font-size:11px;text-align:center;margin:16px 0 0;line-height:1.6;">
      © Kris Haskins · The Real Estate Roundup ·
      <a href="https://www.therealestateroundup.com" style="color:#aaa;">therealestateroundup.com</a>
      <br>You're receiving this because you subscribed at ask-kris.netlify.app.
    </p>

  </div>
</body>
</html>`;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from:    `Kris Haskins <${fromEmail}>`,
        to:      [email],
        subject: subjectLine,
        html:    emailHtml
      })
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email send failed', detail: resendData })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'ok', message: 'Lead saved and welcome email sent' })
    };

  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Resend API call failed', detail: err.message })
    };
  }
};
