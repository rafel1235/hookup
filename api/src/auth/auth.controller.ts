import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Questo definisce il prefisso /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // Questo definisce la rotta /login
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}
