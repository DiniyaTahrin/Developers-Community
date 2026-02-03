import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
