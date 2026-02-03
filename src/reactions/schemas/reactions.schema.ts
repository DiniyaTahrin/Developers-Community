import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment } from 'src/comments/schemas/comment.schema';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

export type ReactionDocument = Reaction & Document;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: ['like', 'dislike'], required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: Post.name })
  post?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Comment.name })
  comment?: Types.ObjectId;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
