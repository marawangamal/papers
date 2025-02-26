export enum ENDPOINTS {
  root = `/`,
  login = `/login`, // for both login/signup
  dashboard = `/dashboard`,
  search = `/search`,
  // Auth
  emailVerificationCallback = `/callbacks/confirm-email`, // redirected here from email
  emailVerificationSentPage = `/verify-email`, // redirected here after email is sent
  resetPasswordCallback = `/callbacks/reset-password?next=/update-password`, // redirects to update-password
  resetPasswordPage = `/reset-password`, // redirected here after email is sent
  resetPasswordSentPage = `/reset-password/sent`, // redirected here after email is sent
  updatePasswordPage = `/update-password`, // redirected here after email is sent
}
