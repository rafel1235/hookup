import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PostService {
  // 1. CREA UN NUOVO POST
  async createPost(
    userId: string,
    data: { content?: string; mediaUrls?: string[] },
  ) {
    // Cerchiamo il profilo dell'utente e verifichiamo che sia un Creator
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
      include: { creatorData: true },
    });

    if (!userProfile?.creatorData) {
      throw new NotFoundException(
        'Solo i Creator possono pubblicare post. Attiva il profilo Creator prima.',
      );
    }

    return await prisma.post.create({
      data: {
        content: data.content,
        mediaUrls: data.mediaUrls || [], // Usa l'array di stringhe definito nello schema
        profileId: userProfile.id, // Colleghiamo il post al Profilo, come richiesto dallo schema
        isPremium: false, // Campo esistente nel tuo schema
      },
    });
  }

  // 2. RECUPERA TUTTI I POST
  async findAll() {
    return await prisma.post.findMany({
      include: {
        profile: {
          // Usiamo 'profile' perché è così che si chiama la relazione nello schema
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
}
