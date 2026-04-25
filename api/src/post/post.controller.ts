import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importiamo il guard

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. CREA POST (ORA PROTETTO!)
  @UseGuards(JwtAuthGuard)
  @Post('create') // Abbiamo tolto :userId dall'URL!
  async create(@Request() req, @Body() body: { content?: string; mediaUrls?: string[] }) {
    // Usiamo req.user.userId che arriva dal token sicuro
    return this.postService.createPost(req.user.userId, body);
  }

  // 2. FEED PUBBLICO (Resta aperto, tutti possono leggerlo)
  @Get()
  async findAll() {
    return this.postService.findAll();
  }
}
