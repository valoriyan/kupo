import { RedirectAfterAuth } from "#/contexts/auth";
import { Login } from "#/templates/Login";

const LoginPage = () => {
  return <Login />;
};

export default RedirectAfterAuth(LoginPage);
