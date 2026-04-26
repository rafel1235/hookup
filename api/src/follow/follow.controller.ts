import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // Inizia a seguire: POST /follow/:id
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async follow(@Request() req, @Param('id') profileId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.followService.follow(req.user.userId, profileId);
  }

  // Smetti di seguire: DELETE /follow/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unfollow(@Request() req, @Param('id') profileId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.followService.unfollow(req.user.userId, profileId);
  }

  // Vedi chi segue un profilo specifico
  @Get(':id/followers')
  async getFollowers(@Param('id') profileId: string) {
    return this.followService.getFollowers(profileId);
  }
}
