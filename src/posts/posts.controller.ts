import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt')) //Protect route
  @ApiBearerAuth()
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    // comes from JwtStrategy validate()
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll(); // public route
  }
}
