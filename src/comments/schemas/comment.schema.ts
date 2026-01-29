import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  content: string;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Types.ObjectId;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
