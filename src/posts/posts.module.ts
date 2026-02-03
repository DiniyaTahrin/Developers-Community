import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ReactionsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
