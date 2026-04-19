import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import * as fs from "node:fs";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // fs.writeFileSync('/storage/test3.txt', 'Hello, world!');
    fs.readFileSync("/storage/01_Петичка.mp4", "utf8");
    return this.appService.getHello();
  }
}
