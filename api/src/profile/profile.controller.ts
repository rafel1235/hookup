import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Ottieni il profilo passando l'ID dell'utente nell'URL
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return this.profileService.getProfile(userId);
  }

  // Aggiorna bio e foto
  @Patch(':userId/update')
  async updateProfile(
    @Param('userId') userId: string, 
    @Body() body: { bio?: string; avatarUrl?: string; displayName?: string }
  ) {
    return this.profileService.updateBaseProfile(userId, body);
  }

  // Attiva l'account Creator
  @Post(':userId/become-creator')
  async becomeCreator(
    @Param('userId') userId: string,
    @Body() body: { categories: string[] }
  ) {
    return this.profileService.activateCreatorProfile(userId, body.categories);
  }

  // Attiva l'account Professionista
  @Post(':userId/become-pro')
  async becomePro(
    @Param('userId') userId: string,
    @Body() body: { role: string; skills: string[] }
  ) {
    return this.profileService.activateProProfile(userId, body.role, body.skills);
  }
}