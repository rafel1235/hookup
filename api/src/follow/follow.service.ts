import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class FollowService {
  // 1. SEGUI UN UTENTE
  async follow(followerUserId: string, followingProfileId: string) {
    // Troviamo il profilo di chi vuole seguire
    const followerProfile = await prisma.profile.findUnique({
      where: { userId: followerUserId },
    });
    if (!followerProfile)
      throw new NotFoundException('Il tuo profilo non esiste');
    if (followerProfile.id === followingProfileId)
      throw new BadRequestException('Non puoi seguirti da solo');

    return await prisma.follow.create({
      data: {
        followerId: followerProfile.id,
        followingId: followingProfileId,
      },
    });
  }

  // 2. SMETTI DI SEGUIRE
  async unfollow(followerUserId: string, followingProfileId: string) {
    const followerProfile = await prisma.profile.findUnique({
      where: { userId: followerUserId },
    });
    if (!followerProfile) throw new NotFoundException('Profilo non trovato');

    return await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerProfile.id,
          followingId: followingProfileId,
        },
      },
    });
  }

  // 3. LISTA FOLLOWER
  async getFollowers(profileId: string) {
    return await prisma.follow.findMany({
      where: { followingId: profileId },
      include: { follower: true },
    });
  }
}
