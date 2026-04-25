import { Controller, Body, Patch, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(':userId/update')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() body: { bio?: string; avatarUrl?: string },
  ) {
    return this.profileService.updateBaseProfile(userId, body);
  }

  @Post(':userId/become-creator')
  async becomeCreator(
    @Param('userId') userId: string,
    @Body() body: { categories: string[] },
  ) {
    return this.profileService.activateCreatorProfile(userId, body.categories);
  }

  @Post(':userId/become-pro')
  async becomePro(
    @Param('userId') userId: string,
    @Body() body: { role: string; skills: string[] },
  ) {
    return this.profileService.activateProProfile(
      userId,
      body.role,
      body.skills,
    );
  }
}
