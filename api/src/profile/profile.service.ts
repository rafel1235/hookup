import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProfileService {
  async getProfileById(id: string) {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        posts: { orderBy: { createdAt: 'desc' } }, // Vediamo anche i suoi post!
        _count: {
          select: { followers: true, following: true }, // Contiamo follower/following
        },
      },
    });
    if (!profile) throw new NotFoundException('Profilo non trovato');
    return profile;
  }

  //   Aggiorna Bio e Avatar
  async updateBaseProfile(
    userId: string,
    data: { bio?: string; avatarUrl?: string },
  ) {
    return await prisma.profile.update({
      where: { userId },
      data: {
        ...(data.bio && { bio: data.bio }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
      },
    });
  }

  // Diventa un Creator
  async activateCreatorProfile(userId: string, categories: string[]) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profilo non trovato');

    return await prisma.creatorProfile.create({
      data: {
        profileId: profile.id,
        categories: categories,
      },
    });
  }

  // Diventa un Professionista
  async activateProProfile(userId: string, role: string, skills: string[]) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profilo non trovato');

    return await prisma.professionalProfile.create({
      data: {
        profileId: profile.id,
        role: role,
        skills: skills,
      },
    });
  }
}
