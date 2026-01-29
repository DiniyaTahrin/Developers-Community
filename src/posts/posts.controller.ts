import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt')) //Protect route
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId = req.user.userId; // comes from JwtStrategy validate()
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll(); // public route
  }
}
