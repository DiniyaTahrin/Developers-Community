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
import type { Request } from 'express';
import { successResponse } from 'src/common/utils/response.util';
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
    const post = await this.postsService.create(createPostDto, userId);
    return successResponse('Post created successfully', post);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll(); // public route
  }

  @Get(':id')
  async findOne(@Param('id') postId: string) {
    return this.postsService.findOne(postId);
  }
}
