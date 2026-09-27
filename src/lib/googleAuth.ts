import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Provider for standard identity sign-in
export const googleProvider = new GoogleAuthProvider();
// Hint prompt for account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// In-memory token cache (do not store access tokens in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string; email: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!accessToken) {
      throw new Error('Could not retrieve Google OAuth access token.');
    }

    cachedAccessToken = accessToken;
    const email = result.user.email || '';

    return {
      user: result.user,
      accessToken,
      email
    };
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Encodes an RFC 2822 email message in base64url format for the Gmail API
 */
function createRawEmail(to: string, subject: string, htmlContent: string): string {
  // RFC 2047 MIME encoded subject for UTF-8 safety
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  const email = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(htmlContent)))
  ].join('\r\n');

  // Convert standard base64 to base64url required by Gmail API
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Dispatches an authentic OTP email directly to the user's external inbox using the official Gmail API
 */
export async function sendOtpViaGmailApi(
  accessToken: string,
  toEmail: string,
  otpCode: string,
  recipientName?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const subject = `${otpCode} is your Project Nevo verification passcode`;
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 18px; background-color: #ffffff; color: #0f172a;">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 700;">Project Nevo · Circular Textile Lookbook</h2>
        </div>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
          Hello ${recipientName || 'Contributor'},
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Here is your 6-digit one-time passcode (OTP) to verify your Google Account and access your wardrobe lookbook and Pune recycling pathways:
        </p>
        
        <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; padding: 22px; text-align: center; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0f172a; border-radius: 14px; margin: 24px 0;">
          ${otpCode}
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
          ⏱️ This passcode will expire in <strong>5 minutes</strong>. If you did not request this verification, please safely disregard this email.
        </p>
        
        <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #94a3b8;">
          Sent securely via Google Workspace OAuth for Project Nevo.
        </div>
      </div>
    `;

    const rawMessage = createRawEmail(toEmail, subject, htmlBody);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: rawMessage })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gmail API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id
    };
  } catch (err: any) {
    console.error('Failed to send email via Gmail API:', err);
    return {
      success: false,
      error: err.message || 'Failed to dispatch email via Gmail API.'
    };
  }
}
