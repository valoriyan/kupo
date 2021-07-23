import {
  Body,
    Controller,
    Post,
    Route,
  } from "tsoa";
  

interface RegisterUserParams {
  email: string;
  password: string;
  username: string;
}

interface LoginUserParams {
  email: string;
  password: string;
}

interface SuccessfulAuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Route("auth")
export class AuthController extends Controller {
    @Post("register")
    public async registerUser(
      @Body() requestBody: RegisterUserParams,
    ): Promise<SuccessfulAuthResponse> {
        this.setStatus(201);
        console.log(requestBody);
        return {
          accessToken: "string",
          refreshToken: "string",
        };
    }

    @Post("login")
    public async loginUser(
      @Body() requestBody: LoginUserParams,
    ): Promise<RegisterUserParams> {
        this.setStatus(200);

        console.log(requestBody);

        return {
          accessToken: "string",
          refreshToken: "string",
        };
    }
  }
  