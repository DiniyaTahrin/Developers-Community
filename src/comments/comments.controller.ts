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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(
      createCommentDto,
      req.user.userId, // comes from JWT
    );
  }

  @Get(':postId')
  async findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.findAllByPost(postId);
  }
}
