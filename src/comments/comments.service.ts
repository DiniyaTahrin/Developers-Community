import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReactionsService } from 'src/reactions/reactions.service';
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
    private readonly reactionsService: ReactionsService,
  ) {}

  async create(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const { content, parentCommentId } = createCommentDto;

    // Check if user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if post exists
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If replying, check parent comment
    const parentComment = parentCommentId
      ? await this.commentModel.findById(parentCommentId)
      : null;

    if (parentCommentId && !parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    // Create comment
    const comment = new this.commentModel({
      content,
      author: user._id,
      post: post._id,
      parentComment: parentComment ? parentComment._id : undefined,
    });

    await comment.save();

    this.logger.log(`Comment created by ${user.email} on post "${post.title}"`);

    return comment;
  }

  async findAllByPost(postId: string) {
    const comments = await this.commentModel
      .find({ post: new Types.ObjectId(postId) })
      .populate('author', 'name email')
      .exec();

    return Promise.all(
      comments.map(async (comment) => {
        const reactions =
          await this.reactionsService.getReactionCountForComment(
            comment._id.toString(),
          );

        return {
          ...comment.toObject(),
          reactions,
        };
      }),
    );
  }
}
