import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('Reactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  // React to a POST
  @Post('post/:postId')
  async reactToPost(
    @Param('postId') postId: string,
    @Body() createReactionDto: CreateReactionDto,
    @Req() req: any, // JWT payload
  ) {
    //console.log('JWT user:', req.user);
    const userId = req.user.userId;
    return this.reactionsService.createReaction(
      userId,
      postId,
      createReactionDto.type,
      'post',
    );
  }

  // React to a COMMENT
  @Post('comment/:commentId')
  async reactToComment(
    @Param('commentId') commentId: string,
    @Body() createReactionDto: CreateReactionDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.reactionsService.createReaction(
      userId,
      commentId,
      createReactionDto.type,
      'comment',
    );
  }
}
