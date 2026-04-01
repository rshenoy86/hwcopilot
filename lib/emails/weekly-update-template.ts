export interface WeeklyUpdateData {
  updates: { emoji: string; title: string; description: string }[];
  previewText?: string;
}

export function weeklyUpdateHtml(data: WeeklyUpdateData): string {
  const { updates, previewText = "See what's new in GuruBuddy this week 🎉" } = data;

  const updateCards = updates
    .map(
      ({ emoji, title, description }) => `
    <tr>
      <td style="padding: 0 0 16px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
          style="background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding: 20px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="48" valign="top" style="padding-right: 16px;">
                    <div style="width:48px; height:48px; background:#fef9c3; border-radius:12px;
                      display:flex; align-items:center; justify-content:center;
                      font-size:26px; text-align:center; line-height:48px;">
                      ${emoji}
                    </div>
                  </td>
                  <td valign="top">
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700;
                      color:#111827; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      ${title}
                    </p>
                    <p style="margin:0; font-size:14px; color:#6b7280; line-height:1.6;
                      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      ${description}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>GuruBuddy Weekly Update</title>
  <!--[if mso]><style>td,th{border-collapse:collapse}</style><![endif]-->
</head>
<body style="margin:0; padding:0; background:#f3f4f6; -webkit-text-size-adjust:100%;">

  <!-- Preview text (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; color:#f3f4f6;">
    ${previewText}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
  </div>

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Card -->
        <table cellpadding="0" cellspacing="0" border="0" width="600"
          style="max-width:600px; width:100%; background:#ffffff; border-radius:20px;
          box-shadow:0 4px 24px rgba(0,0,0,0.07); overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
              padding: 36px 40px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:32px;">🧠</p>
              <h1 style="margin:0; font-size:28px; font-weight:800; color:#ffffff;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                letter-spacing:-0.5px;">
                GuruBuddy
              </h1>
              <p style="margin:8px 0 0 0; font-size:15px; color:rgba(255,255,255,0.85);
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                Your weekly product update
              </p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <h2 style="margin:0 0 12px 0; font-size:22px; font-weight:700; color:#111827;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                🎉 What's new this week
              </h2>
              <p style="margin:0; font-size:15px; color:#6b7280; line-height:1.7;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                We've been listening to your feedback and shipping fast. Here's everything
                that landed in GuruBuddy this week — all to make worksheets more fun,
                faster, and more personal for your kids.
              </p>
            </td>
          </tr>

          <!-- Update cards -->
          <tr>
            <td style="padding: 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${updateCards}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 32px 40px;" align="center">
              <a href="https://gurubuddy.ai/worksheets/new"
                style="display:inline-block; background:#f97316; color:#ffffff;
                font-size:16px; font-weight:700; text-decoration:none;
                padding:14px 36px; border-radius:50px;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                Try the new features →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0;" />
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 28px 40px;">
              <p style="margin:0; font-size:15px; color:#374151; line-height:1.7;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                Thanks for being part of GuruBuddy. Every feature we ship comes directly
                from parent feedback — so keep it coming. Just reply to this email. 🙏
              </p>
              <p style="margin:16px 0 0 0; font-size:15px; color:#374151;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                — Rajiv &amp; the GuruBuddy team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:24px 40px; text-align:center;
              border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px 0; font-size:12px; color:#9ca3af;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                GuruBuddy · Personalized K-8 worksheets in 30 seconds
              </p>
              <p style="margin:0; font-size:12px; color:#9ca3af;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                You're receiving this because you signed up for GuruBuddy.
                <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
