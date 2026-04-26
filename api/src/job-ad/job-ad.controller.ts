import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobAdService } from './job-ad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-ads')
export class JobAdController {
  constructor(private readonly jobAdService: JobAdService) {}

  // Pubblica un nuovo annuncio
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body()
    body: {
      title: string;
      description: string;
      location?: string;
      budget?: string;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.jobAdService.create(req.user.userId, body);
  }

  // Leggi tutti gli annunci (Pubblico)
  @Get()
  async findAll() {
    return this.jobAdService.findAll();
  }

  // Disattiva un annuncio
  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  async deactivate(@Request() req, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.jobAdService.deactivate(req.user.userId, id);
  }
}
