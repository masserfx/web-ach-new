import { Resend } from 'resend';

// Lazy initialization - only create Resend client if API key is available
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is not set. Email functionality will be disabled.');
    return null;
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

interface NewLeadEmailParams {
  lead: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    propertyType?: string;
    propertySize?: number;
    budgetRange?: string;
    urgency?: string;
    projectDescription?: string;
  };
}

interface CustomerConfirmationParams {
  lead: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Email template helpers
const formatPropertyType = (type?: string) => {
  const types: Record<string, string> = {
    rodinny_dum: 'Rodinný dům',
    bytovy_dum: 'Bytový dům',
    firma: 'Firma',
    developer: 'Developer',
  };
  return type ? types[type] || type : 'Neuvedeno';
};

const formatUrgency = (urgency?: string) => {
  const urgencies: Record<string, string> = {
    immediate: 'Co nejdříve',
    this_month: 'Tento měsíc',
    this_quarter: 'Toto čtvrtletí',
    planning: 'Plánování',
  };
  return urgency ? urgencies[urgency] || urgency : 'Neuvedeno';
};

export async function sendNewLeadNotification({ lead }: NewLeadEmailParams) {
  try {
    const resendClient = getResendClient();

    if (!resendClient) {
      console.warn('⚠️ Resend client not available. Skipping email notification.');
      return { success: false, error: 'Email service not configured' };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'info@ac-heating.cz';

    await resendClient.emails.send({
      from: 'AC Heating <noreply@ac-heating.cz>',
      to: adminEmail,
      subject: `🔔 Nový lead: ${lead.firstName} ${lead.lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #DC2626 0%, #EA580C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .info-block { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #DC2626; }
              .info-label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
              .info-value { color: #111827; font-size: 16px; }
              .button { display: inline-block; background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🔔 Nový Lead!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Právě dorazila nová poptávka</p>
              </div>
              
              <div class="content">
                <div class="info-block">
                  <div class="info-label">Jméno</div>
                  <div class="info-value">${lead.firstName} ${lead.lastName}</div>
                </div>

                <div class="info-block">
                  <div class="info-label">Email</div>
                  <div class="info-value"><a href="mailto:${lead.email}">${lead.email}</a></div>
                </div>

                <div class="info-block">
                  <div class="info-label">Telefon</div>
                  <div class="info-value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
                </div>

                ${lead.city ? `
                <div class="info-block">
                  <div class="info-label">Město</div>
                  <div class="info-value">${lead.city}</div>
                </div>
                ` : ''}

                ${lead.propertyType ? `
                <div class="info-block">
                  <div class="info-label">Typ objektu</div>
                  <div class="info-value">${formatPropertyType(lead.propertyType)}${lead.propertySize ? ` (${lead.propertySize} m²)` : ''}</div>
                </div>
                ` : ''}

                ${lead.budgetRange ? `
                <div class="info-block">
                  <div class="info-label">Rozpočet</div>
                  <div class="info-value">${lead.budgetRange}</div>
                </div>
                ` : ''}

                ${lead.urgency ? `
                <div class="info-block">
                  <div class="info-label">Časový rámec</div>
                  <div class="info-value">${formatUrgency(lead.urgency)}</div>
                </div>
                ` : ''}

                ${lead.projectDescription ? `
                <div class="info-block">
                  <div class="info-label">Popis projektu</div>
                  <div class="info-value">${lead.projectDescription}</div>
                </div>
                ` : ''}

                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://91.99.126.53:3102/admin/leads" class="button">
                    Zobrazit v administraci →
                  </a>
                </div>
              </div>

              <div class="footer">
                <p>AC Heating - Admin Notifikace</p>
                <p style="font-size: 12px; color: #9ca3af;">
                  Tento email byl odeslán automaticky při přijetí nové poptávky.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Admin notification email sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    return { success: false, error };
  }
}

export async function sendCustomerConfirmation({ lead }: CustomerConfirmationParams) {
  try {
    const resendClient = getResendClient();

    if (!resendClient) {
      console.warn('⚠️ Resend client not available. Skipping customer confirmation email.');
      return { success: false, error: 'Email service not configured' };
    }

    await resendClient.emails.send({
      from: 'AC Heating <info@ac-heating.cz>',
      to: lead.email,
      subject: 'Děkujeme za poptávku - AC Heating',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #DC2626 0%, #EA580C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .highlight { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✅ Děkujeme!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Vaše poptávka byla úspěšně odeslána</p>
              </div>
              
              <div class="content">
                <p style="font-size: 16px;">Dobrý den ${lead.firstName},</p>
                
                <p>
                  Děkujeme za Váš zájem o naše služby. Vaše poptávka byla úspěšně odeslána 
                  a náš tým ji co nejdříve zpracuje.
                </p>

                <div class="highlight">
                  <p style="margin: 0; font-weight: bold; color: #059669;">
                    📞 Ozveme se Vám do 24 hodin
                  </p>
                </div>

                <p>
                  V případě naléhavé poptávky nás můžete kontaktovat přímo:
                </p>

                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;">📧 Email: <a href="mailto:info@ac-heating.cz">info@ac-heating.cz</a></li>
                  <li style="margin-bottom: 10px;">📱 Telefon: <a href="tel:+420725539825">+420 725 539 825</a></li>
                </ul>

                <p style="margin-top: 30px;">
                  S pozdravem,<br>
                  <strong>Tým AC Heating</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>AC Heating</strong> - Tepelná čerpadla a fotovoltaika</p>
                <p style="font-size: 12px; color: #9ca3af;">
                  KUFI INT, s.r.o. | Staroplzenecká 177, 326 00 Letkov<br>
                  18+ let zkušeností | 7500+ instalací
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Customer confirmation email sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send customer confirmation:', error);
    return { success: false, error };
  }
}
