import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Definisce il prefisso /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. REGISTRAZIONE (Aggiunta ora)
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      body.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      body.password,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      body.username,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      body.displayName,
    );
  }

  // 2. LOGIN
  @Post('login')
  async login(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.login(body.email, body.password);
  }
}
