import { RedirectAfterAuth } from "#/contexts/auth";
import { SignUp } from "#/templates/SignUp";

const SignUpPage = () => {
  return <SignUp />;
};

export default RedirectAfterAuth(SignUpPage);
