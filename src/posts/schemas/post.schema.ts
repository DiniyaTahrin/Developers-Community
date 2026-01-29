import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
