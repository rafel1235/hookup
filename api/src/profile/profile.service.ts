import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProfileService {
  
  // 1. OTTIENI IL PROFILO COMPLETO
  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, kycVerified: true } },
        creatorData: true,
        proData: true,
      },
    });

    if (!profile) throw new NotFoundException('Profilo non trovato');
    return profile;
  }

  // 2. AGGIORNA LE INFORMAZIONI DI BASE (Bio, Avatar)
  async updateBaseProfile(userId: string, data: { bio?: string; avatarUrl?: string; displayName?: string }) {
    return await prisma.profile.update({
      where: { userId },
      data: {
        ...(data.bio && { bio: data.bio }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
        ...(data.displayName && { displayName: data.displayName }),
      },
    });
  }

  // 3. DIVENTA UN CREATOR (Attiva il modulo Creator)
  async activateCreatorProfile(userId: string, categories: string[]) {
    const profile = await this.getProfile(userId);

    return await prisma.creatorProfile.create({
      data: {
        profileId: profile.id,
        categories: categories, // es: ["BDSM", "Fetish"]
      },
    });
  }

  // 4. DIVENTA UN PROFESSIONISTA (Attiva il modulo CV)
  async activateProProfile(userId: string, role: string, skills: string[]) {
    const profile = await this.getProfile(userId);

    return await prisma.professionalProfile.create({
      data: {
        profileId: profile.id,
        role: role, // es: "Videomaker"
        skills: skills, // es: ["Premiere", "Luci"]
      },
    });
  }
}
