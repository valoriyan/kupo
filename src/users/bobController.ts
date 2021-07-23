import {
    Controller,
    Get,
    Route,
  } from "tsoa";
  
  @Route("bob")
  export class BobsController extends Controller {
    @Get("")
    public async getUser(
    ): Promise<{
        hmm: boolean,
        yoah: string;
    }> {
      return {
          hmm: false,
          yoah: "okay",
      };
    }  
  }
  