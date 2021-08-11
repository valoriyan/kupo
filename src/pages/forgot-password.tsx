import { RedirectAfterAuth } from "#/contexts/auth";
import { ForgotPassword } from "#/templates/ForgotPassword";

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default RedirectAfterAuth(ForgotPasswordPage);
