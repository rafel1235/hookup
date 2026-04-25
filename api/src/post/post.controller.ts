import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Crea un post: POST http://localhost:3000/posts/:userId
  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body() body: { title: string; content?: string },
  ) {
    return this.postService.createPost(userId, body);
  }

  // Leggi tutti i post: GET http://localhost:3000/posts
  @Get()
  async findAll() {
    return this.postService.findAll();
  }
}
