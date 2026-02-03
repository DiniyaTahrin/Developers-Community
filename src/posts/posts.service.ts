import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReactionsService } from 'src/reactions/reactions.service';
import { User } from '../users/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './schemas/post.schema';
@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly reactionsService: ReactionsService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    // Optional: verify user exists (safer)
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create post linked to author
    const post = new this.postModel({
      ...createPostDto,
      author: user._id, // userId is already the Mongo ObjectId
    });

    await post.save();
    this.logger.log(`Post created by ${user.email}: ${post.title}`);

    return post;
  }
  async findAll() {
    return this.postModel.find().populate('author', 'name email').exec();
  }

  async findOne(postId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException('Post not found');
    //Get reaction count
    const reactionCount =
      await this.reactionsService.getReactionCountForPost(postId);
    return {
      ...post.toObject(),
      reactions: reactionCount, // { likes: 5, dislikes: 2 }
    };
  }
}
