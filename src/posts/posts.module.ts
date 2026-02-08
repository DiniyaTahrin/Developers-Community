import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'src/comments/comments.module';
import { Comment, CommentSchema } from 'src/comments/schemas/comment.schema';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    ReactionsModule,
    CommentsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
