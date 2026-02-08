import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt')) //Protect route
  @ApiBearerAuth()
  @Throttle({
    default: {
      limit: 10, // 10 requests
      ttl: 60 * 60 * 1000, // per 1 hour
    },
  })
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    // comes from JwtStrategy validate()
    const post = await this.postsService.create(createPostDto, userId);
    return post;
  }

  @Get()
  async findAll() {
    return this.postsService.findAll(); // public route
  }

  @Get('ranked')
  async getRankedPosts() {
    return this.postsService.getRankedPosts();
  }

  @Get(':id')
  async findOne(@Param('id') postId: string) {
    const onePost = await this.postsService.findOne(postId);
    return onePost;
  }
}
