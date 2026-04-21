import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient(); 

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, username: string, displayName: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('Email già in uso');

    const existingProfile = await prisma.profile.findUnique({ where: { username } });
    if (existingProfile) throw new ConflictException('Username non disponibile');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            username,
            displayName,
          },
        },
      },
      include: { profile: true },
    });

    return this.generateToken(newUser.id, newUser.email);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenziali non valide');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Credenziali non valide');

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async mockKycVerification(userId: string) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kycVerified: true, kycToken: 'mock-verified-token-123' }
    });

    return { success: true, message: 'KYC verificato', status: updatedUser.kycVerified };
  }
}