/**
 * takeKONTROL — account / auth translations
 * Lifted verbatim from the dictionary that used to live at the top of
 * login.js.
 */

export const dictionary = {
de: {
  nav_home: 'Resilienz', nav_shop: 'Shop', nav_team: 'Team', nav_contact: 'Kontakt', nav_safety: 'Produktsicherheit',

  auth_login_title: 'Anmelden', auth_login_sub: 'Willkommen zurück bei takeKONTROL.',
  btn_google_login: 'Mit Google anmelden', auth_or: 'oder mit E-Mail',
  lbl_email: 'E-Mail Adresse', lbl_pass: 'Passwort', link_forgot: 'Passwort vergessen?', btn_login: 'Anmelden →',
  text_no_account: 'Noch kein Konto?', link_register: 'Jetzt registrieren',

  auth_reg_title: 'Konto erstellen', auth_reg_sub: 'Werden Sie Teil der takeKONTROL Community.',
  btn_google_reg: 'Mit Google registrieren', auth_or_reg: 'oder per E-Mail registrieren',
  lbl_first: 'Vorname', lbl_last: 'Nachname', btn_register: 'Registrieren →',
  text_has_account: 'Bereits ein Konto?', link_login: 'Anmelden',

  auth_forgot_title: 'Passwort zurücksetzen', auth_forgot_sub: 'Geben Sie Ihre E-Mail ein, um einen Reset-Link zu erhalten.',
  btn_reset: 'Link senden →', link_back_login: '← Zurück zur Anmeldung',

  auth_loading: 'Sitzung wird geprüft…',

  dash_title: 'Mein Konto', dash_profile: 'Profil & Einstellungen', dash_address: 'Adressen verwalten',
  dash_orders: 'Meine Bestellungen', dash_cancelled: 'Stornierte Artikel', dash_returns: 'Rückgabe & Erstattung',
  dash_status_lbl: 'Bereitschafts-Status:', dash_status_val: 'Betriebsbereit / Aktiv',
  btn_logout: 'Abmelden', btn_to_shop: 'Zurück zum Shop',

  lbl_pass_confirm: 'Passwort bestätigen',
  pass_hint: 'Mindestens 8 Zeichen.',
  show_pass: 'Passwort anzeigen', hide_pass: 'Passwort verbergen',

  verify_banner: 'Bitte bestätigen Sie Ihre E-Mail-Adresse.',
  verify_send: 'Erneut senden',
  verify_sent: 'Bestätigungs-E-Mail gesendet. Bitte prüfen Sie Ihren Posteingang (auch den Spam-Ordner).',

  toast_login_success: 'Erfolgreich angemeldet. Leite weiter…',
  toast_reg_success: 'Konto erstellt. Leite weiter…',
  toast_reset_success: 'Falls ein Konto existiert, wurde ein Reset-Link gesendet.',
  toast_wait: 'Bitte warten…',
  toast_logout: 'Erfolgreich abgemeldet.',
  toast_popup_fallback: 'Pop-up blockiert – Weiterleitung zu Google…',

  err_generic: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
  err_invalid_credential: 'E-Mail oder Passwort ist nicht korrekt.',
  err_invalid_email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  err_email_in_use: 'Für diese E-Mail existiert bereits ein Konto. Bitte melden Sie sich an.',
  err_weak_password: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
  err_pass_mismatch: 'Die Passwörter stimmen nicht überein.',
  err_too_many: 'Zu viele Versuche. Bitte warten Sie einen Moment.',
  err_network: 'Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.',
  err_popup_closed: 'Anmeldung abgebrochen.',
  err_unauthorized_domain: 'Diese Domain ist nicht für die Anmeldung freigegeben.',
  err_user_disabled: 'Dieses Konto wurde deaktiviert.',
  err_link_prompt: 'Diese E-Mail ist bereits mit einem Passwort registriert. Bitte melden Sie sich mit Ihrem Passwort an – Ihr Google-Konto wird danach automatisch verknüpft.',
  err_linked: 'Google-Konto erfolgreich verknüpft.'
},
en: {
  nav_home: 'Resilience', nav_shop: 'Shop', nav_team: 'Team', nav_contact: 'Contact', nav_safety: 'Product Safety',

  auth_login_title: 'Sign In', auth_login_sub: 'Welcome back to takeKONTROL.',
  btn_google_login: 'Sign in with Google', auth_or: 'or sign in with email',
  lbl_email: 'Email address', lbl_pass: 'Password', link_forgot: 'Forgot password?', btn_login: 'Sign In →',
  text_no_account: "Don't have an account?", link_register: 'Sign up now',

  auth_reg_title: 'Create Account', auth_reg_sub: 'Join the takeKONTROL community.',
  btn_google_reg: 'Sign up with Google', auth_or_reg: 'or sign up with email',
  lbl_first: 'First name', lbl_last: 'Last name', btn_register: 'Create Account →',
  text_has_account: 'Already have an account?', link_login: 'Sign In',

  auth_forgot_title: 'Reset Password', auth_forgot_sub: 'Enter your email to receive a reset link.',
  btn_reset: 'Send reset link →', link_back_login: '← Back to Sign In',

  auth_loading: 'Checking your session…',

  dash_title: 'My Account', dash_profile: 'Profile & Settings', dash_address: 'Manage Addresses',
  dash_orders: 'Your Orders', dash_cancelled: 'Cancelled Items', dash_returns: 'Returns & Refunds',
  dash_status_lbl: 'Readiness status:', dash_status_val: 'Operational / Active',
  btn_logout: 'Log Out', btn_to_shop: 'Back to Shop',

  lbl_pass_confirm: 'Confirm password',
  pass_hint: 'At least 8 characters.',
  show_pass: 'Show password', hide_pass: 'Hide password',

  verify_banner: 'Please verify your email address.',
  verify_send: 'Resend',
  verify_sent: 'Verification email sent. Please check your inbox (and spam folder).',

  toast_login_success: 'Successfully signed in. Redirecting…',
  toast_reg_success: 'Account created. Redirecting…',
  toast_reset_success: 'If an account exists, a reset link has been sent.',
  toast_wait: 'Please wait…',
  toast_logout: 'Successfully logged out.',
  toast_popup_fallback: 'Pop-up blocked — redirecting to Google…',

  err_generic: 'Something went wrong. Please try again.',
  err_invalid_credential: 'Email or password is incorrect.',
  err_invalid_email: 'Please enter a valid email address.',
  err_email_in_use: 'An account already exists for this email. Please sign in.',
  err_weak_password: 'Password must be at least 8 characters.',
  err_pass_mismatch: 'Passwords do not match.',
  err_too_many: 'Too many attempts. Please wait a moment.',
  err_network: 'No connection. Please check your internet.',
  err_popup_closed: 'Sign-in cancelled.',
  err_unauthorized_domain: 'This domain is not authorised for sign-in.',
  err_user_disabled: 'This account has been disabled.',
  err_link_prompt: 'This email is already registered with a password. Sign in with your password and your Google account will be linked automatically.',
  err_linked: 'Google account linked successfully.'
}
};
