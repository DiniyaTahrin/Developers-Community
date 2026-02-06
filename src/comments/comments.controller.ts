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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('post/:postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Throttle({
    default: {
      limit: 10,
      ttl: 60 * 60 * 1000,
    },
  })
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as { userId: string }).userId;

    return this.commentsService.create(postId, userId, createCommentDto);
  }

  @Get(':postId')
  async findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.findAllByPost(postId);
  }
}
