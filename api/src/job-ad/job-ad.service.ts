import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JobAdService {
  // 1. CREA UN ANNUNCIO
  async create(
    userId: string,
    data: {
      title: string;
      description: string;
      location?: string;
      budget?: string;
    },
  ) {
    // Troviamo il profilo dell'utente loggato
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profilo non trovato');

    return await prisma.jobAd.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        budget: data.budget,
        profileId: profile.id, // Colleghiamo l'annuncio al profilo
      },
    });
  }

  // 2. RECUPERA TUTTI GLI ANNUNCI ATTIVI
  async findAll() {
    return await prisma.jobAd.findMany({
      where: { isActive: true }, // Solo annunci ancora aperti
      include: {
        profile: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. CHIUDI UN ANNUNCIO (Disattiva)
  async deactivate(userId: string, adId: string) {
    const profile = await prisma.profile.findUnique({ where: { userId } });

    return await prisma.jobAd.updateMany({
      where: {
        id: adId,
        profileId: profile?.id,
      },
      data: { isActive: false },
    });
  }
}
