import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../comments/schemas/comment.schema';
import { Post } from '../posts/schemas/post.schema';
import { User } from '../users/schemas/user.schema';
import { Reaction } from './schemas/reactions.schema';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<Reaction>,

    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,

    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createReaction(
    userId: string,
    targetId: string,
    type: 'like' | 'dislike',
    targetType: 'post' | 'comment',
  ) {
    // Validate user
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Validate target and assign correct field
    const reactionData: Partial<Reaction> = { user: user._id, type };
    if (targetType === 'post') {
      const post = await this.postModel.findById(targetId);
      if (!post) throw new NotFoundException('Post not found');
      reactionData.post = post._id;
    } else if (targetType === 'comment') {
      const comment = await this.commentModel.findById(targetId);
      if (!comment) throw new NotFoundException('Comment not found');
      reactionData.comment = comment._id;
    }

    // Check existing reaction
    const existingReaction = await this.reactionModel.findOne({
      user: user._id,
      post: reactionData.post,
      comment: reactionData.comment,
    });

    if (existingReaction && existingReaction.type === type) {
      throw new BadRequestException(`You already reacted with '${type}'`);
    }

    // If reaction exists but type is different → update
    if (existingReaction) {
      existingReaction.type = type;
      return existingReaction.save();
    }

    // Create new reaction
    const reaction = new this.reactionModel(reactionData);
    return reaction.save();
  }

  async getReactionCountForPost(postId: string) {
    // Aggregate reactions for this post
    const result = await this.reactionModel.aggregate([
      { $match: { post: new Types.ObjectId(postId) } }, // only reactions for this post
      {
        $group: {
          _id: '$post', // group by postId
          likes: {
            $sum: {
              $cond: [{ $eq: ['$type', 'like'] }, 1, 0], // +1 if type is 'like'
            },
          },
          dislikes: {
            $sum: {
              $cond: [{ $eq: ['$type', 'dislike'] }, 1, 0], // +1 if type is 'dislike'
            },
          },
        },
      },
    ]);

    // If no reactions, return 0
    if (result.length === 0) return { likes: 0, dislikes: 0 };

    return { likes: result[0].likes, dislikes: result[0].dislikes };
  }
}
