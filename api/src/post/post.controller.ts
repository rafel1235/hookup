import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importiamo il guard
import { CreatePostDto } from './dto/create-post.dto'; // <-- 1. Importa il DTO

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. CREA POST (ORA PROTETTO!)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req, @Body() createPostDto: CreatePostDto) { // <-- 2. Usa il DTO nel @Body()
    // Usiamo req.user.userId che arriva dal token sicuro
    return this.postService.createPost(req.user.userId, createPostDto);
  }

  // 2. FEED PUBBLICO (Resta aperto, tutti possono leggerlo)
  @Get()
  async findAll() {
    return this.postService.findAll();
  }
}
