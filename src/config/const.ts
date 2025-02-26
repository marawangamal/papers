export enum ENDPOINTS {
  root = `/`,
  login = `/login`, // for both login/signup
  dashboard = `/dashboard`,
  search = `/search`,
  emailVerificationCallback = `/auth/callback`, // redirected here from email
  emailVerificationSent = `/verify/email`, // redirected here after email is sent
  resetPasswordCallback = `/auth/reset?next=/update-password`, // redirects to update-password
  resetPasswordPage = `/reset-password`, // redirected here after email is sent
  resetPasswordSent = `/reset-password/sent`, // redirected here after email is sent
  updatePasswordCallback = `/update-password`, // redirected here after email is sent
}
