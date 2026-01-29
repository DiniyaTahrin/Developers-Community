import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { User } from '../users/schemas/user.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { postID, content } = createCommentDto;

    //  Check if user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //  Check if post exists
    const post = await this.postModel.findById(postID);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    //  Create comment
    const comment = new this.commentModel({
      content,
      author: user._id,
      post: post._id,
    });

    await comment.save();

    // Log activity
    this.logger.log(`Comment created by ${user.email} on post "${post.title}"`);

    return comment;
  }

  async findAllByPost(postID: string) {
    return this.commentModel
      .find({ post: postID })
      .populate('author', 'name email')
      .populate('post', 'title content')
      .exec();
  }
}
