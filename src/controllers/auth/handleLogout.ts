import {
  AuthController,
} from "./authController";


export async function handleLogout({
  controller,
}: {
  controller: AuthController;
}): Promise<void> {
    controller.setHeader(
        "Set-Cookie",
        `refreshToken=deleted; HttpOnly; Secure; Expires=${new Date(0).toUTCString()};`,
    );
  
    controller.setStatus(200);
}
