import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importa il Guard

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard) // Protegge questa rotta
  @Patch('update-me') // Nota: non c'è più :userId nell'URL!
  async updateMyProfile(
    @Request() req, // Otteniamo i dati dell'utente dal token JWT
    @Body() body: { bio?: string; avatarUrl?: string },
  ) {
    // req.user.userId contiene l'ID sicuro estratto dal token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.profileService.updateBaseProfile(req.user.userId, body);
  }

  // Nuova rotta: Ottieni un profilo pubblico tramite ID
  @Get(':id')
  // eslint-disable-next-line @typescript-eslint/require-await
  async getPublicProfile(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.profileService.getProfileById(id);
  }
}
